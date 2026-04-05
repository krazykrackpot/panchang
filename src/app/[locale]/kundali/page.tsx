'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import BirthForm from '@/components/kundali/BirthForm';
import ConvergenceSummary from '@/components/kundali/ConvergenceSummary';
import AIReadingButton from '@/components/kundali/AIReadingButton';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import GoldDivider from '@/components/ui/GoldDivider';
import ShareButton from '@/components/ui/ShareButton';
import PrintButton from '@/components/ui/PrintButton';
import { Download, Save, Check, ScrollText } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { generateKundaliPrintHtml } from '@/lib/pdf/kundali-pdf';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS, GRAHA_ABBREVIATIONS } from '@/lib/constants/grahas';
import { getPlanetaryPositions, toSidereal, dateToJD, normalizeDeg } from '@/lib/ephem/astronomical';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';
import type { TippanniContent, PlanetInsight } from '@/lib/kundali/tippanni-types';
import type { MahadashaOverview, AntardashaSynthesis, PratyantardashaSynthesis, PeriodAssessment } from '@/lib/tippanni/dasha-synthesis-types';
import { detectAfflictedPlanets, type AfflictedPlanet } from '@/lib/puja/affliction-detector';
import type { KundaliData, BirthData, ChartStyle, PlanetPosition, AshtakavargaData, DivisionalChart, GrahaDetail, UpagrahaPosition } from '@/types/kundali';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import type { BhavaBalaResult } from '@/lib/kundali/bhavabala';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import type { Locale } from '@/types/panchang';
import type { SadeSatiAnalysis, NakshatraTransitEntry } from '@/lib/kundali/sade-sati-analysis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { useBirthDataStore } from '@/stores/birth-data-store';
import ChartChatTab from '@/components/kundali/ChartChatTab';
import { generateVargaTippanni, type VargaChartTippanni, type VargaSynthesis } from '@/lib/tippanni/varga-tippanni';
import PaywallGate from '@/components/ui/PaywallGate';
import InfoBlock from '@/components/ui/InfoBlock';
import { ShadbalaInterpretation, YogasInterpretation, AvasthasInterpretation, BhavabalaInterpretation, PlanetsInterpretation, DashaInterpretation, JaiminiInterpretation } from '@/components/kundali/InterpretationHelpers';
import { hasRashiDrishti, getMutualRashiDrishti } from '@/lib/jaimini/rashi-drishti';
import LifeTimeline from '@/components/kundali/LifeTimeline';

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
      className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6"
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
            {p.isVargottama && <span className="text-gold-light text-xs font-bold px-1.5 py-0.5 bg-gold-primary/15 rounded border border-gold-primary/30" title={locale === 'en' ? 'Strength equal to double exaltation — same sign in D1 and D9' : 'वर्गोत्तम — D1 और D9 में एक ही राशि'}>Vgm</span>}
            {p.isMrityuBhaga && <span className="text-rose-400 text-xs font-bold px-1.5 py-0.5 bg-rose-500/10 rounded" title={locale === 'en' ? 'At or near Mrityu Bhaga — dangerous degree, severely weakened' : 'मृत्यु भाग — खतरनाक अंश, बल में गिरावट'}>MB</span>}
            {p.isPushkarNavamsha && <span className="text-sky-300 text-xs font-bold px-1.5 py-0.5 bg-sky-500/10 rounded border border-sky-400/20" title={locale === 'en' ? 'Pushkar Navamsha — supremely auspicious navamsha position' : 'पुष्कर नवांश — अत्यंत शुभ नवांश स्थिति'}>PKN</span>}
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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const user = useAuthStore(s => s.user);

  const handleSaveChart = async () => {
    if (!user || !kundali) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setSaving(true);
    try {
      await supabase.from('saved_charts').insert({
        user_id: user.id,
        label: kundali.birthData.name || 'Chart',
        birth_data: {
          name: kundali.birthData.name,
          date: kundali.birthData.date,
          time: kundali.birthData.time,
          place: kundali.birthData.place,
          lat: kundali.birthData.lat,
          lng: kundali.birthData.lng,
          timezone: kundali.birthData.timezone,
        },
        is_primary: false,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* silently fail */ }
    setSaving(false);
  };
  const [activeTab, setActiveTab] = useState<'chart' | 'planets' | 'dasha' | 'ashtakavarga' | 'tippanni' | 'varga' | 'chat' | 'jaimini' | 'graha' | 'yogas' | 'shadbala' | 'bhavabala' | 'avasthas' | 'argala' | 'sphutas' | 'sadesati' | 'patrika' | 'timeline'>('chart');
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [activeChart, setActiveChart] = useState<string>('D1');
  const [dashaSystem, setDashaSystem] = useState('vimshottari');
  const [showTransits, setShowTransits] = useState(false);
  const patrikaRef = useRef<HTMLDivElement>(null);
  const [transitData, setTransitData] = useState<{ planets: { id: number; name: { en: string; hi: string; sa: string }; rashi: number; longitude: number; isRetrograde: boolean }[] } | null>(null);

  // Fetch current transits when toggled on
  useEffect(() => {
    if (showTransits && !transitData) {
      fetch('/api/panchang').then(r => r.json()).then(data => {
        if (data.planets) setTransitData({ planets: data.planets });
      }).catch(() => {});
    }
  }, [showTransits, transitData]);

  // Tippanni insights for planet commentary in Planets & Graha tabs
  const tip = useMemo(() => kundali ? generateTippanni(kundali, locale) : null, [kundali, locale]);

  // ── Sphuta transit windows ────────────────────────────────────────────────
  // Estimates when key planets will next cross each sensitive sphuta degree.
  // Uses average daily motions + birth positions; retrograde adds ~4-6 week variance.
  const sphuataTransitData = useMemo(() => {
    if (!kundali?.sphutas || !kundali.julianDay || !kundali.planets) return null;
    const today = new Date();
    const todayJD = dateToJD(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const daysSince = todayJD - kundali.julianDay;

    const AVG_SPEEDS: Record<number, number> = {
      0: 0.9856, 1: 13.176, 2: 0.524,  3: 1.383,
      4: 0.0831, 5: 1.2,    6: 0.0335, 7: -0.0529, 8: -0.0529,
    };
    const PLANET_NAMES_EN = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
    const PERIOD_YEARS: Record<number, string> = { 0:'~1 yr',1:'~27 days',2:'~2 yrs',3:'~1 yr',4:'~12 yrs',5:'~1 yr',6:'~29.5 yrs',7:'~18 yrs',8:'~18 yrs' };

    const approxCurrentLong = (pid: number): number => {
      const p = kundali.planets.find(pl => pl.planet.id === pid);
      const bLong = p ? p.longitude : 0;
      const speed = AVG_SPEEDS[pid] ?? 0;
      return normalizeDeg(bLong + speed * daysSince);
    };

    const nextTransit = (targetDeg: number, pid: number): {
      label: string; labelHi: string; daysAway: number; isActive: boolean; planetName: string; period: string;
    } => {
      const speed = AVG_SPEEDS[pid];
      if (!speed) return { label: '—', labelHi: '—', daysAway: 9999, isActive: false, planetName: PLANET_NAMES_EN[pid] || 'Unknown', period: '' };
      const curr = approxCurrentLong(pid);
      let delta = speed > 0 ? normalizeDeg(targetDeg - curr) : normalizeDeg(curr - targetDeg);
      const isActive = delta <= 5 || delta >= 355;
      if (isActive) delta = 0;
      const daysAway = isActive ? 0 : delta / Math.abs(speed);
      const centerDate = new Date();
      centerDate.setDate(centerDate.getDate() + Math.round(daysAway));

      // Window = ±5° around target. halfWindowDays = 5 / speed.
      const halfWindowDays = Math.round(5 / Math.abs(speed));
      const showRange = halfWindowDays >= 7; // skip range for Sun (~5d) and Moon (~9h)
      const fmtShort = (d: Date, loc: string) => d.toLocaleDateString(loc, { month: 'short', year: 'numeric' });

      let label: string;
      let labelHi: string;
      if (isActive) {
        // Show how long the window remains
        if (showRange) {
          const exitDate = new Date();
          exitDate.setDate(exitDate.getDate() + halfWindowDays);
          label   = `Active – ${fmtShort(exitDate, 'en-US')}`;
          labelHi = `सक्रिय – ${fmtShort(exitDate, 'hi-IN')}`;
        } else {
          label = 'Active now!'; labelHi = 'अभी सक्रिय!';
        }
      } else if (daysAway < 30) {
        label = `~${Math.round(daysAway)} days`; labelHi = `~${Math.round(daysAway)} दिन`;
      } else if (showRange) {
        const startDate = new Date(); startDate.setDate(startDate.getDate() + Math.max(0, Math.round(daysAway - halfWindowDays)));
        const endDate   = new Date(); endDate.setDate(endDate.getDate()   + Math.round(daysAway + halfWindowDays));
        label   = `${fmtShort(startDate,'en-US')} – ${fmtShort(endDate,'en-US')}`;
        labelHi = `${fmtShort(startDate,'hi-IN')} – ${fmtShort(endDate,'hi-IN')}`;
      } else {
        label   = centerDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        labelHi = centerDate.toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' });
      }
      return { label, labelHi, daysAway: Math.round(daysAway), isActive, planetName: PLANET_NAMES_EN[pid] || '', period: PERIOD_YEARS[pid] || '' };
    };

    const sp = kundali.sphutas;

    const yogiJupiter    = nextTransit(sp.yogiPoint.degree, 4);
    const yogiPlanetTx   = sp.yogiPoint.yogiPlanet !== 4 ? nextTransit(sp.yogiPoint.degree, sp.yogiPoint.yogiPlanet) : null;
    const avayogiSaturn  = nextTransit(sp.avayogiPoint.degree, 6);
    const avayogiPlanTx  = sp.avayogiPoint.avayogiPlanet !== 6 ? nextTransit(sp.avayogiPoint.degree, sp.avayogiPoint.avayogiPlanet) : null;
    const pranaSun       = nextTransit(sp.pranaSphuta.degree, 0);
    const pranaJupiter   = nextTransit(sp.pranaSphuta.degree, 4);
    const dehaMoon       = nextTransit(sp.dehaSphuta.degree, 1);
    const dehaSaturn     = nextTransit(sp.dehaSphuta.degree, 6);
    const mrityuSaturn   = nextTransit(sp.mrityuSphuta.degree, 6);
    const mrityuMars     = nextTransit(sp.mrityuSphuta.degree, 2);
    const triSun         = nextTransit(sp.triSphuta.degree, 0);
    const bijaJupiter    = sp.bijaSphuta ? nextTransit(sp.bijaSphuta.degree, 4) : null;
    const kshetraJupiter = sp.kshetraSphuta ? nextTransit(sp.kshetraSphuta.degree, 4) : null;

    // Build unified timeline for synthesis — top upcoming events
    type TEvent = { date: Date; daysAway: number; planet: number; sphutalabel: string; isBenefic: boolean; action: string; actionHi: string };
    const timeline: TEvent[] = [];
    const addEv = (t: ReturnType<typeof nextTransit>, pid: number, sl: string, benef: boolean, act: string, actHi: string) => {
      if (!t.isActive) {
        const d = new Date(); d.setDate(d.getDate() + t.daysAway);
        timeline.push({ date: d, daysAway: t.daysAway, planet: pid, sphutalabel: sl, isBenefic: benef, action: act, actionHi: actHi });
      }
    };
    addEv(yogiJupiter, 4, 'Yogi Point', true, 'Major positive event window — start new ventures', 'शुभ घटना की खिड़की — नए कार्य आरम्भ करें');
    if (yogiPlanetTx) addEv(yogiPlanetTx, sp.yogiPoint.yogiPlanet, 'Yogi Point', true, `${PLANET_NAMES_EN[sp.yogiPoint.yogiPlanet]} activates your lucky degree`, `योगी ग्रह आपके शुभ बिंदु को सक्रिय करेगा`);
    addEv(avayogiSaturn, 6, 'Avayogi Point', false, 'Saturn stress window — avoid major decisions', 'शनि का चुनौतीपूर्ण गोचर — बड़े निर्णय टालें');
    if (avayogiPlanTx) addEv(avayogiPlanTx, sp.avayogiPoint.avayogiPlanet, 'Avayogi Point', false, 'Avayogi planet transits — exercise caution', 'अवयोगी ग्रह गोचर — सावधानी बरतें');
    addEv(pranaSun, 0, 'Prana Sphuta', true, 'Sun energises your vitality point — good for health actions', 'सूर्य आपकी जीवनशक्ति को ऊर्जित करेगा');
    addEv(mrityuSaturn, 6, 'Mrityu Sphuta', false, 'Saturn over longevity point — health checkup advised', 'शनि दीर्घायु बिंदु पर — स्वास्थ्य परीक्षण कराएं');
    addEv(mrityuMars, 2, 'Mrityu Sphuta', false, 'Mars over longevity point — avoid risky activities', 'मंगल दीर्घायु बिंदु पर — जोखिम से बचें');
    if (bijaJupiter) addEv(bijaJupiter, 4, 'Bija Sphuta', true, 'Jupiter activates male fertility point', 'बृहस्पति बीज स्फुट को सक्रिय करेगा');
    if (kshetraJupiter) addEv(kshetraJupiter, 4, 'Kshetra Sphuta', true, 'Jupiter activates female fertility point', 'बृहस्पति क्षेत्र स्फुट को सक्रिय करेगा');
    timeline.sort((a, b) => a.daysAway - b.daysAway);

    return { yogiJupiter, yogiPlanetTx, avayogiSaturn, avayogiPlanTx, pranaSun, pranaJupiter, dehaMoon, dehaSaturn, mrityuSaturn, mrityuMars, triSun, bijaJupiter, kshetraJupiter, timeline: timeline.slice(0, 7) };
  }, [kundali]);

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
      if (!res.ok || data.error || !data.planets) {
        console.error('Kundali API error:', data.error || `HTTP ${res.status}`);
        setLoading(false);
        return;
      }
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

      {(!kundali || editing) && (
        <BirthForm
          onSubmit={(data, style) => {
            setEditing(false);
            handleGenerate(data, style);
          }}
          loading={loading}
          initialData={editing && kundali ? {
            name: kundali.birthData.name,
            date: kundali.birthData.date,
            time: kundali.birthData.time,
            place: kundali.birthData.place,
            lat: kundali.birthData.lat,
            lng: kundali.birthData.lng,
            timezone: kundali.birthData.timezone,
          } : undefined}
        />
      )}

      {kundali && !editing && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-16">
          <GoldDivider />

          {/* Birth details header */}
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 mb-8 text-center">
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
            {/* Actions */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                {locale === 'en' ? 'Edit Details' : locale === 'hi' ? 'विवरण सम्पादित करें' : 'विवरणं सम्पादयतु'}
              </button>
              {user && (
                <button
                  onClick={handleSaveChart}
                  disabled={saving || saved}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-300 ${
                    saved
                      ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                      : 'border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60'
                  }`}
                >
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved
                    ? (locale === 'en' ? 'Saved' : 'सहेजा गया')
                    : saving
                      ? (locale === 'en' ? 'Saving...' : 'सहेज रहे...')
                      : (locale === 'en' ? 'Save Chart' : 'चार्ट सहेजें')
                  }
                </button>
              )}
              <button
                onClick={() => { setKundali(null); setEditing(false); }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
              >
                {locale === 'en' ? 'New Chart' : 'नया चार्ट'}
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                onClick={() => setActiveTab('patrika')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/40 text-gold-light bg-gold-primary/8 hover:bg-gold-primary/15 hover:border-gold-primary/70 transition-all duration-300"
              >
                <ScrollText className="w-4 h-4" />
                {locale === 'en' ? 'Generate Patrika' : 'पत्रिका बनाएं'}
              </button>
              <button
                onClick={async () => {
                  const { exportKundaliPDF } = await import('@/lib/export/pdf-kundali');
                  const tip = generateTippanni(kundali, locale);
                  exportKundaliPDF(kundali, locale as Locale, tip);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
                aria-label="Download PDF report"
              >
                <Download className="w-4 h-4" />
                PDF Report
              </button>
              <PrintButton
                contentHtml={generateKundaliPrintHtml(kundali, locale as 'en' | 'hi' | 'sa')}
                title={`Kundali — ${kundali.birthData.name}`}
                label={locale === 'en' ? 'Print' : 'प्रिंट'}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
              />
              <ShareButton
                title={`Kundali — ${kundali.birthData.name}`}
                text={`Vedic birth chart for ${kundali.birthData.name} generated on Dekho Panchang`}
                url={typeof window !== 'undefined' ? `${window.location.origin}/${locale}/kundali/shared?n=${encodeURIComponent(kundali.birthData.name)}&d=${kundali.birthData.date}&t=${kundali.birthData.time}&la=${kundali.birthData.lat}&lo=${kundali.birthData.lng}&p=${encodeURIComponent(kundali.birthData.place || '')}&tz=${encodeURIComponent(kundali.birthData.timezone || '')}` : undefined}
              />
            </div>
          </div>

          {/* Ganda Mula Alert — visible on ALL tabs */}
          {(() => {
            const moonP = kundali.planets.find(p => p.planet.id === 1);
            const gandaMulaIds = [1, 9, 10, 18, 19, 27];
            const moonNakId = moonP?.nakshatra?.id;
            if (!moonNakId || !gandaMulaIds.includes(moonNakId)) return null;
            const nakName = moonP?.nakshatra?.name?.[locale] || moonP?.nakshatra?.name?.en;
            return (
              <div className="rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-red-500/5 to-amber-500/10 p-5 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-amber-400 text-lg font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="text-amber-300 font-bold text-base mb-1">
                      {locale === 'en' ? `Ganda Mula — Moon in ${nakName}` : `गण्ड मूल — चन्द्रमा ${nakName} में`}
                    </h4>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {locale === 'en'
                        ? `Birth Moon is in ${nakName} nakshatra (Pada ${moonP?.pada}) — a Ganda Mula nakshatra at a water-fire sign junction. A Ganda Mula Shanti Puja is recommended. See Tippanni tab for detailed analysis and remedies.`
                        : `जन्म चन्द्रमा ${nakName} नक्षत्र (पाद ${moonP?.pada}) में — जल-अग्नि राशि सन्धि का गण्ड मूल नक्षत्र। गण्ड मूल शान्ति पूजा अनुशंसित। विस्तृत विश्लेषण और उपायों के लिए टिप्पणी टैब देखें।`}
                    </p>
                    <Link href="/learn/modules/24-1" className="inline-block mt-2 text-xs text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2" tabIndex={-1}>
                      {locale === 'en' ? 'Learn about Ganda Mula Nakshatras →' : 'गण्ड मूल नक्षत्रों के बारे में जानें →'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Tab navigation — horizontal scroll strip */}
          <div className="relative mb-8">
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-1.5 sm:gap-2 min-w-max sm:flex-wrap sm:justify-center sm:min-w-0">
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
                  { key: 'avasthas' as const, label: locale === 'en' ? 'Avasthas' : 'अवस्था' },
                  { key: 'argala' as const, label: locale === 'en' ? 'Argala' : 'अर्गला' },
                  { key: 'sphutas' as const, label: locale === 'en' ? 'Sphutas' : 'स्फुट' },
                  { key: 'shadbala' as const, label: locale === 'en' ? 'Shadbala' : 'षड्बल' },
                  { key: 'bhavabala' as const, label: locale === 'en' ? 'Bhavabala' : 'भावबल' },
                  { key: 'sadesati' as const, label: locale === 'en' ? 'Sade Sati' : 'साढ़े साती' },
                  { key: 'jaimini' as const, label: locale === 'en' ? 'Jaimini' : 'जैमिनी' },
                  { key: 'timeline' as const, label: locale === 'en' ? 'Life Timeline' : 'जीवन-रेखा' },
                  { key: 'patrika' as const, label: locale === 'en' ? 'Patrika' : 'पत्रिका' },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setSelectedHouse(null); setSelectedPlanet(null); }}
                    className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
                        : 'text-text-secondary hover:text-text-primary border border-transparent hover:border-gold-primary/20'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ===== CHART TAB ===== */}
          {activeTab === 'chart' && (
            <div>
              {/* Chart type selector — all Parashara vargas */}
              <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mb-4">
              <div className="flex sm:flex-wrap sm:justify-center gap-1.5 min-w-max sm:min-w-0">
                {([
                  { key: 'D1', label: locale === 'en' ? 'D1 Rashi' : locale === 'hi' ? 'D1 राशि' : 'D1 राशिः' },
                  { key: 'bhav_chalit', label: locale === 'en' ? 'Bhav Chalit' : 'भाव चलित' },
                  { key: 'D9', label: locale === 'en' ? 'D9 Navamsha' : locale === 'hi' ? 'D9 नवांश' : 'D9 नवांशः' },
                  ...(kundali.divisionalCharts ? Object.entries(kundali.divisionalCharts).map(([key, dc]) => ({
                    key,
                    label: dc.label[locale as Locale] || dc.label.en || key,
                  })) : []),
                ]).map(c => (
                  <button key={c.key} onClick={() => setActiveChart(c.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeChart === c.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
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

              <InfoBlock
                id="kundali-chart"
                title={locale === 'en' ? 'What is a Birth Chart (Kundali)?' : 'जन्म कुण्डली क्या है?'}
                defaultOpen={true}
              >
                {locale === 'en'
                  ? 'A birth chart is a map of the sky at the exact moment you were born. It shows where all 9 planets were positioned across 12 zodiac signs and 12 houses (life areas). This map reveals your personality, career path, relationships, health patterns, and life timing — think of it as your cosmic DNA. The diamond shape is the traditional North Indian format. Each triangle is one \'house.\' Planet abbreviations: Su=Sun, Mo=Moon, Ma=Mars, Me=Mercury, Ju=Jupiter, Ve=Venus, Sa=Saturn, Ra=Rahu, Ke=Ketu.'
                  : 'जन्म कुण्डली आपके जन्म के सटीक क्षण में आकाश का नक्शा है। यह दर्शाती है कि 9 ग्रह 12 राशियों और 12 भावों (जीवन क्षेत्रों) में कहाँ थे। यह आपके व्यक्तित्व, कैरियर, सम्बन्ध, स्वास्थ्य और जीवन समय को प्रकट करती है। हीरे का आकार पारम्परिक उत्तर भारतीय प्रारूप है। प्रत्येक त्रिभुज एक \'भाव\' है।'}
              </InfoBlock>

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
                    <div className="text-text-tertiary text-xs" suppressHydrationWarning>{locale === 'en' ? `As of ${new Date().toLocaleDateString()}` : `${new Date().toLocaleDateString('hi-IN')}`}</div>
                  </div>
                  {transitData && (
                    <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 mb-4">
                      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                        {transitData.planets?.map((p: { id: number; name: { en: string; hi: string; sa: string }; rashi: number; longitude: number; isRetrograde: boolean }, i: number) => {
                          const rashiName = RASHIS[p.rashi - 1]?.name[locale as Locale] || '';
                          const natalPlanet = kundali.planets.find(np => np.planet.id === p.id);
                          const isSameSign = natalPlanet && natalPlanet.sign === p.rashi;
                          return (
                            <div key={i} className={`text-center p-2 rounded-lg ${isSameSign ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-bg-secondary/50'}`}>
                              <div className="text-gold-light text-xs font-bold">{p.name[locale as Locale]}</div>
                              <div className="text-emerald-400 text-xs font-medium mt-0.5">{rashiName}</div>
                              {p.isRetrograde && <div className="text-red-400 text-xs">℞</div>}
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
                    className={`mt-8 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border ${sC[chartInsight.strength]}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-gold-light font-bold text-sm" style={headingFont}>
                        {chartInsight.chart} — {isHi ? chartInsight.meaning.hi : chartInsight.meaning.en}
                      </h4>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${sC[chartInsight.strength]} ${sClr[chartInsight.strength]}`}>
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
                        <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-1.5">
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
                      <div className="text-indigo-400 text-xs uppercase tracking-widest font-bold mb-1">
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
              <div className="mt-8 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
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
                        <div className="text-text-secondary text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
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
              <InfoBlock
                id="kundali-planets"
                title={locale === 'en' ? 'What do Planet Positions mean?' : 'ग्रह स्थितियों का क्या अर्थ है?'}
                defaultOpen={false}
              >
                {locale === 'en'
                  ? 'Each planet represents a force in your life: Sun=ego/authority/father, Moon=mind/emotions/mother, Mars=energy/courage/property, Mercury=communication/business/intellect, Jupiter=wisdom/children/wealth, Venus=love/marriage/luxury, Saturn=discipline/karma/hard work, Rahu=ambition/foreign/technology, Ketu=spirituality/detachment/liberation. The SIGN a planet is in colors its expression. The HOUSE it occupies determines which life area it affects. Retrograde (R) planets work inwardly — their effects are felt more internally.'
                  : 'प्रत्येक ग्रह आपके जीवन में एक शक्ति का प्रतिनिधित्व करता है: सूर्य=अहंकार/अधिकार/पिता, चंद्र=मन/भावनाएं/माता, मंगल=ऊर्जा/साहस/संपत्ति, बुध=संचार/व्यापार/बुद्धि, गुरु=ज्ञान/संतान/धन, शुक्र=प्रेम/विवाह/विलास, शनि=अनुशासन/कर्म/परिश्रम, राहु=महत्वाकांक्षा/विदेश/तकनीक, केतु=आध्यात्म/वैराग्य/मोक्ष। ग्रह जिस राशि में हो वह उसकी अभिव्यक्ति रंगती है। जिस भाव में हो वह जीवन क्षेत्र प्रभावित होता है। वक्री (R) ग्रह अंतर्मुखी होकर कार्य करते हैं।'}
              </InfoBlock>
              {kundali.planets.map((p) => (
                <motion.div
                  key={p.planet.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: p.planet.id * 0.04 }}
                  onClick={() => handleSelectPlanet(p.planet.id)}
                  className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 cursor-pointer transition-all border ${
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
                        {p.isVargottama && <span className="text-gold-light text-xs font-bold px-1.5 py-0.5 bg-gold-primary/15 rounded border border-gold-primary/30" title={locale === 'en' ? 'Same sign in D1 & D9 — strength equal to double exaltation' : 'वर्गोत्तम — D1 और D9 में एक ही राशि'}>Vgm</span>}
                        {p.isMrityuBhaga && <span className="text-rose-400 text-xs font-bold px-1.5 py-0.5 bg-rose-500/10 rounded" title={locale === 'en' ? 'At or near Mrityu Bhaga — dangerous degree, severely weakened' : 'मृत्यु भाग — खतरनाक अंश, बल में गिरावट'}>MB</span>}
                        {p.isPushkarNavamsha && <span className="text-sky-300 text-xs font-bold px-1.5 py-0.5 bg-sky-500/10 rounded border border-sky-400/20" title={locale === 'en' ? 'Pushkar Navamsha — supremely auspicious navamsha position' : 'पुष्कर नवांश — अत्यंत शुभ नवांश स्थिति'}>PKN</span>}
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
                        {/* Commentary from tippanni */}
                        {tip && (() => {
                          const insight = tip.planetInsights.find(pi => pi.planetId === p.planet.id);
                          if (!insight) return null;
                          return (
                            <div className="mt-4 space-y-3">
                              <p className="text-text-secondary text-sm leading-relaxed">{insight.description}</p>
                              {insight.dignity && (
                                <div className="p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                                  <p className="text-gold-dark text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Dignity' : 'गरिमा'}</p>
                                  <p className="text-text-secondary text-sm">{insight.dignity}</p>
                                </div>
                              )}
                              {insight.retrogradeEffect && (
                                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                  <p className="text-red-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Retrograde Effect' : 'वक्री प्रभाव'}</p>
                                  <p className="text-text-secondary text-sm">{insight.retrogradeEffect}</p>
                                </div>
                              )}
                              {insight.implications && (
                                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                  <p className="text-blue-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Life Impact' : 'जीवन प्रभाव'}</p>
                                  <p className="text-text-secondary text-sm">{insight.implications}</p>
                                </div>
                              )}
                              {insight.prognosis && (
                                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                                  <p className="text-purple-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Prognosis' : 'पूर्वानुमान'}</p>
                                  <p className="text-text-secondary text-sm">{insight.prognosis}</p>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              <PlanetsInterpretation planets={kundali.planets} ascendant={kundali.ascendant} locale={locale} />

              {/* ── Graha Yuddha (Planetary War) ── */}
              {kundali.grahaYuddha && kundali.grahaYuddha.length > 0 && (
                <div className="mt-4 rounded-xl bg-gradient-to-br from-red-900/20 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/30 p-5">
                  <div className="text-red-400 text-xs uppercase tracking-wider font-bold mb-3">
                    {locale === 'en' ? '⚔ Graha Yuddha — Planetary War' : '⚔ ग्रह युद्ध'}
                  </div>
                  <div className="space-y-4">
                    {kundali.grahaYuddha.map((gy, i) => (
                      <div key={i} className="border-t border-red-500/15 pt-3 first:border-0 first:pt-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-gold-light font-bold text-sm">{gy.planet1Name[locale as 'en' | 'hi' | 'sa']}</span>
                          <span className="text-red-400 font-bold">⚔</span>
                          <span className="text-gold-light font-bold text-sm">{gy.planet2Name[locale as 'en' | 'hi' | 'sa']}</span>
                          <span className="text-text-secondary/50 text-xs font-mono">({gy.separation.toFixed(2)}°)</span>
                          <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-xs rounded-full font-bold border border-emerald-500/20">
                            {locale === 'en' ? 'Winner:' : 'विजयी:'} {gy.winnerName[locale as 'en' | 'hi' | 'sa']}
                          </span>
                          <span className="px-2 py-0.5 bg-red-500/15 text-red-400 text-xs rounded-full font-bold border border-red-500/20">
                            {locale === 'en' ? 'Loser:' : 'पराजित:'} {gy.loserName[locale as 'en' | 'hi' | 'sa']}
                          </span>
                        </div>
                        <p className="text-text-secondary/80 text-xs leading-relaxed">
                          {gy.interpretation[locale as 'en' | 'hi' | 'sa']}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== DASHA TAB ===== */}
          {activeTab === 'dasha' && (
            <div className="space-y-3">
              {/* Dasha system selector */}
              <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                {[
                  { key: 'vimshottari', label: locale === 'en' ? 'Vimshottari' : 'विंशोत्तरी', desc: locale === 'en' ? '120yr cycle based on Moon nakshatra — most widely used' : 'चन्द्र नक्षत्र आधारित 120 वर्ष — सर्वाधिक प्रचलित' },
                  ...(kundali.yoginiDashas ? [{ key: 'yogini', label: locale === 'en' ? 'Yogini' : 'योगिनी', desc: locale === 'en' ? '36yr cycle — fast-moving, good for timing events' : '36 वर्ष — तीव्र, घटनाओं के समय हेतु' }] : []),
                  ...(kundali.ashtottariDashas ? [{ key: 'ashtottari', label: locale === 'en' ? 'Ashtottari' : 'अष्टोत्तरी', desc: locale === 'en' ? '108yr cycle — used when Rahu is in a kendra/trikona' : '108 वर्ष — राहु केन्द्र/त्रिकोण में हो तब' }] : []),
                  ...(kundali.narayanaDasha ? [{ key: 'narayana', label: locale === 'en' ? 'Narayana' : 'नारायण', desc: locale === 'en' ? 'Sign-based — shows external life events and environment' : 'राशि आधारित — बाह्य जीवन घटनाएँ' }] : []),
                  ...(kundali.kalachakraDasha ? [{ key: 'kalachakra', label: locale === 'en' ? 'Kalachakra' : 'कालचक्र', desc: locale === 'en' ? 'Wheel of Time — navamsha-based, complex and precise' : 'कालचक्र — नवांश आधारित, सूक्ष्म' }] : []),
                  ...(kundali.sthiraDasha ? [{ key: 'sthira', label: locale === 'en' ? 'Sthira' : 'स्थिर', desc: locale === 'en' ? 'Fixed sign dasha — for longevity analysis' : 'स्थिर राशि — आयु विश्लेषण हेतु' }] : []),
                  ...(kundali.shoolaDasha ? [{ key: 'shoola', label: locale === 'en' ? 'Shoola' : 'शूल', desc: locale === 'en' ? 'Pain/death indicator — used in medical astrology' : 'कष्ट/मृत्यु सूचक — चिकित्सा ज्योतिष' }] : []),
                  { key: 'shodasottari', label: locale === 'en' ? 'Shodasottari' : 'षोडशोत्तरी', desc: locale === 'en' ? '116yr — for night births in Krishna Paksha' : '116 वर्ष — कृष्ण पक्ष रात्रि जन्म हेतु' },
                  { key: 'dwadasottari', label: locale === 'en' ? 'Dwadasottari' : 'द्वादशोत्तरी', desc: locale === 'en' ? '112yr — for Shukla Paksha births with Venus in lagna' : '112 वर्ष — शुक्ल पक्ष, शुक्र लग्न में' },
                  { key: 'panchottari', label: locale === 'en' ? 'Panchottari' : 'पंचोत्तरी', desc: locale === 'en' ? '105yr — for Cancer lagna births' : '105 वर्ष — कर्क लग्न हेतु' },
                  { key: 'satabdika', label: locale === 'en' ? 'Satabdika' : 'शताब्दिका', desc: locale === 'en' ? '100yr — for Vargottama lagna births' : '100 वर्ष — वर्गोत्तम लग्न हेतु' },
                  { key: 'chaturaaseethi', label: locale === 'en' ? 'Chaturaaseethi' : 'चतुराशीति', desc: locale === 'en' ? '84yr — for day births in Shukla Paksha' : '84 वर्ष — शुक्ल पक्ष दिवस जन्म' },
                  { key: 'shashtihayani', label: locale === 'en' ? 'Shashtihayani' : 'षष्ठीहायनी', desc: locale === 'en' ? '60yr — Sun in lagna, alternative timing' : '60 वर्ष — सूर्य लग्न में' },
                  { key: 'mandooka', label: locale === 'en' ? 'Mandooka' : 'मण्डूक', desc: locale === 'en' ? 'Frog leap dasha — signs jump in sequence' : 'मण्डूक — राशियाँ कूदकर चलतीं' },
                  { key: 'drig', label: locale === 'en' ? 'Drig' : 'दृग्', desc: locale === 'en' ? 'Aspect-based — signs with most aspects activate' : 'दृष्टि आधारित — सर्वाधिक दृष्ट राशि' },
                  { key: 'moola', label: locale === 'en' ? 'Moola' : 'मूल', desc: locale === 'en' ? '121yr — based on Moola Trikona positions' : '121 वर्ष — मूल त्रिकोण आधारित' },
                  { key: 'navamsha_dasha', label: locale === 'en' ? 'Navamsha' : 'नवांश', desc: locale === 'en' ? 'D9 chart based — for marriage and dharma timing' : 'D9 आधारित — विवाह और धर्म समय' },
                  { key: 'naisargika', label: locale === 'en' ? 'Naisargika' : 'नैसर्गिक', desc: locale === 'en' ? 'Natural order — fixed planetary periods by nature' : 'प्राकृतिक क्रम — नैसर्गिक ग्रह काल' },
                  { key: 'tara', label: locale === 'en' ? 'Tara' : 'तारा', desc: locale === 'en' ? 'Star-based — nakshatra lord sequences' : 'तारा — नक्षत्र स्वामी क्रम' },
                  { key: 'tithi_ashtottari', label: locale === 'en' ? 'Tithi Ashtottari' : 'तिथि अष्टोत्तरी', desc: locale === 'en' ? '108yr — based on birth tithi lord' : '108 वर्ष — जन्म तिथि स्वामी आधारित' },
                  { key: 'yoga_vimsottari', label: locale === 'en' ? 'Yoga Vimsottari' : 'योग विंशोत्तरी', desc: locale === 'en' ? 'Based on birth yoga — Sun+Moon combination' : 'जन्म योग आधारित — सूर्य+चन्द्र' },
                  { key: 'buddhi_gathi', label: locale === 'en' ? 'Buddhi Gathi' : 'बुद्धि गति', desc: locale === 'en' ? '100yr — intellectual development timing' : '100 वर्ष — बौद्धिक विकास समय' },
                ].map(dt => (
                  <button key={dt.key} onClick={() => setDashaSystem(dt.key)} title={dt.desc}
                    className={`px-4 py-1.5 rounded-lg text-xs transition-all ${dashaSystem === dt.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary border border-transparent'}`}>
                    {dt.label}
                  </button>
                ))}
              </div>
              {/* Selected dasha description */}
              {(() => {
                const allSystems = [
                  { key: 'vimshottari', desc: { en: 'The most widely used dasha system in Vedic astrology. Based on the Moon\'s nakshatra at birth, it divides life into 9 planetary periods totaling 120 years. Each planet\'s dasha activates its significations in your chart.', hi: 'वैदिक ज्योतिष में सर्वाधिक प्रचलित दशा पद्धति। जन्म के चन्द्र नक्षत्र पर आधारित, 120 वर्षों में 9 ग्रह काल। प्रत्येक ग्रह की दशा उसके कुण्डली-संकेतों को सक्रिय करती है।' } },
                  { key: 'yogini', desc: { en: 'A fast 36-year cycle with 8 yogini periods. Excellent for timing specific events. Preferred by some astrologers for its simplicity and accuracy in predicting short-term events.', hi: '8 योगिनी कालों का तीव्र 36 वर्षीय चक्र। विशिष्ट घटनाओं के समय निर्धारण में उत्कृष्ट।' } },
                  { key: 'narayana', desc: { en: 'A sign-based (rashi) dasha from Jaimini astrology. Shows external life events — career changes, relocations, relationship milestones — based on which sign is activated.', hi: 'जैमिनी ज्योतिष से राशि-आधारित दशा। बाह्य जीवन घटनाएँ — कैरियर, स्थानान्तरण, सम्बन्ध — कौन-सी राशि सक्रिय है।' } },
                ];
                const found = allSystems.find(s => s.key === dashaSystem);
                if (!found) return null;
                return <p className="text-text-secondary/60 text-xs text-center mb-4 max-w-2xl mx-auto" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{found.desc[locale === 'en' ? 'en' : 'hi']}</p>;
              })()}
              <h3 className="text-gold-gradient text-xl font-bold mb-6 text-center" style={headingFont}>{t('dashaTimeline')}</h3>
              {(() => {
                // Rasi dashas use signName instead of planetName
                const rasiDashaKeysLocal = ['narayana', 'kalachakra', 'sthira', 'shoola', 'mandooka', 'drig', 'navamsha_dasha'];
                if (rasiDashaKeysLocal.includes(dashaSystem)) {
                  const rasiData = dashaSystem === 'narayana' ? kundali.narayanaDasha
                    : dashaSystem === 'kalachakra' ? kundali.kalachakraDasha
                    : dashaSystem === 'sthira' ? kundali.sthiraDasha
                    : dashaSystem === 'mandooka' ? kundali.mandookaDasha
                    : dashaSystem === 'drig' ? kundali.drigDasha
                    : dashaSystem === 'navamsha_dasha' ? kundali.navamshaDasha
                    : kundali.shoolaDasha;
                  return (rasiData || []).map((d: { sign: number; signName: { en: string; hi: string; sa: string }; years: number; startDate: string; endDate: string }, i: number) => {
                    const now = new Date();
                    const start = new Date(d.startDate);
                    const end = new Date(d.endDate);
                    const isCurrent = now >= start && now <= end;
                    const isPast = now > end;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 flex items-center justify-between ${isCurrent ? 'border border-gold-primary/40 bg-gold-primary/5' : ''} ${isPast ? 'opacity-40' : ''}`}>
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-gold-primary animate-pulse' : isPast ? 'bg-text-secondary/30' : 'bg-gold-dark/50'}`} />
                          <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{d.signName[locale as 'en' | 'hi' | 'sa']}</span>
                          <span className="text-text-tertiary text-xs">{d.years} {locale === 'en' ? 'yrs' : 'वर्ष'}</span>
                        </div>
                        <span className="text-text-secondary text-xs font-mono">{d.startDate} → {d.endDate}</span>
                      </motion.div>
                    );
                  });
                }
                return null;
              })()}
              {!['narayana', 'kalachakra', 'sthira', 'shoola', 'mandooka', 'drig', 'navamsha_dasha'].includes(dashaSystem) && (() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const grahaDashaMap: Record<string, any[]> = {
                  vimshottari: kundali.dashas || [],
                  yogini: kundali.yoginiDashas || [],
                  ashtottari: kundali.ashtottariDashas || [],
                  shodasottari: kundali.shodasottariDasha || [],
                  dwadasottari: kundali.dwadasottariDasha || [],
                  panchottari: kundali.panchottariDasha || [],
                  satabdika: kundali.satabdikaDasha || [],
                  chaturaaseethi: kundali.chaturaaseethiDasha || [],
                  shashtihayani: kundali.shashtihayaniDasha || [],
                  moola: kundali.moolaDasha || [],
                  naisargika: kundali.naisargikaDasha || [],
                  tara: kundali.taraDasha || [],
                  tithi_ashtottari: kundali.tithiAshtottariDasha || [],
                  yoga_vimsottari: kundali.yogaVimsottariDasha || [],
                  buddhi_gathi: kundali.buddhiGathiDasha || [],
                };
                const dashaList = grahaDashaMap[dashaSystem] || kundali.dashas || [];

                // Planet colors and dasha significations
                const PLANET_COLORS: Record<string, string> = {
                  Sun: '#e67e22', Moon: '#ecf0f1', Mars: '#e74c3c', Mercury: '#2ecc71',
                  Jupiter: '#f39c12', Venus: '#e8e6e3', Saturn: '#3498db', Rahu: '#8e44ad', Ketu: '#95a5a6',
                };
                const DASHA_MEANING: Record<string, { en: string; hi: string }> = {
                  Sun: { en: 'Authority, career, father, government, health vitality, soul purpose', hi: 'अधिकार, कैरियर, पिता, सरकार, स्वास्थ्य, आत्म उद्देश्य' },
                  Moon: { en: 'Mind, emotions, mother, home, public life, mental peace', hi: 'मन, भावनाएँ, माता, घर, सार्वजनिक जीवन, मानसिक शान्ति' },
                  Mars: { en: 'Energy, courage, property, siblings, surgery, disputes', hi: 'ऊर्जा, साहस, सम्पत्ति, भाई-बहन, शल्य, विवाद' },
                  Mercury: { en: 'Intellect, communication, business, education, skills', hi: 'बुद्धि, संवाद, व्यापार, शिक्षा, कौशल' },
                  Jupiter: { en: 'Wisdom, children, wealth, spirituality, guru, expansion', hi: 'ज्ञान, सन्तान, धन, आध्यात्मिकता, गुरु, विस्तार' },
                  Venus: { en: 'Love, marriage, luxury, arts, vehicles, comfort', hi: 'प्रेम, विवाह, विलासिता, कला, वाहन, सुख' },
                  Saturn: { en: 'Discipline, karma, delays, service, longevity, hard work', hi: 'अनुशासन, कर्म, विलम्ब, सेवा, दीर्घायु, परिश्रम' },
                  Rahu: { en: 'Ambition, foreign, unconventional, obsession, technology', hi: 'महत्वाकांक्षा, विदेश, अपारम्परिक, जुनून, प्रौद्योगिकी' },
                  Ketu: { en: 'Spirituality, detachment, past karma, liberation, isolation', hi: 'आध्यात्मिकता, वैराग्य, पूर्व कर्म, मोक्ष, एकान्त' },
                };

                // Calculate full timeline span for the progress bar
                const firstStart = dashaList.length > 0 ? new Date(dashaList[0].startDate).getTime() : 0;
                const lastEnd = dashaList.length > 0 ? new Date(dashaList[dashaList.length - 1].endDate).getTime() : 1;
                const totalSpan = lastEnd - firstStart;
                const nowMs = Date.now();

                return (
                  <>
                    {/* Visual timeline bar */}
                    <div className="rounded-lg overflow-hidden h-10 sm:h-8 flex mb-8 border border-gold-primary/10">
                      {dashaList.map((d: { planetName: Record<string, string>; startDate: string; endDate: string; planet?: string }, idx: number) => {
                        const s = new Date(d.startDate).getTime();
                        const e = new Date(d.endDate).getTime();
                        const widthPct = ((e - s) / totalSpan) * 100;
                        const isCur = nowMs >= s && nowMs <= e;
                        const planetEn = d.planetName?.en || d.planet || '';
                        const color = PLANET_COLORS[planetEn] || '#d4a853';
                        return (
                          <div key={idx} className="relative group cursor-pointer" style={{ width: `${widthPct}%`, backgroundColor: `${color}${isCur ? '40' : '18'}`, borderRight: '1px solid rgba(10,14,39,0.5)' }}>
                            {isCur && (
                              <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${color}30, ${color}50)` }}>
                                <div className="absolute left-0 top-0 bottom-0 bg-gold-primary/30" style={{ width: `${Math.min(100, ((nowMs - s) / (e - s)) * 100)}%` }} />
                              </div>
                            )}
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/70 truncate px-1">
                              {widthPct > 4 ? (planetEn.substring(0, 3)) : ''}
                            </span>
                            {/* Tooltip — visible on hover (desktop) and focus-within (touch tap) */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-bg-primary/95 border border-gold-primary/20 rounded text-xs text-gold-light whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 active:opacity-100 transition-opacity pointer-events-none z-10" role="tooltip">
                              {d.planetName[locale]} ({d.startDate.substring(0, 4)}–{d.endDate.substring(0, 4)})
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Dasha cards with meaning */}
                    {dashaList.map((dasha: { planetName: Record<string, string>; planet?: string; startDate: string; endDate: string; subPeriods?: { planetName: Record<string, string>; planet?: string; startDate: string; endDate: string }[] }, i: number) => {
                      const now = new Date();
                      const start = new Date(dasha.startDate);
                      const end = new Date(dasha.endDate);
                      const isCurrent = now >= start && now <= end;
                      const isPast = now > end;
                      // Dasha Sandhi — within 3 months of boundary
                      const THREE_MONTHS_MS = 90 * 24 * 3600 * 1000;
                      const isEndingSoon = isCurrent && (end.getTime() - now.getTime()) <= THREE_MONTHS_MS;
                      const isStartingSoon = !isCurrent && !isPast && (start.getTime() - now.getTime()) <= THREE_MONTHS_MS;
                      const planetEn = dasha.planetName?.en || dasha.planet || '';
                      const color = PLANET_COLORS[planetEn] || '#d4a853';
                      const meaning = DASHA_MEANING[planetEn];
                      const durationYears = ((end.getTime() - start.getTime()) / (365.25 * 24 * 3600000)).toFixed(1);
                      const progressPct = isCurrent ? Math.min(100, ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100) : isPast ? 100 : 0;

                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                          className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden ${isCurrent ? 'border-2 ring-1 ring-gold-primary/20' : ''} ${isPast ? 'opacity-40' : ''}`}
                          style={{ borderColor: isCurrent ? `${color}60` : undefined }}>
                          {/* Progress bar at top */}
                          <div className="h-1" style={{ backgroundColor: `${color}15` }}>
                            <div className="h-full transition-all duration-500" style={{ width: `${progressPct}%`, backgroundColor: color }} />
                          </div>

                          <div className="p-5">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color, opacity: isPast ? 0.3 : 0.8 }} />
                                <span className="text-gold-light font-bold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                                  {dasha.planetName[locale]}
                                </span>
                                <span className="text-text-secondary/50 text-xs">{durationYears} {locale === 'en' ? 'yrs' : 'वर्ष'}</span>
                                {isCurrent && <span className="px-2 py-0.5 bg-gold-primary/20 text-gold-light text-xs rounded-full font-bold animate-pulse">{locale === 'en' ? 'NOW' : 'अभी'}</span>}
                                {(isEndingSoon || isStartingSoon) && (
                                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full font-bold border border-amber-500/30" title={locale === 'en' ? 'Dasha Sandhi — junction zone, 3-6 months of instability. Avoid major commitments.' : 'दशा संधि — अस्थिर काल, नए कार्यों से बचें'}>
                                    {locale === 'en' ? 'Sandhi' : 'संधि'}
                                  </span>
                                )}
                              </div>
                              <span className="text-text-secondary text-xs font-mono">{dasha.startDate.substring(0, 7)} → {dasha.endDate.substring(0, 7)}</span>
                            </div>

                            {/* Sandhi warning */}
                            {(isEndingSoon || isStartingSoon) && (
                              <div className="mt-2 ml-7 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <p className="text-amber-400 text-xs leading-relaxed">
                                  {locale === 'en'
                                    ? isEndingSoon
                                      ? `Dasha Sandhi — this Mahadasha ends in ${Math.ceil((end.getTime() - Date.now()) / (30 * 24 * 3600 * 1000))} months. The junction zone brings instability; avoid irreversible decisions until the new dasha establishes.`
                                      : `Dasha Sandhi — this Mahadasha begins in ${Math.ceil((start.getTime() - Date.now()) / (30 * 24 * 3600 * 1000))} months. Prepare for a significant shift in life themes.`
                                    : isEndingSoon
                                      ? `दशा संधि — यह महादशा ${Math.ceil((end.getTime() - Date.now()) / (30 * 24 * 3600 * 1000))} माह में समाप्त। संधि काल में महत्वपूर्ण निर्णय टालें।`
                                      : `दशा संधि — यह महादशा ${Math.ceil((start.getTime() - Date.now()) / (30 * 24 * 3600 * 1000))} माह में प्रारम्भ। नए जीवन-विषयों की तैयारी करें।`}
                                </p>
                              </div>
                            )}

                            {/* Dasha meaning */}
                            {meaning && !isPast && (
                              <p className="text-text-secondary/70 text-xs mt-1 ml-7 leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                {locale === 'en' ? meaning.en : meaning.hi}
                              </p>
                            )}

                            {/* Current dasha progress detail */}
                            {isCurrent && (
                              <div className="mt-3 ml-7 text-xs text-gold-primary/70">
                                {Math.round(progressPct)}% {locale === 'en' ? 'complete' : 'पूर्ण'} — {locale === 'en' ? 'ends' : 'समाप्ति'} {end.toLocaleDateString(locale === 'en' ? 'en-IN' : 'hi-IN', { year: 'numeric', month: 'short' })}
                              </div>
                            )}

                            {/* Sub-periods (Antar Dasha) — show for current maha dasha */}
                            {isCurrent && dasha.subPeriods && (
                              <div className="mt-4 ml-2 pl-2 sm:ml-4 sm:pl-4 border-l-2 space-y-1.5" style={{ borderColor: `${color}30` }}>
                                <div className="text-xs uppercase tracking-wider text-text-secondary/40 mb-2">{locale === 'en' ? 'Antar Dasha (Sub-periods)' : 'अन्तर दशा'}</div>
                                {dasha.subPeriods.map((sub, j) => {
                                  const subStart = new Date(sub.startDate);
                                  const subEnd = new Date(sub.endDate);
                                  const isSubCurrent = now >= subStart && now <= subEnd;
                                  const isSubPast = now > subEnd;
                                  const subPlanetEn = sub.planetName?.en || sub.planet || '';
                                  const subColor = PLANET_COLORS[subPlanetEn] || '#d4a853';
                                  const subMeaning = DASHA_MEANING[subPlanetEn];
                                  return (
                                    <div key={j} className={`rounded-lg p-2.5 ${isSubCurrent ? 'bg-gold-primary/5 border border-gold-primary/15' : isSubPast ? 'opacity-30' : ''}`}>
                                      <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isSubCurrent ? subColor : `${subColor}40` }} />
                                          <span className={`text-sm ${isSubCurrent ? 'text-gold-light font-semibold' : 'text-text-secondary'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                            {sub.planetName[locale]}
                                          </span>
                                          {isSubCurrent && <span className="text-xs px-1.5 py-0.5 bg-gold-primary/15 text-gold-primary rounded-full">{locale === 'en' ? 'active' : 'सक्रिय'}</span>}
                                        </span>
                                        <span className="font-mono text-xs text-text-secondary/50">{sub.startDate.substring(0, 7)} → {sub.endDate.substring(0, 7)}</span>
                                      </div>
                                      {isSubCurrent && subMeaning && (
                                        <p className="text-text-secondary/60 text-xs mt-1 ml-5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                          {planetEn}–{subPlanetEn}: {locale === 'en' ? subMeaning.en : subMeaning.hi}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </>
                );
              })()}
              <DashaInterpretation dashas={kundali.dashas} planets={kundali.planets} locale={locale} />
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
            <>
              <InfoBlock
                id="kundali-varga"
                title={locale === 'en' ? 'What are Divisional Charts (Varga)?' : 'विभागीय चार्ट (वर्ग) क्या हैं?'}
                defaultOpen={false}
              >
                {locale === 'en'
                  ? 'Your birth chart (D1) shows the big picture. Divisional charts zoom into specific life areas by mathematically dividing each sign: D9 (Navamsha)=marriage/dharma/soul\'s true nature (most important after D1), D10 (Dashamsha)=career/profession, D2 (Hora)=wealth, D3 (Drekkana)=siblings, D7 (Saptamsha)=children, D12 (Dwadashamsha)=parents. If a planet is strong in BOTH D1 and D9, its results are confirmed and powerful.'
                  : 'आपकी जन्म कुण्डली (D1) व्यापक चित्र दिखाती है। विभागीय चार्ट प्रत्येक राशि को गणितीय रूप से विभाजित करके विशिष्ट जीवन क्षेत्रों में ज़ूम करते हैं: D9 (नवांश)=विवाह/धर्म/आत्मा का सच्चा स्वरूप (D1 के बाद सर्वाधिक महत्वपूर्ण), D10 (दशमांश)=कैरियर/व्यवसाय, D2 (होरा)=धन, D3 (द्रेष्काण)=भाई-बहन, D7 (सप्तांश)=संतान, D12 (द्वादशांश)=माता-पिता। यदि कोई ग्रह D1 और D9 दोनों में बलवान है तो उसके फल निश्चित और शक्तिशाली होते हैं।'}
              </InfoBlock>
              <PaywallGate feature="varga_full" blurContent={<VargaAnalysisTab kundali={kundali} locale={locale as Locale} headingFont={headingFont} />}>
                <VargaAnalysisTab kundali={kundali} locale={locale as Locale} headingFont={headingFont} />
              </PaywallGate>
            </>
          )}

          {/* ===== GRAHA TAB ===== */}
          {activeTab === 'graha' && kundali.grahaDetails && (
            <>
              <InfoBlock
                id="kundali-graha"
                title={locale === 'hi' ? 'ग्रह विश्लेषण क्या है?' : 'What is Graha Analysis?'}
                defaultOpen={false}
              >
                {locale === 'hi'
                  ? 'विस्तृत ग्रह डेटा जिसमें सटीक निर्देशांक, गति, क्रांति और प्रत्येक ग्रह जिस नक्षत्र पाद (चतुर्थांश) में है वह शामिल हैं। उपग्रह (गुलिका और मंदी जैसे छाया उप-ग्रह) और सूक्ष्मता जोड़ते हैं। गति बताती है कि ग्रह कितना सक्रिय है — धीमे ग्रह (वक्री के निकट) विलंबित लेकिन गहरे परिणाम देते हैं। अक्षांश दर्शाता है कि ग्रह क्रांतिवृत्त से कितना दूर है — अत्यधिक अक्षांश ग्रह के प्रभाव को कमज़ोर करता है।'
                  : 'Extended planetary data including exact coordinates, speed, declination, and the nakshatra pada (quarter) each planet occupies. Upagrahas (shadow sub-planets like Gulika and Mandi) add nuance. Speed tells you how active a planet is — slow planets (near retrograde) give delayed but deep results. Latitude shows how far a planet is from the ecliptic — extreme latitudes weaken a planet\'s influence.'}
              </InfoBlock>
              <GrahaTab grahaDetails={kundali.grahaDetails} upagrahas={kundali.upagrahas || []} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} planetInsights={tip?.planetInsights} />
            </>
          )}

          {/* ===== YOGAS TAB ===== */}
          {activeTab === 'yogas' && kundali.yogasComplete && (
            <div className="space-y-6">
              <YogasTab yogas={kundali.yogasComplete} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
              <YogasInterpretation yogas={kundali.yogasComplete} locale={locale} />
            </div>
          )}


          {/* ===== SHADBALA TAB ===== */}
          {activeTab === 'shadbala' && kundali.fullShadbala && (
            <PaywallGate feature="shadbala_full" blurContent={<ShadbalaTab shadbala={kundali.fullShadbala} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />}>
              <div className="space-y-6">
                <InfoBlock
                  id="kundali-shadbala"
                  title={locale === 'hi' ? 'षड्बल क्या है?' : 'What is Shadbala (Six-fold Strength)?'}
                  defaultOpen={false}
                >
                  {locale === 'hi'
                    ? 'आपकी कुण्डली के सभी ग्रह समान रूप से शक्तिशाली नहीं होते। षड्बल 6 स्रोतों से प्रत्येक ग्रह की शक्ति मापता है: स्थानीय (कौन सी राशि), दिशात्मक (कौन सा भाव), कालिक (जन्म का समय), गतिज (गति), नैसर्गिक (जन्मजात शक्ति), और दृग् (अन्य ग्रहों का प्रभाव)। 1.0 रूप से ऊपर अंक पाने वाला ग्रह पर्याप्त बलवान है। उससे नीचे वह अपने वादे पूरे करने में संघर्ष करता है। सबसे बलवान ग्रह अक्सर आपके प्रमुख व्यक्तित्व लक्षण को परिभाषित करता है।'
                    : 'Not all planets in your chart are equally powerful. Shadbala measures each planet\'s strength from 6 sources: positional (which sign), directional (which house), temporal (time of birth), motional (speed), natural (inherent strength), and aspectual (other planets\' influence). A planet scoring above 1.0 Rupa is adequately strong. Below that, it struggles to deliver its promises. The strongest planet often defines your dominant personality trait.'}
                </InfoBlock>
                <ShadbalaInterpretation shadbala={kundali.fullShadbala} planets={kundali.planets} dashas={kundali.dashas || []} locale={locale} />
                <ShadbalaTab shadbala={kundali.fullShadbala} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
              </div>
            </PaywallGate>
          )}

          {/* ===== BHAVABALA TAB ===== */}
          {activeTab === 'bhavabala' && kundali.bhavabala && (
            <PaywallGate feature="shadbala_full" blurContent={<BhavabalaTab bhavabala={kundali.bhavabala} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />}>
              <div className="space-y-6">
                <InfoBlock
                  id="kundali-bhavabala"
                  title={locale === 'hi' ? 'भावबल क्या है?' : 'What is Bhavabala (House Strength)?'}
                  defaultOpen={false}
                >
                  {locale === 'hi'
                    ? 'आपकी कुण्डली के 12 भावों में से प्रत्येक का एक शक्ति स्कोर होता है। बलवान भाव सहजता से अपने वादे पूरे करते हैं — एक बलवान 10वाँ भाव का अर्थ है कि करियर की सफलता स्वाभाविक रूप से आती है। कमज़ोर भाव उन क्षेत्रों को इंगित करते हैं जिनमें अधिक प्रयास की आवश्यकता है। यह स्कोर भावेश की शक्ति, उसमें स्थित ग्रहों और प्राप्त दृष्टियों का संयोजन है। आपका सबसे बलवान भाव अक्सर आपकी सबसे बड़ी जीवन संपदा बन जाता है।'
                    : 'Each of the 12 houses in your chart has a strength score. Strong houses deliver their promises easily — a strong 10th house means career success comes naturally. Weak houses indicate areas requiring more effort. The score combines the lord\'s strength, occupant planets, and aspects received. Your strongest house often becomes your greatest life asset.'}
                </InfoBlock>
                <BhavabalaTab bhavabala={kundali.bhavabala} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
                <BhavabalaInterpretation bhavabala={kundali.bhavabala} locale={locale} />
              </div>
            </PaywallGate>
          )}

          {/* ===== AVASTHAS TAB ===== */}
          {activeTab === 'avasthas' && kundali.avasthas && (
            <div className="space-y-6">
              <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
                {locale === 'en' ? 'Planetary Avasthas (States)' : 'ग्रह अवस्थाएं'}
              </h3>
              <p className="text-text-secondary text-xs text-center mb-4">
                {locale === 'en' ? 'HOW each planet expresses its energy — 5 classification systems from BPHS Ch.44-45' : 'प्रत्येक ग्रह अपनी ऊर्जा कैसे व्यक्त करता है — BPHS अ.44-45 से 5 वर्गीकरण'}
              </p>
              <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gold-primary/15">
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' ? 'Planet' : 'ग्रह'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' ? 'Baladi (Age)' : 'बालादि'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' ? 'Jagradadi (Wakefulness)' : 'जागृतादि'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' ? 'Deeptadi (Luminosity)' : 'दीप्तादि'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' ? 'Lajjitadi (Emotional)' : 'लज्जितादि'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' ? 'Shayanadi (Activity)' : 'शयनादि'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-primary/5">
                    {kundali.avasthas.map((av) => {
                      const pName = kundali.planets.find(p => p.planet.id === av.planetId)?.planet.name[locale as Locale] || `P${av.planetId}`;
                      return (
                        <tr key={av.planetId} className="hover:bg-gold-primary/3">
                          <td className="py-2.5 px-3 text-gold-light font-bold" style={headingFont}>{pName}</td>
                          <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs ${av.baladi.strength >= 70 ? 'bg-emerald-500/10 text-emerald-300' : av.baladi.strength >= 40 ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-400'}`}>{av.baladi.name[locale as Locale] || av.baladi.name.en}</span></td>
                          <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs ${av.jagradadi.quality === 'full' ? 'bg-emerald-500/10 text-emerald-300' : av.jagradadi.quality === 'half' ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-400'}`}>{av.jagradadi.name[locale as Locale] || av.jagradadi.name.en}</span></td>
                          <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs ${av.deeptadi.luminosity >= 60 ? 'bg-emerald-500/10 text-emerald-300' : av.deeptadi.luminosity >= 30 ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-400'}`}>{av.deeptadi.name[locale as Locale] || av.deeptadi.name.en}</span></td>
                          <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs ${av.lajjitadi.effect === 'benefic' ? 'bg-emerald-500/10 text-emerald-300' : av.lajjitadi.effect === 'malefic' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-300'}`}>{av.lajjitadi.name[locale as Locale] || av.lajjitadi.name.en}</span></td>
                          <td className="py-2.5 px-3 text-text-secondary">{av.shayanadi.name[locale as Locale] || av.shayanadi.name.en}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <AvasthasInterpretation avasthas={kundali.avasthas} planets={kundali.planets} locale={locale} />
            </div>
          )}

          {/* ===== ARGALA TAB ===== */}
          {activeTab === 'argala' && kundali.argala && (() => {
            const HOUSE_SIGNIFICATIONS: { en: string; hi: string }[] = [
              { en: 'Self, body, personality, health', hi: 'आत्म, शरीर, व्यक्तित्व, स्वास्थ्य' },
              { en: 'Wealth, family, speech, food', hi: 'धन, परिवार, वाणी, भोजन' },
              { en: 'Courage, siblings, communication', hi: 'साहस, भाई-बहन, संवाद' },
              { en: 'Home, mother, comfort, property', hi: 'घर, माता, सुख, सम्पत्ति' },
              { en: 'Children, intelligence, education', hi: 'सन्तान, बुद्धि, शिक्षा' },
              { en: 'Enemies, disease, debts, service', hi: 'शत्रु, रोग, ऋण, सेवा' },
              { en: 'Marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार' },
              { en: 'Longevity, transformation, occult', hi: 'दीर्घायु, परिवर्तन, गुप्त' },
              { en: 'Dharma, father, fortune, guru', hi: 'धर्म, पिता, भाग्य, गुरु' },
              { en: 'Career, status, authority, fame', hi: 'कैरियर, प्रतिष्ठा, अधिकार, यश' },
              { en: 'Gains, income, friends, wishes', hi: 'लाभ, आय, मित्र, इच्छाएँ' },
              { en: 'Expenses, liberation, foreign, loss', hi: 'व्यय, मोक्ष, विदेश, हानि' },
            ];
            const OBSTRUCTION_REMEDIES: { en: string; hi: string }[] = [
              { en: 'Strengthen lagna lord — wear its gemstone, chant its mantra', hi: 'लग्नेश को बलवान करें — रत्न धारण, मन्त्र जाप' },
              { en: 'Donate food and support family harmony', hi: 'भोजन दान करें, पारिवारिक सामंजस्य बनाएँ' },
              { en: 'Practice courage, support siblings, write/communicate more', hi: 'साहस का अभ्यास, भाई-बहनों का समर्थन, लेखन/संवाद' },
              { en: 'Serve mother, maintain home sanctity, perform Vastu puja', hi: 'माता की सेवा, घर की पवित्रता, वास्तु पूजा' },
              { en: 'Worship Saraswati/Jupiter, educate children, creative pursuits', hi: 'सरस्वती/गुरु पूजा, सन्तान शिक्षा, सृजनात्मक कार्य' },
              { en: 'Serve the sick/poor, chant Hanuman Chalisa, stay debt-free', hi: 'रोगी/गरीबों की सेवा, हनुमान चालीसा, ऋणमुक्त रहें' },
              { en: 'Strengthen Venus, respect spouse, practice compromise', hi: 'शुक्र को बलवान करें, जीवनसाथी का सम्मान, समझौता' },
              { en: 'Chant Maha Mrityunjaya, embrace change, study occult wisely', hi: 'महामृत्युंजय जाप, परिवर्तन स्वीकार, गुप्त विद्या' },
              { en: 'Respect guru/father, visit temples, practice dharma', hi: 'गुरु/पिता का सम्मान, मन्दिर दर्शन, धर्म आचरण' },
              { en: 'Work diligently, respect authority, perform Surya Namaskar', hi: 'परिश्रम, अधिकार का सम्मान, सूर्य नमस्कार' },
              { en: 'Donate to charities, network wisely, support friends', hi: 'दान, बुद्धिमत्ता से सम्बन्ध, मित्रों का समर्थन' },
              { en: 'Practice detachment, meditate, visit pilgrimages', hi: 'वैराग्य, ध्यान, तीर्थ यात्रा' },
            ];
            const supported = kundali.argala.filter(a => a.netEffect === 'supported');
            const obstructed = kundali.argala.filter(a => a.netEffect === 'obstructed');

            return (
            <div className="space-y-6">
              <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
                {locale === 'en' ? 'Argala — Planetary Intervention' : 'अर्गला — ग्रह हस्तक्षेप'}
              </h3>

              <InfoBlock id="kundali-argala" title={locale === 'en' ? 'What is Argala and how to read it?' : 'अर्गला क्या है और इसे कैसे पढ़ें?'}>
                {locale === 'en' ? (
                  <div className="space-y-3">
                    <p><strong>Argala</strong> (from Jaimini Sutras, BPHS Ch.31) reveals which planets actively <strong>push</strong> or <strong>block</strong> each area of your life. Unlike Bhavabala (which measures a house&apos;s built-in strength), Argala shows <strong>external forces</strong> acting on each house.</p>
                    <p><strong>How it works:</strong> Planets positioned in the 2nd, 4th, 5th, 8th, and 11th houses from any house create <strong>Argala</strong> (intervention/support). Planets in the 12th, 10th, 9th, 6th, and 3rd houses respectively create <strong>Virodha</strong> (counter-intervention). If the supporting planets outnumber the countering ones, the house is &quot;Supported.&quot;</p>
                    <p><strong>Why Bhavabala and Argala can differ:</strong> A house can be inherently strong (high Bhavabala) yet face external obstruction (Argala). For example, a strong 7th house with Argala obstruction means: your marriage capacity is excellent, but outside circumstances create friction. Conversely, a weak house with strong Argala support means: external help compensates for inherent weakness.</p>
                    <p><strong>How to use it:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong className="text-emerald-400">Supported houses</strong> — Life areas where planets actively help you. Lean into these — efforts here get cosmic tailwind.</li>
                      <li><strong className="text-red-400">Obstructed houses</strong> — Life areas facing planetary resistance. Not blocked permanently — the upayas (remedies) shown can reduce friction.</li>
                      <li><strong className="text-amber-400">Neutral houses</strong> — Balanced forces. Results depend more on your own effort than planetary push/pull.</li>
                    </ul>
                    <p className="text-gold-primary/50 text-xs">Special rules: 3+ malefics in the 3rd create unobstructable Argala. For Ketu&apos;s house, the argala directions are reversed.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p><strong>अर्गला</strong> (जैमिनी सूत्र, BPHS अ.31) दर्शाती है कि कौन से ग्रह आपके जीवन के प्रत्येक क्षेत्र को सक्रिय रूप से <strong>बढ़ावा</strong> या <strong>अवरुद्ध</strong> करते हैं। भावबल (जो भाव की अन्तर्निहित शक्ति मापता है) से भिन्न, अर्गला <strong>बाह्य शक्तियों</strong> को दर्शाती है।</p>
                    <p><strong>कैसे काम करती है:</strong> किसी भाव से 2, 4, 5, 8, 11वें भाव के ग्रह <strong>अर्गला</strong> (समर्थन) बनाते हैं। 12, 10, 9, 6, 3वें भाव के ग्रह <strong>विरोध अर्गला</strong> बनाते हैं।</p>
                    <p><strong>भावबल और अर्गला में अन्तर क्यों:</strong> एक भाव अन्तर्निहित रूप से बलवान (उच्च भावबल) हो सकता है फिर भी बाह्य अवरोध (अर्गला) झेल सकता है। उदाहरण: बलवान 7वाँ भाव + अर्गला अवरोध = विवाह की क्षमता उत्कृष्ट, पर बाहरी परिस्थितियाँ बाधा डालती हैं।</p>
                    <p><strong>उपयोग:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong className="text-emerald-400">समर्थित भाव</strong> — जहाँ ग्रह सक्रिय रूप से सहायता करते हैं। इन क्षेत्रों में प्रयास करें।</li>
                      <li><strong className="text-red-400">अवरुद्ध भाव</strong> — ग्रह प्रतिरोध। स्थायी नहीं — उपायों से घर्षण कम होता है।</li>
                      <li><strong className="text-amber-400">तटस्थ भाव</strong> — सन्तुलित। परिणाम आपके प्रयास पर निर्भर।</li>
                    </ul>
                  </div>
                )}
              </InfoBlock>

              {/* Summary */}
              <div className="flex justify-center gap-4 text-xs">
                <span className="text-emerald-400">{supported.length} {locale === 'en' ? 'supported' : 'समर्थित'}</span>
                <span className="text-red-400">{obstructed.length} {locale === 'en' ? 'obstructed' : 'अवरुद्ध'}</span>
                <span className="text-amber-400">{12 - supported.length - obstructed.length} {locale === 'en' ? 'neutral' : 'तटस्थ'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {kundali.argala.map((ar) => {
                  const sig = HOUSE_SIGNIFICATIONS[ar.house - 1];
                  const remedy = OBSTRUCTION_REMEDIES[ar.house - 1];
                  return (
                  <div key={ar.house} className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden border ${ar.netEffect === 'supported' ? 'border-emerald-500/20' : ar.netEffect === 'obstructed' ? 'border-red-500/20' : 'border-gold-primary/10'}`}>
                    {/* Header */}
                    <div className={`px-4 py-2.5 flex items-center justify-between ${ar.netEffect === 'supported' ? 'bg-emerald-500/5' : ar.netEffect === 'obstructed' ? 'bg-red-500/5' : 'bg-bg-secondary/30'}`}>
                      <div>
                        <span className="text-gold-light font-bold text-sm">{locale === 'en' ? `House ${ar.house}` : `भाव ${ar.house}`}</span>
                        <span className="text-text-secondary/50 text-xs ml-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {sig[locale === 'en' ? 'en' : 'hi']}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ar.netEffect === 'supported' ? 'bg-emerald-500/15 text-emerald-300' : ar.netEffect === 'obstructed' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-300'}`}>
                        {ar.netEffect === 'supported' ? (locale === 'en' ? 'Supported' : 'समर्थित') : ar.netEffect === 'obstructed' ? (locale === 'en' ? 'Obstructed' : 'अवरुद्ध') : (locale === 'en' ? 'Neutral' : 'तटस्थ')}
                      </span>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      {ar.argalas.length > 0 && (
                        <div className="text-xs">
                          <span className="text-emerald-400/60">{locale === 'en' ? 'Support:' : 'समर्थन:'}</span>{' '}
                          <span className="text-emerald-300">{ar.argalas.map(a => a.planetName[locale as Locale] || a.planetName.en).join(', ')}</span>
                        </div>
                      )}
                      {ar.virodha.length > 0 && (
                        <div className="text-xs">
                          <span className="text-red-400/60">{locale === 'en' ? 'Counter:' : 'प्रतिकार:'}</span>{' '}
                          <span className="text-red-400">{ar.virodha.map(v => v.planetName[locale as Locale] || v.planetName.en).join(', ')}</span>
                        </div>
                      )}
                      {ar.argalas.length === 0 && ar.virodha.length === 0 && (
                        <div className="text-xs text-text-tertiary">{locale === 'en' ? 'No planetary intervention on this house.' : 'इस भाव पर कोई ग्रह हस्तक्षेप नहीं।'}</div>
                      )}
                      {/* Implication */}
                      {ar.netEffect === 'supported' && (
                        <p className="text-emerald-400/50 text-xs leading-relaxed mt-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {locale === 'en'
                            ? `Positive: ${sig.en.split(',')[0]} matters receive planetary support — expect growth and ease in these areas.`
                            : `शुभ: ${sig.hi.split(',')[0]} विषयों को ग्रह समर्थन — इन क्षेत्रों में वृद्धि और सहजता।`}
                        </p>
                      )}
                      {ar.netEffect === 'obstructed' && (
                        <div className="mt-1">
                          <p className="text-red-400/50 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                            {locale === 'en'
                              ? `Challenge: ${sig.en.split(',')[0]} matters face obstruction — delays or difficulties likely.`
                              : `चुनौती: ${sig.hi.split(',')[0]} विषयों में अवरोध — विलम्ब या कठिनाइयाँ सम्भावित।`}
                          </p>
                          <p className="text-amber-400/40 text-xs mt-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                            {locale === 'en' ? 'Upaya: ' : 'उपाय: '}{remedy[locale === 'en' ? 'en' : 'hi']}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
            );
          })()}

          {/* ===== SPHUTAS TAB ===== */}
          {activeTab === 'sphutas' && kundali.sphutas && (() => {
            const isHi = locale !== 'en';
            const yogiPlanetName = GRAHAS[kundali.sphutas.yogiPoint.yogiPlanet]?.name[locale as Locale] || '';
            const avayogiPlanetName = GRAHAS[kundali.sphutas.avayogiPoint.avayogiPlanet]?.name[locale as Locale] || '';
            const RASHI_FULL = ['','Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
            const RASHI_HI = ['','मेष','वृषभ','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'];
            const signName = (s: number) => isHi ? RASHI_HI[s] || '' : RASHI_FULL[s] || '';

            return (
            <div className="space-y-6">
              <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
                {isHi ? 'स्फुट — संवेदनशील बिंदु' : 'Sphutas — Sensitive Points in Your Chart'}
              </h3>

              <InfoBlock
                id="kundali-sphutas"
                title={isHi ? 'स्फुट क्या हैं?' : 'What are Sphutas (Sensitive Points)?'}
                defaultOpen={false}
              >
                {isHi
                  ? 'स्फुट गणितीय रूप से निर्धारित अंश बिंदु हैं जो छुपे आयाम प्रकट करते हैं: योगी बिंदु — आपका सबसे शुभ अंश, इसके निकट ग्रह भाग्य लाते हैं। अवयोगी बिंदु — आपका सबसे चुनौतीपूर्ण अंश। प्राण स्फुट — जीवनशक्ति और प्राण ऊर्जा। देह स्फुट — भौतिक शरीर और स्वास्थ्य संरचना। मृत्यु स्फुट — दीर्घायु सूचक (विश्लेषणात्मक, भविष्यसूचक नहीं!)। त्रि स्फुट — तीनों का समग्र।'
                  : 'Sphutas are mathematically computed degree points that reveal hidden dimensions: Yogi Point — your luckiest degree, planets near this bring fortune. Avayogi Point — your most challenging degree. Prana Sphuta — vitality and life force. Deha Sphuta — physical body and health constitution. Mrityu Sphuta — longevity indicators (analytical, not predictive!). Tri Sphuta — composite of all three.'}
              </InfoBlock>

              {/* ── SYNTHESIS — leads with so-what ────────────────────────────────── */}
              {sphuataTransitData && (() => {
                const PLANET_COLORS_SPHUTA: Record<number,string> = { 0:'text-amber-400',1:'text-slate-300',2:'text-red-400',3:'text-emerald-400',4:'text-yellow-300',5:'text-pink-300',6:'text-blue-400',7:'text-purple-400',8:'text-gray-400' };
                const PLANET_NAMES_SPHUTA_EN = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
                const PLANET_NAMES_SPHUTA_HI = ['सूर्य','चन्द्र','मंगल','बुध','बृहस्पति','शुक्र','शनि','राहु','केतु'];
                const pName = (pid: number) => isHi ? (PLANET_NAMES_SPHUTA_HI[pid]||'') : (PLANET_NAMES_SPHUTA_EN[pid]||'');
                const SIGN_ELEMENTS: Record<number,string> = { 1:'Fire',2:'Earth',3:'Air',4:'Water',5:'Fire',6:'Earth',7:'Air',8:'Water',9:'Fire',10:'Earth',11:'Air',12:'Water' };
                const SIGN_ELEMENTS_HI: Record<number,string> = { 1:'अग्नि',2:'पृथ्वी',3:'वायु',4:'जल',5:'अग्नि',6:'पृथ्वी',7:'वायु',8:'जल',9:'अग्नि',10:'पृथ्वी',11:'वायु',12:'जल' };
                const elemName = (s: number) => isHi ? SIGN_ELEMENTS_HI[s] : SIGN_ELEMENTS[s];
                const sp = kundali.sphutas!;
                // Check if any transit is active right now
                const activeNow = sphuataTransitData.yogiJupiter.isActive || sphuataTransitData.avayogiSaturn.isActive;
                return (
                <div className="rounded-xl bg-gradient-to-br from-[#1a1040]/70 via-[#0f0d2e]/80 to-[#0a0e27] border border-gold-primary/25 p-5">
                  <h4 className="text-gold-gradient text-sm font-bold mb-1 uppercase tracking-wider" style={headingFont}>
                    {isHi ? '✦ स्फुट संश्लेषण — आपका पूर्ण चित्र' : '✦ Sphuta Synthesis — Your Complete Picture'}
                  </h4>
                  <p className="text-text-secondary/60 text-xs mb-4">
                    {isHi ? 'सभी स्फुट बिंदुओं का एकीकृत विश्लेषण — महत्वपूर्ण गोचर खिड़कियाँ, स्वास्थ्य संरचना, और व्यावहारिक सुझाव।' : 'Integrated reading of all sphuta points — key transit windows, constitutional health picture, and actionable guidance.'}
                  </p>

                  {/* Blueprint paragraph */}
                  <div className="bg-[#0a0e27]/60 border border-gold-primary/10 rounded-lg p-4 mb-4">
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {isHi
                        ? `आपकी प्राण शक्ति ${signName(sp.pranaSphuta.sign)} (${elemName(sp.pranaSphuta.sign)} तत्व) में है, जो ${sp.pranaSphuta.sign % 2 === 0 ? 'सम — ग्रहणशील, भावनात्मक' : 'विषम — सक्रिय, अभिव्यंजक'} प्रकृति दर्शाती है। देह स्फुट ${signName(sp.dehaSphuta.sign)} में ${elemName(sp.dehaSphuta.sign) === 'अग्नि' || elemName(sp.dehaSphuta.sign) === 'पृथ्वी' ? 'शारीरिक सहनशक्ति और स्थिरता' : 'लचीलापन और अनुकूलनशीलता'} देता है। मृत्यु स्फुट ${signName(sp.mrityuSphuta.sign)} में संवेदनशीलता ${sp.mrityuSphuta.sign >= 1 && sp.mrityuSphuta.sign <= 6 ? 'शरीर के ऊपरी भाग में' : 'शरीर के निचले भाग में'} इंगित करता है। आपका योगी ग्रह ${pName(sp.yogiPoint.yogiPlanet)} है और अवयोगी ग्रह ${pName(sp.avayogiPoint.avayogiPlanet)} — इन दोनों की दशाओं में क्रमशः सर्वोत्तम और सबसे चुनौतीपूर्ण अनुभव होते हैं।`
                        : `Your Prana (vitality) is rooted in ${signName(sp.pranaSphuta.sign)} (${elemName(sp.pranaSphuta.sign)} element) — ${sp.pranaSphuta.sign % 2 === 0 ? 'receptive and emotionally driven' : 'active and expressive'}. Deha (body) in ${signName(sp.dehaSphuta.sign)} gives you ${(elemName(sp.dehaSphuta.sign) === 'Fire' || elemName(sp.dehaSphuta.sign) === 'Earth') ? 'physical endurance and structural strength' : 'flexibility and adaptability'}. Mrityu in ${signName(sp.mrityuSphuta.sign)} points to constitutional sensitivity in the ${sp.mrityuSphuta.sign >= 1 && sp.mrityuSphuta.sign <= 6 ? 'upper body region' : 'lower body region'}. Your Yogi Planet is ${pName(sp.yogiPoint.yogiPlanet)} and Avayogi is ${pName(sp.avayogiPoint.avayogiPlanet)} — these two planets mark your best and most challenging dasha periods respectively.`}
                    </p>
                  </div>

                  {/* Active window alert */}
                  {activeNow && (
                    <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-lg p-3 mb-4 flex items-start gap-2">
                      <span className="text-emerald-400 text-sm mt-0.5">&#9733;</span>
                      <p className="text-emerald-300 text-xs leading-relaxed font-medium">
                        {isHi ? 'एक महत्वपूर्ण गोचर अभी सक्रिय है! अपने जीवन के अवसरों/चुनौतियों पर ध्यान दें।' : 'An important transit is ACTIVE RIGHT NOW. Pay close attention to opportunities or challenges unfolding in your life.'}
                      </p>
                    </div>
                  )}

                  {/* Timeline */}
                  <h5 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
                    {isHi ? 'आगामी महत्वपूर्ण खिड़कियाँ' : 'Upcoming Key Windows'}
                  </h5>
                  <div className="space-y-1.5 mb-4">
                    {sphuataTransitData.timeline.map((ev, idx) => (
                      <div key={idx} className={`flex items-start gap-3 rounded-lg px-3 py-2 text-xs border ${ev.isBenefic ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-red-500/15 bg-red-500/5'}`}>
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${ev.isBenefic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {ev.isBenefic ? '✦' : '⚠'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className={`font-bold ${PLANET_COLORS_SPHUTA[ev.planet] || 'text-gold-light'}`}>
                              {isHi ? PLANET_NAMES_SPHUTA_HI[ev.planet] : PLANET_NAMES_SPHUTA_EN[ev.planet]} → {ev.sphutalabel}
                            </span>
                            <span className={`font-bold text-xs ${ev.isBenefic ? 'text-emerald-300' : 'text-red-300'}`}>
                              {ev.daysAway < 30 ? (isHi ? `~${ev.daysAway} दिन` : `~${ev.daysAway} days`) : ev.date.toLocaleDateString(isHi ? 'hi-IN' : 'en-US', { month:'short', year:'numeric' })}
                            </span>
                          </div>
                          <p className={`mt-0.5 leading-relaxed ${ev.isBenefic ? 'text-emerald-200/70' : 'text-red-200/70'}`}>
                            {isHi ? ev.actionHi : ev.action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Constitution summary */}
                  <h5 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
                    {isHi ? 'स्वास्थ्य संरचना सारांश' : 'Constitutional Health Summary'}
                  </h5>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: isHi?'प्राण':'Prana', sign: sp.pranaSphuta.sign, deg: sp.pranaSphuta.degree, color:'text-gold-primary' },
                      { label: isHi?'देह':'Deha', sign: sp.dehaSphuta.sign, deg: sp.dehaSphuta.degree, color:'text-blue-400' },
                      { label: isHi?'मृत्यु':'Mrityu', sign: sp.mrityuSphuta.sign, deg: sp.mrityuSphuta.degree, color:'text-violet-400' },
                    ].map(({ label, sign, deg, color }) => (
                      <div key={label} className="bg-[#0a0e27]/60 border border-gold-primary/8 rounded-lg p-2 text-center">
                        <div className={`text-xs font-bold ${color}`}>{label}</div>
                        <div className="text-gold-light text-sm font-mono font-bold">{deg.toFixed(1)}°</div>
                        <div className="text-text-secondary/60 text-xs">{signName(sign)}</div>
                        <div className="text-text-secondary/40 text-xs">{elemName(sign)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Key actions */}
                  <h5 className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
                    {isHi ? 'मुख्य सुझाव' : 'Key Actions'}
                  </h5>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-xs text-text-secondary">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">✦</span>
                      <span>{isHi ? `${pName(sp.yogiPoint.yogiPlanet)} को सबसे अधिक बल दें — यह आपका कल्याणकारी ग्रह है। इसके रत्न, मंत्र, और दान से आपकी योगी बिंदु ऊर्जा सक्रिय होती है।` : `Strengthen ${pName(sp.yogiPoint.yogiPlanet)} above all others — it is your most benefic karmic ally. Its gemstone, mantra, and charitable donations activate your Yogi Point energy.`}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-text-secondary">
                      <span className="text-amber-400 mt-0.5 flex-shrink-0">◈</span>
                      <span>{isHi ? `जब बृहस्पति आपके योगी बिंदु (${sp.yogiPoint.degree.toFixed(0)}° ${signName(sp.yogiPoint.sign)}) के ±5° में हो — ${sphuataTransitData.yogiJupiter.isActive ? 'अभी!' : (isHi ? sphuataTransitData.yogiJupiter.labelHi : sphuataTransitData.yogiJupiter.label)} — बड़े कार्य, निवेश, विवाह, और यात्राएं शुरू करें।` : `When Jupiter is within ±5° of your Yogi Point (${sp.yogiPoint.degree.toFixed(0)}° ${signName(sp.yogiPoint.sign)}) — ${sphuataTransitData.yogiJupiter.isActive ? 'that is NOW' : sphuataTransitData.yogiJupiter.label} — initiate major ventures, investments, marriages, journeys.`}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-text-secondary">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
                      <span>{isHi ? `${pName(sp.avayogiPoint.avayogiPlanet)} की दशा/अन्तर्दशा और शनि के अवयोगी बिंदु गोचर (${sphuataTransitData.avayogiSaturn.isActive ? 'अभी सक्रिय' : sphuataTransitData.avayogiSaturn.labelHi}) में: बड़े कानूनी, वित्तीय और व्यावसायिक निर्णय टालें।` : `During ${pName(sp.avayogiPoint.avayogiPlanet)} dasha/antardasha and Saturn's Avayogi transit (${sphuataTransitData.avayogiSaturn.isActive ? 'active now!' : sphuataTransitData.avayogiSaturn.label}): postpone major legal, financial, and career decisions where possible.`}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-text-secondary">
                      <span className="text-violet-400 mt-0.5 flex-shrink-0">◉</span>
                      <span>{isHi ? `जब शनि या मंगल मृत्यु स्फुट (${sp.mrityuSphuta.degree.toFixed(0)}° ${signName(sp.mrityuSphuta.sign)}) पर गोचर करे — शनि: ${sphuataTransitData.mrityuSaturn.isActive ? 'अभी!' : sphuataTransitData.mrityuSaturn.labelHi}, मंगल: ${sphuataTransitData.mrityuMars.isActive ? 'अभी!' : sphuataTransitData.mrityuMars.labelHi} — पूर्ण स्वास्थ्य जांच कराएं।` : `When Saturn (${sphuataTransitData.mrityuSaturn.isActive ? 'now!' : sphuataTransitData.mrityuSaturn.label}) or Mars (${sphuataTransitData.mrityuMars.isActive ? 'now!' : sphuataTransitData.mrityuMars.label}) transit your Mrityu Sphuta (${sp.mrityuSphuta.degree.toFixed(0)}° ${signName(sp.mrityuSphuta.sign)}): schedule a comprehensive health checkup, avoid risky activities.`}</span>
                    </div>
                  </div>

                  <p className="text-text-secondary/30 text-xs mt-3 italic">
                    {isHi ? '* गोचर तिथियाँ औसत गति पर आधारित अनुमान हैं — वक्री गति से ±4-8 सप्ताह का अन्तर हो सकता है।' : '* Transit dates are estimates based on average daily motion — retrograde periods may shift by ±4–8 weeks.'}
                  </p>
                </div>
                );
              })()}

              {/* YOGI & AVAYOGI — the key pair */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Yogi Point */}
                <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">&#9733;</span>
                    <div>
                      <div className="text-emerald-300 text-xs uppercase tracking-widest font-bold">{isHi ? 'योगी बिंदु — आपका शुभ बिंदु' : 'Yogi Point — Your Lucky Degree'}</div>
                    </div>
                  </div>
                  <div className="text-gold-light font-bold text-3xl font-mono mb-1">{kundali.sphutas.yogiPoint.degree.toFixed(2)}°</div>
                  <div className="text-emerald-300 text-sm font-bold mb-2">{signName(kundali.sphutas.yogiPoint.sign)}</div>
                  <div className="text-emerald-400 text-xs font-medium mb-3">
                    {isHi ? `योगी ग्रह: ${yogiPlanetName}` : `Yogi Planet: ${yogiPlanetName}`}
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed">
                    {isHi
                      ? `यह आपकी कुण्डली का सबसे शुभ बिंदु है। ${yogiPlanetName} आपका योगी ग्रह है — इसकी दशा/अन्तर्दशा में सर्वोत्तम परिणाम मिलते हैं। ${yogiPlanetName} को बलवान रखें — इसका रत्न, मंत्र, या दान करें। जब गोचरी बृहस्पति इस अंश पर आता है, तो जीवन में बड़ी सकारात्मक घटना होती है — यह लगभग हर 12 वर्ष में होता है और आपकी सबसे शक्तिशाली गोचर खिड़की है।`
                      : `This is the single most auspicious degree in your entire chart. ${yogiPlanetName} is your Yogi Planet — its dasha/antardasha brings the BEST results in your life. Keep ${yogiPlanetName} strong — wear its gemstone, chant its mantra, make donations on its day. When transiting Jupiter crosses this degree, expect a major positive event — this happens roughly once every 12 years and is your most powerful transit window.`}
                  </div>
                  {sphuataTransitData && (
                    <div className="mt-3 space-y-1.5">
                      <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${sphuataTransitData.yogiJupiter.isActive ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-[#0a0e27]/60 border border-emerald-500/15'}`}>
                        <span className="text-emerald-400 font-medium">&#9733; Next Jupiter transit</span>
                        <span className={`font-bold ${sphuataTransitData.yogiJupiter.isActive ? 'text-emerald-300 animate-pulse' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.yogiJupiter.labelHi : sphuataTransitData.yogiJupiter.label}</span>
                      </div>
                      {sphuataTransitData.yogiPlanetTx && (
                        <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${sphuataTransitData.yogiPlanetTx.isActive ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-[#0a0e27]/60 border border-gold-primary/10'}`}>
                          <span className="text-gold-primary font-medium">&#9670; Next {yogiPlanetName} transit</span>
                          <span className={`font-bold ${sphuataTransitData.yogiPlanetTx.isActive ? 'text-emerald-300 animate-pulse' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.yogiPlanetTx.labelHi : sphuataTransitData.yogiPlanetTx.label}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Avayogi Point */}
                <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-lg">&#9888;</span>
                    <div>
                      <div className="text-red-300 text-xs uppercase tracking-widest font-bold">{isHi ? 'अवयोगी बिंदु — आपका चुनौतीपूर्ण बिंदु' : 'Avayogi Point — Your Challenging Degree'}</div>
                    </div>
                  </div>
                  <div className="text-gold-light font-bold text-3xl font-mono mb-1">{kundali.sphutas.avayogiPoint.degree.toFixed(2)}°</div>
                  <div className="text-red-300 text-sm font-bold mb-2">{signName(kundali.sphutas.avayogiPoint.sign)}</div>
                  <div className="text-red-400 text-xs font-medium mb-3">
                    {isHi ? `अवयोगी ग्रह: ${avayogiPlanetName}` : `Avayogi Planet: ${avayogiPlanetName}`}
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed">
                    {isHi
                      ? `यह आपका सबसे चुनौतीपूर्ण बिंदु है। ${avayogiPlanetName} आपका अवयोगी ग्रह है — इसकी दशा में बाधाएँ और विलम्ब आ सकते हैं। जब शनि इस अंश पर गोचर करता है, सावधान रहें। उपाय: ${avayogiPlanetName} के शमन मंत्र, शनिवार को तिल/तेल दान, और इस ग्रह की दशा में अतिरिक्त सावधानी।`
                      : `This is your most challenging degree. ${avayogiPlanetName} is your Avayogi Planet — its dasha may bring obstacles, delays, and setbacks. When Saturn transits this degree, exercise extra caution with major decisions. Remedies: chant the pacification mantra for ${avayogiPlanetName}, donate sesame/oil on Saturdays.`}
                  </div>
                  {sphuataTransitData && (
                    <div className="mt-3 space-y-1.5">
                      <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${sphuataTransitData.avayogiSaturn.isActive ? 'bg-red-500/20 border border-red-400/30' : 'bg-[#0a0e27]/60 border border-red-500/15'}`}>
                        <span className="text-red-400 font-medium">&#9888; Next Saturn transit</span>
                        <span className={`font-bold ${sphuataTransitData.avayogiSaturn.isActive ? 'text-red-300 animate-pulse' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.avayogiSaturn.labelHi : sphuataTransitData.avayogiSaturn.label}</span>
                      </div>
                      {sphuataTransitData.avayogiPlanTx && (
                        <div className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${sphuataTransitData.avayogiPlanTx.isActive ? 'bg-red-500/20 border border-red-400/30' : 'bg-[#0a0e27]/60 border border-red-500/10'}`}>
                          <span className="text-red-300/80 font-medium">&#9888; Next {avayogiPlanetName} transit</span>
                          <span className={`font-bold ${sphuataTransitData.avayogiPlanTx.isActive ? 'text-red-300 animate-pulse' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.avayogiPlanTx.labelHi : sphuataTransitData.avayogiPlanTx.label}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* CONSTITUTIONAL SPHUTAS */}
              <div>
                <h4 className="text-gold-light text-sm font-bold mb-3 text-center" style={headingFont}>
                  {isHi ? 'शारीरिक संरचना स्फुट — आपकी प्रकृति' : 'Constitutional Sphutas — Your Nature'}
                </h4>
                <p className="text-text-secondary text-xs text-center mb-4 max-w-2xl mx-auto">
                  {isHi
                    ? 'ये बिंदु आपकी शारीरिक और प्राणिक संरचना को दर्शाते हैं। ये चिकित्सा ज्योतिष और आयुर्वेदिक विश्लेषण में प्रयुक्त होते हैं।'
                    : 'These points describe your physical and vital constitution. They are used in medical astrology (Ayurvedic analysis) and longevity assessment. The sign and nakshatra where each falls indicates the quality of that life dimension.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    { data: kundali.sphutas.pranaSphuta, label: isHi ? 'प्राण स्फुट' : 'Prana Sphuta', sublabel: isHi ? 'जीवन शक्ति' : 'Vitality & Life Force', color: 'border-gold-primary/20', icon: '&#9829;', txKey: 'prana' as const,
                      explain: isHi ? 'आपकी समग्र जीवन शक्ति और ऊर्जा स्तर। सूर्य + चन्द्र + लग्न से गणित। शुभ राशि/नक्षत्र = प्रबल जीवनशक्ति, अच्छा स्वास्थ्य।' : 'Your overall vitality and energy level. Computed from Sun + Moon + Lagna. A benefic sign/nakshatra = strong life force, good health, resilience. A malefic placement = watch your energy levels, prioritize rest.' },
                    { data: kundali.sphutas.dehaSphuta, label: isHi ? 'देह स्फुट' : 'Deha Sphuta', sublabel: isHi ? 'शारीरिक संरचना' : 'Physical Body', color: 'border-blue-500/20', icon: '&#9775;', txKey: 'deha' as const,
                      explain: isHi ? 'आपकी शारीरिक संरचना और काया। यह बताता है कि आपका शरीर किस प्रकार का है। अग्नि/पृथ्वी राशि = मजबूत, मांसल। वायु/जल = हल्का, लचीला।' : 'Your physical constitution and body type. This indicates your natural build. Fire/Earth signs = strong, muscular frame. Air/Water = lighter, more flexible. The nakshatra adds specifics about health tendencies.' },
                    { data: kundali.sphutas.mrityuSphuta, label: isHi ? 'मृत्यु स्फुट' : 'Mrityu Sphuta', sublabel: isHi ? 'दीर्घायु सूचक' : 'Longevity Indicator', color: 'border-violet-500/20', icon: '&#8734;', txKey: 'mrityu' as const,
                      explain: isHi ? 'दीर्घायु और स्वास्थ्य जोखिम का सूचक। यह "मृत्यु" का भविष्यवाणी नहीं करता — यह दर्शाता है कि शरीर के कौन से क्षेत्र ध्यान माँगते हैं। जब गोचर ग्रह इस अंश पर आते हैं, स्वास्थ्य पर ध्यान दें।' : 'Indicator of longevity and health vulnerability. This does NOT predict death — it shows which body areas need attention. When transit planets (especially Saturn or Mars) cross this degree, pay extra attention to health. The sign indicates the body part: Aries=head, Taurus=throat, etc.' },
                    { data: kundali.sphutas.triSphuta, label: isHi ? 'त्रि स्फुट' : 'Tri Sphuta', sublabel: isHi ? 'समग्र संकेतक' : 'Composite Indicator', color: 'border-amber-500/20', icon: '&#9651;', txKey: 'tri' as const,
                      explain: isHi ? 'तीनों स्फुटों (प्राण + देह + मृत्यु) का संयुक्त बिंदु। यह आपकी समग्र शारीरिक-प्राणिक स्थिति का एकल सूचक है।' : 'Composite of all three sphutas (Prana + Deha + Mrityu). This gives a single-point summary of your overall physical-vital condition. Its sign/nakshatra placement summarizes your constitutional strength.' },
                  ] as const).map(({ data, label, sublabel, color, icon, explain, txKey }) => {
                    const txInfo = sphuataTransitData ? (
                      txKey === 'prana' ? { primary: sphuataTransitData.pranaSun, primaryLabel: 'Next Sun transit', secondary: sphuataTransitData.pranaJupiter, secondaryLabel: 'Next Jupiter transit' } :
                      txKey === 'deha'  ? { primary: sphuataTransitData.dehaMoon, primaryLabel: 'Next Moon transit', secondary: sphuataTransitData.dehaSaturn, secondaryLabel: 'Next Saturn transit' } :
                      txKey === 'mrityu'? { primary: sphuataTransitData.mrityuSaturn, primaryLabel: 'Next Saturn transit', secondary: sphuataTransitData.mrityuMars, secondaryLabel: 'Next Mars transit' } :
                      /* tri */          { primary: sphuataTransitData.triSun, primaryLabel: 'Next Sun transit', secondary: null, secondaryLabel: '' }
                    ) : null;
                    const txPrimaryLabels: Record<string,'Next Sun transit'|'Next Moon transit'|'Next Saturn transit'> = { prana:'Next Sun transit',deha:'Next Moon transit',mrityu:'Next Saturn transit',tri:'Next Sun transit' };
                    return (
                    <div key={label} className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 border ${color}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gold-primary text-lg" dangerouslySetInnerHTML={{ __html: icon }} />
                        <div>
                          <div className="text-gold-light text-sm font-bold">{label}</div>
                          <div className="text-text-secondary/60 text-xs">{sublabel}</div>
                        </div>
                      </div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-gold-light font-bold text-xl font-mono">{data.degree.toFixed(2)}°</span>
                        <span className="text-text-secondary text-xs">{signName(data.sign)}</span>
                      </div>
                      <p className="text-text-secondary text-xs leading-relaxed mb-3">{explain}</p>
                      {txInfo && (
                        <div className="space-y-1">
                          <div className={`flex items-center justify-between rounded-md px-2.5 py-1 text-xs ${txInfo.primary.isActive ? 'bg-emerald-500/15 border border-emerald-400/20' : 'bg-[#0a0e27]/60 border border-gold-primary/8'}`}>
                            <span className="text-text-secondary/70">{isHi ? txPrimaryLabels[txKey].replace('Sun','सूर्य').replace('Moon','चन्द्र').replace('Saturn','शनि') : txInfo.primaryLabel}</span>
                            <span className={`font-bold ml-2 ${txInfo.primary.isActive ? 'text-emerald-300' : 'text-gold-light'}`}>{isHi ? txInfo.primary.labelHi : txInfo.primary.label}</span>
                          </div>
                          {txInfo.secondary && (
                            <div className={`flex items-center justify-between rounded-md px-2.5 py-1 text-xs ${txInfo.secondary.isActive ? (txKey==='mrityu'?'bg-red-500/15 border border-red-400/20':'bg-emerald-500/15 border border-emerald-400/20') : 'bg-[#0a0e27]/60 border border-gold-primary/8'}`}>
                              <span className="text-text-secondary/70">{isHi ? txInfo.secondaryLabel.replace('Next Jupiter transit','अगला बृहस्पति गोचर').replace('Next Saturn transit','अगला शनि गोचर').replace('Next Mars transit','अगला मंगल गोचर') : txInfo.secondaryLabel}</span>
                              <span className={`font-bold ml-2 ${txInfo.secondary.isActive ? (txKey==='mrityu'?'text-red-300':'text-emerald-300') : 'text-gold-light'}`}>{isHi ? txInfo.secondary.labelHi : txInfo.secondary.label}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Bija/Kshetra */}
              {(kundali.sphutas.bijaSphuta || kundali.sphutas.kshetraSphuta) && (
                <div>
                  <h4 className="text-gold-light text-sm font-bold mb-3 text-center" style={headingFont}>
                    {isHi ? 'प्रजनन स्फुट' : 'Fertility Sphutas'}
                  </h4>
                  <p className="text-text-secondary text-xs text-center mb-4 max-w-xl mx-auto">
                    {isHi
                      ? 'ये बिंदु प्रजनन क्षमता और सन्तान योग का आकलन करते हैं। विषम राशि/नक्षत्र = अनुकूल।'
                      : 'These points assess fertility and progeny potential. Odd signs and benefic nakshatras = favorable. Used alongside 5th house and Jupiter analysis for childbirth timing.'}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {kundali.sphutas.bijaSphuta && (
                      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 border border-blue-500/15">
                        <div className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-1">{isHi ? 'बीज स्फुट (पुरुष प्रजनन)' : 'Bija Sphuta (Male Fertility)'}</div>
                        <div className="text-gold-light font-bold text-xl font-mono">{kundali.sphutas.bijaSphuta.degree.toFixed(2)}°</div>
                        <div className="text-text-secondary text-xs mt-1">{signName(kundali.sphutas.bijaSphuta.sign)}</div>
                        <p className="text-text-secondary/70 text-xs mt-2 leading-relaxed">
                          {isHi ? 'सूर्य + शुक्र + बृहस्पति से गणित। विषम राशि और शुभ नक्षत्र = बलवान।' : 'Computed from Sun + Venus + Jupiter. Odd sign + benefic nakshatra = strong male fertility factor.'}
                        </p>
                        {sphuataTransitData?.bijaJupiter && (
                          <div className={`mt-2 flex items-center justify-between rounded-md px-2 py-1 text-xs ${sphuataTransitData.bijaJupiter.isActive ? 'bg-emerald-500/15 border border-emerald-400/20' : 'bg-[#0a0e27]/60 border border-blue-500/10'}`}>
                            <span className="text-text-secondary/70">{isHi ? 'अगला बृहस्पति' : 'Next Jupiter'}</span>
                            <span className={`font-bold ${sphuataTransitData.bijaJupiter.isActive ? 'text-emerald-300' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.bijaJupiter.labelHi : sphuataTransitData.bijaJupiter.label}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {kundali.sphutas.kshetraSphuta && (
                      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 border border-pink-500/15">
                        <div className="text-pink-300 text-xs uppercase tracking-widest font-bold mb-1">{isHi ? 'क्षेत्र स्फुट (स्त्री प्रजनन)' : 'Kshetra Sphuta (Female Fertility)'}</div>
                        <div className="text-gold-light font-bold text-xl font-mono">{kundali.sphutas.kshetraSphuta.degree.toFixed(2)}°</div>
                        <div className="text-text-secondary text-xs mt-1">{signName(kundali.sphutas.kshetraSphuta.sign)}</div>
                        <p className="text-text-secondary/70 text-xs mt-2 leading-relaxed">
                          {isHi ? 'चन्द्र + मंगल + बृहस्पति से गणित। सम राशि और शुभ नक्षत्र = बलवान।' : 'Computed from Moon + Mars + Jupiter. Even sign + benefic nakshatra = strong female fertility factor.'}
                        </p>
                        {sphuataTransitData?.kshetraJupiter && (
                          <div className={`mt-2 flex items-center justify-between rounded-md px-2 py-1 text-xs ${sphuataTransitData.kshetraJupiter.isActive ? 'bg-emerald-500/15 border border-emerald-400/20' : 'bg-[#0a0e27]/60 border border-pink-500/10'}`}>
                            <span className="text-text-secondary/70">{isHi ? 'अगला बृहस्पति' : 'Next Jupiter'}</span>
                            <span className={`font-bold ${sphuataTransitData.kshetraJupiter.isActive ? 'text-emerald-300' : 'text-gold-light'}`}>{isHi ? sphuataTransitData.kshetraJupiter.labelHi : sphuataTransitData.kshetraJupiter.label}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bhrigu Bindu — midpoint of Rahu and Moon */}
              {kundali.bhriguBindu && (
                <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/20 p-5">
                  <div className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-2">
                    {isHi ? 'भृगु बिंदु (Uttara Kalamrita)' : 'Bhrigu Bindu (Uttara Kalamrita)'}
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <span className="text-gold-light font-bold text-2xl font-mono">{kundali.bhriguBindu.degree}</span>
                      <span className="text-purple-300 text-sm ml-2">{signName(kundali.bhriguBindu.sign)}</span>
                    </div>
                    <div className="text-text-secondary text-xs">{kundali.bhriguBindu.longitude.toFixed(2)}°</div>
                  </div>
                  <p className="text-text-secondary/80 text-xs leading-relaxed">
                    {isHi
                      ? 'भृगु बिंदु = राहु और चन्द्र का मध्यबिंदु। यह आपके जीवन का सर्वाधिक संवेदनशील बिंदु है। जब बृहस्पति इस बिंदु से गुजरे, बड़ी शुभ घटनाएँ होती हैं। शनि का गोचर चुनौती लाता है।'
                      : 'Midpoint of natal Rahu and Moon — the most sensitive accumulation point in your chart. Jupiter transiting within 5° of Bhrigu Bindu triggers major positive events. Saturn transiting this point brings a challenge period requiring discipline and patience.'}
                  </p>
                </div>
              )}

              {/* How to use this */}
              <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border border-emerald-500/15">
                <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">
                  {isHi ? 'इसका उपयोग कैसे करें' : 'How to Use This Information'}
                </h4>
                <ul className="text-text-secondary text-xs leading-relaxed space-y-2">
                  <li>
                    {isHi
                      ? `✦ अपने योगी ग्रह (${yogiPlanetName}) को बलवान रखें — इसका रत्न धारण करें, इसके दिन उपवास/दान करें।`
                      : `✦ Keep your Yogi Planet (${yogiPlanetName}) strong — wear its gemstone, fast/donate on its day.`}
                  </li>
                  <li>
                    {isHi
                      ? `✦ अवयोगी ग्रह (${avayogiPlanetName}) की दशा/गोचर में सावधान रहें — बड़े निर्णयों से पहले सोचें।`
                      : `✦ Be cautious during Avayogi Planet (${avayogiPlanetName}) dasha/transit — think twice before major decisions.`}
                  </li>
                  <li>
                    {isHi
                      ? '✦ जब बृहस्पति आपके योगी बिंदु के ±5° के भीतर गोचर करे, तो नए कार्य आरम्भ करें — यह आपका सबसे शुभ काल है।'
                      : '✦ When Jupiter transits within ±5° of your Yogi Point, start new ventures — this is your MOST auspicious transit window.'}
                  </li>
                  <li>
                    {isHi
                      ? '✦ मृत्यु स्फुट = मृत्यु नहीं। यह केवल शारीरिक संवेदनशीलता का बिंदु है। स्वास्थ्य जांच और सावधानी बरतें।'
                      : '✦ Mrityu Sphuta ≠ death prediction. It only indicates a health-sensitive degree. Get regular checkups and practice preventive care when planets transit this point.'}
                  </li>
                </ul>
              </div>
            </div>
          );
          })()}

          {/* ===== CHAT TAB ===== */}
          {activeTab === 'chat' && (
            <ChartChatTab kundali={kundali} locale={locale as Locale} headingFont={headingFont} />
          )}

          {/* ===== SADE SATI TAB ===== */}
          {activeTab === 'sadesati' && kundali.sadeSati && (
            <div className="space-y-6">
              <InfoBlock id="kundali-sadesati" title={locale === 'en' ? 'What is Sade Sati and why 7.5 years?' : 'साढ़े साती क्या है और 7.5 वर्ष क्यों?'}>
                {locale === 'en' ? (
                  <div className="space-y-2">
                    <p><strong>Sade Sati</strong> (&quot;seven and a half&quot;) is the ~7.5-year period when Saturn transits three consecutive signs around your Moon — the 12th (before), 1st (over), and 2nd (after) from your natal Moon sign. Saturn takes ~2.5 years per sign, totaling ~7.5 years.</p>
                    <p><strong>Why the Moon?</strong> Your Moon sign represents your mind and emotions. Saturn&apos;s transit over it pressures your emotional foundation — not as punishment, but as deep maturation.</p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong>Rising (12th)</strong> — Financial pressures, hidden anxieties, sleep issues</li>
                      <li><strong>Peak (over Moon)</strong> — Most intense: mental pressure, relationship tests, but deepest growth</li>
                      <li><strong>Setting (2nd)</strong> — Easing strain, family/speech matters, Saturn leaves wisdom behind</li>
                    </ul>
                    <p className="text-xs text-gold-primary/50">Not always negative — effects depend on Saturn&apos;s natal position, Moon&apos;s strength, and current dasha. Many achieve breakthroughs during Sade Sati. Occurs 2-3 times in a lifetime (~every 30 years).</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p><strong>साढ़े साती</strong> वह ~7.5 वर्ष की अवधि है जब शनि चन्द्र राशि के आसपास तीन राशियों से गुजरता है — 12वीं, 1ली और 2री। शनि ~2.5 वर्ष प्रति राशि लेता है।</p>
                    <p><strong>चन्द्रमा क्यों?</strong> चन्द्र राशि मन और भावनाओं का प्रतिनिधित्व करती है। शनि का गोचर भावनात्मक नींव पर दबाव डालता है — दण्ड नहीं, गहन परिपक्वता।</p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong>आरम्भ (12वाँ)</strong> — आर्थिक दबाव, छिपी चिन्ताएँ</li>
                      <li><strong>चरम (चन्द्र पर)</strong> — सबसे तीव्र: मानसिक दबाव, किन्तु सबसे गहन विकास</li>
                      <li><strong>अवसान (2रा)</strong> — दबाव कम, शनि ज्ञान छोड़कर जाता है</li>
                    </ul>
                    <p className="text-xs text-gold-primary/50">सदैव नकारात्मक नहीं — प्रभाव शनि की जन्म स्थिति और दशा पर निर्भर। जीवन में 2-3 बार आती है।</p>
                  </div>
                )}
              </InfoBlock>
              <SadeSatiTab sadeSati={kundali.sadeSati} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
            </div>
          )}

          {/* ===== JAIMINI TAB ===== */}
          {activeTab === 'jaimini' && kundali.jaimini && (() => {
            // Karaka explanations
            const KARAKA_INFO: Record<string, { full: { en: string; hi: string }; meaning: { en: string; hi: string }; governs: { en: string; hi: string } }> = {
              AK: { full: { en: 'Atmakaraka', hi: 'आत्मकारक' }, meaning: { en: 'Soul Significator', hi: 'आत्मा का कारक' }, governs: { en: 'Your soul\'s deepest desire and life purpose. The king of your chart — all other karakas serve this planet\'s agenda.', hi: 'आत्मा की गहनतम इच्छा और जीवन उद्देश्य। कुण्डली का राजा — सभी अन्य कारक इस ग्रह की सेवा करते हैं।' } },
              AmK: { full: { en: 'Amatyakaraka', hi: 'अमात्यकारक' }, meaning: { en: 'Minister/Career', hi: 'मन्त्री/कैरियर' }, governs: { en: 'Career direction, profession, how you serve society. The minister who executes the soul\'s purpose through worldly work.', hi: 'कैरियर दिशा, पेशा, समाज सेवा। मन्त्री जो सांसारिक कार्य से आत्मा के उद्देश्य को पूर्ण करता है।' } },
              BK: { full: { en: 'Bhratrikaraka', hi: 'भ्रातृकारक' }, meaning: { en: 'Sibling Significator', hi: 'भाई-बहन कारक' }, governs: { en: 'Siblings, close friends, courage, and support network. Shows the nature of your peer relationships.', hi: 'भाई-बहन, निकट मित्र, साहस और सहायता। सहकर्मी सम्बन्धों की प्रकृति।' } },
              MK: { full: { en: 'Matrikaraka', hi: 'मातृकारक' }, meaning: { en: 'Mother Significator', hi: 'माता कारक' }, governs: { en: 'Mother, home, emotional security, property, and inner comfort. The nurturing force in your life.', hi: 'माता, घर, भावनात्मक सुरक्षा, सम्पत्ति। जीवन में पोषण शक्ति।' } },
              PK: { full: { en: 'Putrakaraka', hi: 'पुत्रकारक' }, meaning: { en: 'Children Significator', hi: 'सन्तान कारक' }, governs: { en: 'Children, creativity, intelligence, disciples, and merit from past lives (Poorva Punya).', hi: 'सन्तान, सृजनशीलता, बुद्धि, शिष्य और पूर्व पुण्य।' } },
              GK: { full: { en: 'Gnatikaraka', hi: 'ज्ञातिकारक' }, meaning: { en: 'Rival/Disease', hi: 'शत्रु/रोग कारक' }, governs: { en: 'Enemies, diseases, obstacles, and litigation. Shows the nature of challenges you face and must overcome.', hi: 'शत्रु, रोग, बाधाएँ और मुकदमे। चुनौतियों की प्रकृति जिन्हें जीतना है।' } },
              DK: { full: { en: 'Darakaraka', hi: 'दारकारक' }, meaning: { en: 'Spouse Significator', hi: 'जीवनसाथी कारक' }, governs: { en: 'Spouse, business partners, and significant relationships. The planet with the lowest degree reveals your partner\'s nature.', hi: 'जीवनसाथी, व्यापार साझेदार। सबसे कम अंश वाला ग्रह साथी का स्वभाव बताता है।' } },
              Atmakaraka: { full: { en: 'Atmakaraka', hi: 'आत्मकारक' }, meaning: { en: 'Soul Significator', hi: 'आत्मा का कारक' }, governs: { en: 'Your soul\'s deepest desire and life purpose.', hi: 'आत्मा की गहनतम इच्छा और जीवन उद्देश्य।' } },
              Amatyakaraka: { full: { en: 'Amatyakaraka', hi: 'अमात्यकारक' }, meaning: { en: 'Minister/Career', hi: 'मन्त्री/कैरियर' }, governs: { en: 'Career direction and profession.', hi: 'कैरियर दिशा और पेशा।' } },
              Bhratrikaraka: { full: { en: 'Bhratrikaraka', hi: 'भ्रातृकारक' }, meaning: { en: 'Sibling Significator', hi: 'भाई-बहन कारक' }, governs: { en: 'Siblings and support network.', hi: 'भाई-बहन और सहायता।' } },
              Matrikaraka: { full: { en: 'Matrikaraka', hi: 'मातृकारक' }, meaning: { en: 'Mother Significator', hi: 'माता कारक' }, governs: { en: 'Mother, home, emotional security.', hi: 'माता, घर, भावनात्मक सुरक्षा।' } },
              Putrakaraka: { full: { en: 'Putrakaraka', hi: 'पुत्रकारक' }, meaning: { en: 'Children Significator', hi: 'सन्तान कारक' }, governs: { en: 'Children, creativity, intelligence.', hi: 'सन्तान, सृजनशीलता, बुद्धि।' } },
              Gnatikaraka: { full: { en: 'Gnatikaraka', hi: 'ज्ञातिकारक' }, meaning: { en: 'Rival/Disease', hi: 'शत्रु/रोग कारक' }, governs: { en: 'Enemies, diseases, obstacles.', hi: 'शत्रु, रोग, बाधाएँ।' } },
              Darakaraka: { full: { en: 'Darakaraka', hi: 'दारकारक' }, meaning: { en: 'Spouse Significator', hi: 'जीवनसाथी कारक' }, governs: { en: 'Spouse and partnerships.', hi: 'जीवनसाथी और साझेदारी।' } },
            };

            // Karakamsha sign implications
            const KARAKAMSHA_MEANING: Record<number, { en: string; hi: string }> = {
              1: { en: 'Aries — Independent, pioneering soul. Drawn to leadership, military, sports, or entrepreneurship. Must learn patience.', hi: 'मेष — स्वतन्त्र, अग्रणी आत्मा। नेतृत्व, सेना, खेल या उद्यमिता की ओर। धैर्य सीखना आवश्यक।' },
              2: { en: 'Taurus — Soul seeks stability, beauty, and material comfort. Drawn to arts, finance, agriculture, and luxury.', hi: 'वृषभ — स्थिरता, सौन्दर्य और भौतिक सुख की खोज। कला, वित्त, कृषि और विलासिता।' },
              3: { en: 'Gemini — Intellectual soul seeking knowledge and communication. Drawn to writing, teaching, trade, and media.', hi: 'मिथुन — ज्ञान और संवाद की खोज करने वाली बौद्धिक आत्मा। लेखन, शिक्षण, मीडिया।' },
              4: { en: 'Cancer — Nurturing soul seeking emotional fulfillment. Drawn to caregiving, home, cooking, psychology.', hi: 'कर्क — भावनात्मक पूर्णता चाहने वाली पोषक आत्मा। देखभाल, गृह, मनोविज्ञान।' },
              5: { en: 'Leo — Royal soul seeking recognition and creative expression. Drawn to politics, performance, and authority.', hi: 'सिंह — मान्यता और सृजनात्मक अभिव्यक्ति चाहने वाली राजसी आत्मा। राजनीति, प्रदर्शन।' },
              6: { en: 'Virgo — Service-oriented soul seeking perfection. Drawn to healing, analysis, craftsmanship, and detail work.', hi: 'कन्या — पूर्णता चाहने वाली सेवा-उन्मुख आत्मा। उपचार, विश्लेषण, शिल्प।' },
              7: { en: 'Libra — Soul seeking balance, beauty, and harmony. Drawn to law, diplomacy, arts, and partnerships.', hi: 'तुला — सन्तुलन, सौन्दर्य और सामंजस्य की खोज। कानून, कूटनीति, कला।' },
              8: { en: 'Scorpio — Transformative soul seeking deep truth. Drawn to research, occult, medicine, and investigation.', hi: 'वृश्चिक — गहन सत्य खोजने वाली परिवर्तनकारी आत्मा। शोध, गुप्त विद्या, चिकित्सा।' },
              9: { en: 'Sagittarius — Dharmic soul seeking wisdom and higher learning. Drawn to philosophy, religion, law, and travel.', hi: 'धनु — ज्ञान और उच्च शिक्षा चाहने वाली धार्मिक आत्मा। दर्शन, धर्म, कानून।' },
              10: { en: 'Capricorn — Ambitious soul seeking lasting achievement. Drawn to governance, structure, tradition, and legacy.', hi: 'मकर — स्थायी उपलब्धि चाहने वाली महत्वाकांक्षी आत्मा। शासन, परम्परा, विरासत।' },
              11: { en: 'Aquarius — Humanitarian soul seeking universal truth. Drawn to science, technology, social reform, and innovation.', hi: 'कुम्भ — सार्वभौमिक सत्य चाहने वाली मानवतावादी आत्मा। विज्ञान, समाज सुधार।' },
              12: { en: 'Pisces — Spiritual soul seeking liberation. Drawn to meditation, healing, charity, and transcendence. Moksha-oriented.', hi: 'मीन — मोक्ष चाहने वाली आध्यात्मिक आत्मा। ध्यान, उपचार, दान। मोक्ष-उन्मुख।' },
            };

            // Arudha Pada implications
            const ARUDHA_MEANING: Record<number, { en: string; hi: string }> = {
              1: { en: 'Arudha Lagna (AL) — How the world perceives you. Your public image and reputation.', hi: 'आरूढ़ लग्न (AL) — विश्व आपको कैसे देखता है। सार्वजनिक छवि।' },
              2: { en: 'A2 — Perceived wealth and family status.', hi: 'A2 — प्रत्यक्ष धन और पारिवारिक स्थिति।' },
              3: { en: 'A3 — Image of courage and siblings.', hi: 'A3 — साहस और भाई-बहनों की छवि।' },
              4: { en: 'A4 — Perceived happiness and property.', hi: 'A4 — सुख और सम्पत्ति की छवि।' },
              5: { en: 'A5 — Image of intelligence and children.', hi: 'A5 — बुद्धि और सन्तान की छवि।' },
              6: { en: 'A6 — Perceived enemies and debts.', hi: 'A6 — शत्रुओं और ऋणों की छवि।' },
              7: { en: 'Darapada (A7) — How others see your marriage/partnerships. Spouse\'s public image.', hi: 'दारपद (A7) — विवाह/साझेदारी कैसी दिखती है। जीवनसाथी की सार्वजनिक छवि।' },
              8: { en: 'A8 — Perceived longevity and hidden matters.', hi: 'A8 — दीर्घायु और गुप्त विषयों की छवि।' },
              9: { en: 'A9 — Image of fortune and dharma.', hi: 'A9 — भाग्य और धर्म की छवि।' },
              10: { en: 'Rajapada (A10) — How your career/authority is perceived. Professional reputation.', hi: 'राजपद (A10) — कैरियर/अधिकार कैसा दिखता है। पेशेवर प्रतिष्ठा।' },
              11: { en: 'Labha Pada (A11) — Perceived gains, income, and social network.', hi: 'लाभपद (A11) — लाभ, आय और सामाजिक नेटवर्क की छवि।' },
              12: { en: 'Upapada (UL/A12) — The image of your spouse. Critical for marriage analysis.', hi: 'उपपद (UL/A12) — जीवनसाथी की छवि। विवाह विश्लेषण में महत्वपूर्ण।' },
            };

            // How each rashi colours the perception projected by an Arudha Pada
            const RASHI_ARUDHA_DESC: Record<number, { en: string; hi: string }> = {
              1:  { en: 'Aries here gives a bold, pioneering image — the world sees you (in this area) as someone who acts first, leads instinctively, and projects raw energy. There may be an aura of impatience or courage that precedes you.', hi: 'मेष यहाँ साहसी, अग्रणी छवि देता है — विश्व आपको इस क्षेत्र में पहले कार्य करने वाले, सहज नेतृत्व करने वाले के रूप में देखता है। एक ऊर्जावान, कभी-कभी अधीर आभा आपसे पहले पहुँचती है।' },
              2:  { en: 'Taurus here gives a stable, prosperous image — the world perceives this area of your life as grounded, reliable, and materially well-rooted. You project an air of permanence and sensory richness.', hi: 'वृष यहाँ स्थिर, समृद्ध छवि देता है — विश्व इस क्षेत्र को ठोस, विश्वसनीय और भौतिक रूप से सुदृढ़ मानता है। आप स्थायित्व और संवेदनशील समृद्धि का आभास देते हैं।' },
              3:  { en: 'Gemini here gives a versatile, communicative image — this area appears witty, curious, and multi-faceted to the world. Others see adaptability and intellectual energy — sometimes flickering between too many directions.', hi: 'मिथुन यहाँ बहुमुखी, संवादी छवि देता है — यह क्षेत्र बुद्धिमान, जिज्ञासु और बहुआयामी दिखता है। दूसरे अनुकूलनशीलता देखते हैं, कभी-कभी अनेक दिशाओं में बिखरी।' },
              4:  { en: 'Cancer here gives a nurturing, familial image — the world sees this area as emotionally rooted, home-centred, and deeply caring. There is a private, protective quality to the perception — like a house with strong walls.', hi: 'कर्क यहाँ पोषणकारी, पारिवारिक छवि देता है — विश्व इस क्षेत्र को भावनात्मक, गृह-केन्द्रित और गहरे देखभाल करने वाला मानता है। संरक्षक, निजी गुण की अनुभूति होती है।' },
              5:  { en: 'Leo here gives a radiant, authoritative image — this area projects confidence, creativity, and leadership. The world expects something grand and authentic from you here. The spotlight follows naturally — use it wisely.', hi: 'सिंह यहाँ तेजस्वी, अधिकारपूर्ण छवि देता है — यह क्षेत्र आत्मविश्वास, रचनात्मकता और नेतृत्व प्रक्षेपित करता है। विश्व यहाँ कुछ भव्य और प्रामाणिक की अपेक्षा रखता है।' },
              6:  { en: 'Virgo here gives a precise, service-oriented image — the world perceives this area as analytical, detail-driven, and practically useful. You project competence and care — but may be seen as critical or overly particular.', hi: 'कन्या यहाँ सटीक, सेवा-उन्मुख छवि देता है — विश्व इस क्षेत्र को विश्लेषणात्मक और व्यावहारिक मानता है। आप सक्षमता प्रक्षेपित करते हैं, पर कभी-कभी अत्यधिक आलोचनात्मक लग सकते हैं।' },
              7:  { en: 'Libra here gives a charming, diplomatic image — the world sees this area as graceful, relationship-oriented, and aesthetically refined. Others are drawn in; there is a magnetic fairness to the perception.', hi: 'तुला यहाँ आकर्षक, कूटनीतिक छवि देता है — विश्व इस क्षेत्र को सुरुचिपूर्ण, सम्बन्ध-उन्मुख और सौन्दर्यपूर्ण मानता है। एक चुम्बकीय निष्पक्षता की अनुभूति होती है।' },
              8:  { en: 'Scorpio here gives an intense, mysterious image — the world perceives this area as deep, transformative, and not fully knowable. Others sense hidden power or hidden struggle here. The perception carries weight and intrigue.', hi: 'वृश्चिक यहाँ तीव्र, रहस्यमय छवि देता है — विश्व इस क्षेत्र को गहरा, रूपान्तरकारी और पूरी तरह अज्ञेय मानता है। छिपी शक्ति या संघर्ष की अनुभूति होती है।' },
              9:  { en: 'Sagittarius here gives an expansive, philosophical image — the world sees this area as optimistic, principled, and wisdom-seeking. You project a teacher or traveller quality — someone whose horizons are always expanding.', hi: 'धनु यहाँ विस्तृत, दार्शनिक छवि देता है — विश्व इस क्षेत्र को आशावादी, सिद्धान्तनिष्ठ और ज्ञान-खोजी मानता है। एक शिक्षक या यात्री का भाव प्रक्षेपित होता है।' },
              10: { en: 'Capricorn here gives a disciplined, ambitious image — the world perceives this area as structured, achievement-driven, and enduring. You project authority through results, not words. Long-term credibility is your hallmark.', hi: 'मकर यहाँ अनुशासित, महत्वाकांक्षी छवि देता है — विश्व इस क्षेत्र को संरचित और परिणाम-उन्मुख मानता है। आप परिणामों से अधिकार प्रक्षेपित करते हैं, शब्दों से नहीं।' },
              11: { en: 'Aquarius here gives a progressive, collective image — the world sees this area as unconventional, socially conscious, and future-oriented. You project idealism and independent thinking — sometimes ahead of your time.', hi: 'कुम्भ यहाँ प्रगतिशील, सामूहिक छवि देता है — विश्व इस क्षेत्र को अपरम्परागत और सामाजिक रूप से जागरूक मानता है। आदर्शवाद और स्वतन्त्र विचार प्रक्षेपित होते हैं।' },
              12: { en: 'Pisces here gives a spiritual, elusive image — the world perceives this area as mysterious, compassionate, and otherworldly. There is a sense of sacrifice or transcendence around it. Perception may be idealised or difficult to pin down.', hi: 'मीन यहाँ आध्यात्मिक, अस्पष्ट छवि देता है — विश्व इस क्षेत्र को रहस्यमय, करुणामय और अलौकिक मानता है। त्याग या अतिक्रमण का भाव होता है।' },
            };

            return (
            <div className="space-y-8">
              {/* System intro */}
              <div className="text-center">
                <h3 className="text-gold-gradient text-2xl font-bold mb-3" style={headingFont}>
                  {locale === 'en' ? 'Jaimini Astrology' : 'जैमिनी ज्योतिष'}
                </h3>
                <p className="text-text-secondary/70 text-sm max-w-2xl mx-auto leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {locale === 'en'
                    ? 'Jaimini system uses Chara Karakas (variable significators) — planets ranked by degree to determine who plays what role in your life. Unlike Parashara where planet roles are fixed, Jaimini assigns roles based on your unique chart. The planet with the highest degree becomes your Atmakaraka (soul significator), the next becomes Amatyakaraka (career), and so on.'
                    : 'जैमिनी पद्धति चर कारकों का उपयोग करती है — ग्रह अंश के अनुसार क्रमबद्ध होकर निर्धारित करते हैं कि आपके जीवन में कौन क्या भूमिका निभाता है। पाराशर से भिन्न जहाँ ग्रह भूमिकाएँ निश्चित हैं, जैमिनी आपकी अद्वितीय कुण्डली के आधार पर भूमिकाएँ देती है।'}
                </p>
              </div>

              {/* Chara Karakas */}
              <div>
                <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
                  {locale === 'en' ? 'Chara Karakas (Variable Significators)' : 'चर कारक (परिवर्तनशील कारक)'}
                </h3>
                <p className="text-text-secondary/50 text-xs text-center mb-4">
                  {locale === 'en' ? 'Planets ranked by degree — highest to lowest — each assigned a life role' : 'ग्रह अंश के अनुसार क्रमबद्ध — उच्चतम से निम्नतम — प्रत्येक को जीवन भूमिका'}
                </p>
                <div className="space-y-3">
                  {kundali.jaimini.charaKarakas.map((ck, i) => {
                    const info = KARAKA_INFO[ck.karaka];
                    return (
                    <div key={i} className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 border ${i === 0 ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/8'}`}>
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-14 text-center pt-1">
                          <div className="text-gold-light font-bold text-lg" style={headingFont}>{ck.planetName[locale]}</div>
                          <div className="text-gold-primary/40 font-mono text-xs">{ck.karaka} &middot; {ck.degree.toFixed(1)}°</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                            <span className="text-gold-primary font-bold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                              {info?.full?.[locale === 'en' ? 'en' : 'hi'] || ck.karakaName[locale]}
                            </span>
                            <span className="text-text-secondary/50 text-xs">
                              ({info?.meaning?.[locale === 'en' ? 'en' : 'hi'] || ck.karakaName[locale]})
                            </span>
                          </div>
                          {info?.governs && (
                            <p className="text-text-secondary/60 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                              {info.governs[locale === 'en' ? 'en' : 'hi']}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Karakamsha */}
              <div>
                <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
                  {locale === 'en' ? 'Karakamsha' : 'कारकांश'}
                </h3>
                <p className="text-text-secondary/50 text-xs text-center mb-4">
                  {locale === 'en' ? 'The Navamsha sign of your Atmakaraka — reveals your soul\'s ultimate destination' : 'आत्मकारक की नवांश राशि — आत्मा का अन्तिम गन्तव्य'}
                </p>
                <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 max-w-lg mx-auto">
                  <div className="text-center mb-3">
                    <RashiIconById id={kundali.jaimini.karakamsha.sign} size={48} />
                    <div className="text-gold-light font-bold text-2xl mt-2" style={headingFont}>{kundali.jaimini.karakamsha.signName[locale]}</div>
                  </div>
                  {KARAKAMSHA_MEANING[kundali.jaimini.karakamsha.sign] && (
                    <p className="text-text-secondary text-sm text-center leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {KARAKAMSHA_MEANING[kundali.jaimini.karakamsha.sign][locale === 'en' ? 'en' : 'hi']}
                    </p>
                  )}
                </div>
              </div>

              {/* Arudha Padas */}
              <div>
                <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
                  {locale === 'en' ? 'Arudha Padas (Image Points)' : 'आरूढ़ पद (छवि बिन्दु)'}
                </h3>
                <p className="text-text-secondary/50 text-xs text-center mb-4">
                  {locale === 'en' ? 'How the world perceives each area of your life — the "maya" or illusion projected outward' : 'विश्व आपके जीवन के प्रत्येक क्षेत्र को कैसे देखता है — बाहर प्रक्षेपित "माया"'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {kundali.jaimini.arudhaPadas.map((ap, i) => {
                    const meaning = ARUDHA_MEANING[ap.house];
                    const rashiDesc = RASHI_ARUDHA_DESC[ap.sign];
                    const isKey = i === 0 || ap.house === 7 || ap.house === 10 || ap.house === 12;
                    return (
                      <div key={i} className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-3 ${isKey ? 'border border-gold-primary/20 bg-gold-primary/[0.03]' : 'border border-gold-primary/8'}`}>
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 w-10 h-10 rounded-lg bg-bg-secondary/50 flex items-center justify-center mt-0.5">
                            <span className="text-gold-primary font-bold text-sm">A{ap.house}</span>
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-gold-light font-semibold text-sm" style={headingFont}>{ap.signName[locale]}</span>
                              <span className="text-text-secondary/40 text-xs">{ap.label[locale]}</span>
                            </div>
                            {meaning && (
                              <p className="text-text-secondary/60 text-xs leading-relaxed font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                {meaning[locale === 'en' ? 'en' : 'hi']}
                              </p>
                            )}
                            {rashiDesc && (
                              <p className="text-text-secondary/45 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                {rashiDesc[locale === 'en' ? 'en' : 'hi']}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Graha Arudhas */}
              {kundali.jaimini?.grahaArudhas && kundali.jaimini.grahaArudhas.length > 0 && (
                <div>
                  <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
                    {locale === 'en' ? 'Graha Arudhas (Planet Projections)' : 'ग्रह आरूढ़ (ग्रह प्रक्षेपण)'}
                  </h3>
                  <p className="text-text-secondary/50 text-xs text-center mb-4">
                    {locale === 'en' ? 'The Arudha of each planet — where its energy projects outward into the world' : 'प्रत्येक ग्रह का आरूढ़ — जहाँ इसकी ऊर्जा बाहर की ओर प्रक्षेपित होती है'}
                  </p>
                  <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 divide-x divide-y divide-gold-primary/10">
                      {kundali.jaimini.grahaArudhas.map((ga, i) => (
                        <div key={i} className="p-3 text-center">
                          <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{ga.planetName[locale as Locale] || ga.planetName.en}</div>
                          <div className="text-gold-light font-bold text-sm mt-1" style={headingFont}>{ga.arudhaSignName[locale as Locale] || ga.arudhaSignName.en}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Rashi Drishti (Sign Aspects) */}
              {(() => {
                const ascSign = kundali.ascendant.sign;
                const moonSign = kundali.planets.find(p => p.planet.id === 1)?.sign ?? 0;
                const karakamsha = kundali.jaimini?.karakamsha.sign ?? 0;

                const SIGN_NAMES_EN = ['Ar','Ta','Ge','Ca','Le','Vi','Li','Sc','Sa','Cp','Aq','Pi'];
                const SIGN_NAMES_HI = ['मेष','वृष','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'];
                const keySignIds = new Set([ascSign, moonSign, karakamsha].filter(s => s > 0));

                const mutualAspects = getMutualRashiDrishti();
                const mutualSet = new Set(mutualAspects.map(m => `${m.sign1}-${m.sign2}`));

                return (
                  <div>
                    <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
                      {locale === 'en' ? 'Rashi Drishti (Sign Aspects)' : 'राशि दृष्टि (राशि पहलू)'}
                    </h3>
                    <p className="text-text-secondary/50 text-xs text-center mb-1 max-w-2xl mx-auto" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {locale === 'en'
                        ? 'Jaimini sign aspects: Movable signs aspect all Fixed signs (except adjacent), Fixed aspect Movable (except adjacent), Dual aspect Dual (except adjacent).'
                        : 'जैमिनी राशि दृष्टि: चर राशियाँ सभी स्थिर राशियों को देखती हैं (आसन्न को छोड़कर), स्थिर राशियाँ चर को, द्विस्वभाव राशियाँ द्विस्वभाव को।'}
                    </p>
                    <p className="text-text-secondary/40 text-[11px] text-center mb-4">
                      {locale === 'en'
                        ? 'Gold border = your Lagna / Moon / Karakamsha. Mutual aspects shown in bold.'
                        : 'सुनहरी सीमा = आपकी लग्न / चन्द्र / कारकांश। परस्पर दृष्टि बोल्ड में।'}
                    </p>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(fromSign => {
                        const aspectedSigns: number[] = [];
                        for (let to = 1; to <= 12; to++) {
                          if (hasRashiDrishti(fromSign, to)) aspectedSigns.push(to);
                        }
                        const isKey = keySignIds.has(fromSign);
                        const hasMutual = aspectedSigns.some(to => mutualSet.has(`${Math.min(fromSign,to)}-${Math.max(fromSign,to)}`));

                        return (
                          <div
                            key={fromSign}
                            className={`rounded-xl p-3 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border ${isKey ? 'border-gold-primary/40 shadow-sm shadow-gold-primary/10' : 'border-gold-primary/8'}`}
                          >
                            {/* Sign header */}
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className={`text-xs font-bold ${isKey ? 'text-gold-light' : 'text-gold-primary/70'}`} style={headingFont}>
                                {locale === 'en' ? SIGN_NAMES_EN[fromSign - 1] : SIGN_NAMES_HI[fromSign - 1]}
                              </span>
                              <span className="text-text-secondary/30 text-[10px] font-mono">{fromSign}</span>
                              {isKey && (
                                <span className="ml-auto text-[9px] px-1 py-0.5 rounded-full bg-gold-primary/15 text-gold-primary font-bold">
                                  {fromSign === ascSign ? (locale === 'en' ? 'L' : 'ल') : fromSign === moonSign ? (locale === 'en' ? 'M' : 'च') : (locale === 'en' ? 'K' : 'क')}
                                </span>
                              )}
                            </div>

                            {/* Aspected signs */}
                            <div className="flex flex-wrap gap-1">
                              {aspectedSigns.length === 0 ? (
                                <span className="text-text-secondary/25 text-[10px]">—</span>
                              ) : aspectedSigns.map(to => {
                                const isMut = mutualSet.has(`${Math.min(fromSign,to)}-${Math.max(fromSign,to)}`);
                                const isToKey = keySignIds.has(to);
                                return (
                                  <span
                                    key={to}
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                                      isMut && isToKey ? 'bg-gold-primary/25 text-gold-light font-bold' :
                                      isMut ? 'bg-purple-500/15 text-purple-300/80 font-semibold' :
                                      isToKey ? 'bg-gold-primary/12 text-gold-primary/90' :
                                      'bg-bg-secondary/50 text-text-secondary/50'
                                    }`}
                                  >
                                    {locale === 'en' ? SIGN_NAMES_EN[to - 1] : SIGN_NAMES_HI[to - 1]}
                                    {isMut && <span className="ml-0.5 opacity-60">↔</span>}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mutual aspects summary */}
                    {mutualAspects.length > 0 && (
                      <div className="mt-4 rounded-xl bg-purple-500/5 border border-purple-500/15 p-3">
                        <div className="text-purple-300/70 text-xs font-bold mb-2">
                          {locale === 'en' ? 'Mutual Sign Aspects (↔ Both aspects each other)' : 'परस्पर राशि दृष्टि (↔ दोनों परस्पर देखती हैं)'}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {mutualAspects.map(m => {
                            const s1Key = keySignIds.has(m.sign1);
                            const s2Key = keySignIds.has(m.sign2);
                            const isHighlighted = s1Key || s2Key;
                            return (
                              <span
                                key={`${m.sign1}-${m.sign2}`}
                                className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${isHighlighted ? 'bg-gold-primary/20 text-gold-light font-bold' : 'bg-purple-500/10 text-purple-200/60'}`}
                              >
                                {locale === 'en' ? SIGN_NAMES_EN[m.sign1-1] : SIGN_NAMES_HI[m.sign1-1]}
                                {' ↔ '}
                                {locale === 'en' ? SIGN_NAMES_EN[m.sign2-1] : SIGN_NAMES_HI[m.sign2-1]}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Argala (Planetary Interventions) */}
              {kundali.argala && kundali.argala.length > 0 && (() => {
                const HOUSE_LABELS: Record<number, { en: string; hi: string }> = {
                  1: { en: 'Lagna', hi: 'लग्न' }, 2: { en: 'Dhana', hi: 'धन' }, 3: { en: 'Sahaja', hi: 'सहज' },
                  4: { en: 'Sukha', hi: 'सुख' }, 5: { en: 'Putra', hi: 'पुत्र' }, 6: { en: 'Ari', hi: 'अरि' },
                  7: { en: 'Kalatra', hi: 'कलत्र' }, 8: { en: 'Randhra', hi: 'रन्ध्र' }, 9: { en: 'Dharma', hi: 'धर्म' },
                  10: { en: 'Karma', hi: 'कर्म' }, 11: { en: 'Labha', hi: 'लाभ' }, 12: { en: 'Vyaya', hi: 'व्यय' },
                };
                return (
                  <div>
                    <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
                      {locale === 'en' ? 'Argala (Planetary Interventions)' : 'अर्गल (ग्रह हस्तक्षेप)'}
                    </h3>
                    <p className="text-text-secondary/50 text-xs text-center mb-4 max-w-2xl mx-auto" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {locale === 'en'
                        ? 'Planets in 2nd, 4th, and 11th from each house create Argala (intervention) — those in 12th, 10th, 3rd counter it (Virodha). Net effect shows whether planetary forces support or obstruct each house.'
                        : 'प्रत्येक भाव से 2रे, 4थे, 11वें ग्रह अर्गल बनाते हैं — 12वें, 10वें, 3रे से ग्रह विरोधार्गल। शुद्ध प्रभाव दर्शाता है कि ग्रह शक्तियाँ प्रत्येक भाव को सहयोग देती हैं या बाधित करती हैं।'}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {kundali.argala.map((ar) => {
                        const rashiName = RASHIS[ar.sign - 1]?.name;
                        const signLabel = rashiName ? (locale === 'en' ? rashiName.en : rashiName.hi) : `S${ar.sign}`;
                        const houseLabel = HOUSE_LABELS[ar.house];
                        const strongArgalas = ar.argalas.filter(a => a.strength === 'strong');
                        const strongVirodha = ar.virodha.filter(v => v.strength === 'strong');
                        return (
                          <div key={ar.house} className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border p-3 ${
                            ar.netEffect === 'supported' ? 'border-emerald-500/25' :
                            ar.netEffect === 'obstructed' ? 'border-red-500/20' : 'border-gold-primary/8'
                          }`}>
                            {/* House header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded bg-bg-secondary/80 flex items-center justify-center text-gold-primary font-bold text-xs">{ar.house}</span>
                                <div>
                                  <div className="text-gold-light font-semibold text-xs" style={headingFont}>{signLabel}</div>
                                  <div className="text-text-secondary/40 text-[10px]">{houseLabel?.[locale === 'en' ? 'en' : 'hi']}</div>
                                </div>
                              </div>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                ar.netEffect === 'supported' ? 'bg-emerald-500/15 text-emerald-400' :
                                ar.netEffect === 'obstructed' ? 'bg-red-500/12 text-red-400' : 'bg-bg-secondary/60 text-text-secondary/50'
                              }`}>
                                {ar.netEffect === 'supported' ? (locale === 'en' ? '✦ Active' : '✦ सक्रिय') :
                                 ar.netEffect === 'obstructed' ? (locale === 'en' ? '↓ Blocked' : '↓ अवरुद्ध') :
                                 (locale === 'en' ? '— Neutral' : '— तटस्थ')}
                              </span>
                            </div>

                            {/* Argala planets */}
                            {strongArgalas.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-1">
                                {strongArgalas.map((a, i) => (
                                  <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded-full ${a.nature === 'benefic' ? 'bg-emerald-500/12 text-emerald-300/80' : 'bg-amber-500/12 text-amber-300/70'}`}>
                                    {a.planetName[locale as 'en' | 'hi' | 'sa'] || a.planetName.en}
                                    <span className="text-text-secondary/30 ml-0.5">+{a.fromHouse}</span>
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Virodha planets */}
                            {strongVirodha.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {strongVirodha.map((v, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-300/60">
                                    {v.planetName[locale as 'en' | 'hi' | 'sa'] || v.planetName.en}
                                    <span className="text-text-secondary/30 ml-0.5">−{v.fromHouse}</span>
                                  </span>
                                ))}
                              </div>
                            )}

                            {strongArgalas.length === 0 && strongVirodha.length === 0 && (
                              <p className="text-text-secondary/30 text-[10px]">{locale === 'en' ? 'No strong interventions' : 'कोई प्रबल हस्तक्षेप नहीं'}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

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
                      <div key={i} className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 flex items-center justify-between ${isCurrent ? 'border border-gold-primary/40 bg-gold-primary/5' : ''} ${isPast ? 'opacity-40' : ''}`}>
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
              <JaiminiInterpretation jaimini={kundali.jaimini} locale={locale} />
            </div>
            );
          })()}

          {/* ===== LIFE TIMELINE TAB ===== */}
          {activeTab === 'timeline' && (
            <LifeTimeline
              kundali={kundali}
              locale={locale}
              isDevanagari={isDevanagari}
              headingFont={headingFont}
            />
          )}

          {/* ===== PATRIKA TAB ===== */}
          {activeTab === 'patrika' && (() => {
            const bd = kundali.birthData;
            const mahaDashas = kundali.dashas.filter(d => d.level === 'maha');
            const now = new Date();

            // Detect key doshas
            const doshas: { name: { en: string; hi: string }; present: boolean; detail: { en: string; hi: string } }[] = [];

            // Manglik: Mars in 1,2,4,7,8,12
            const mars = kundali.planets.find(p => p.planet.id === 2);
            const isManglik = mars ? [1, 2, 4, 7, 8, 12].includes(mars.house) : false;
            doshas.push({
              name: { en: 'Manglik Dosha', hi: 'मांगलिक दोष' },
              present: isManglik,
              detail: isManglik
                ? { en: `Mars in House ${mars!.house}`, hi: `मंगल भाव ${mars!.house} में` }
                : { en: 'Mars not in 1/2/4/7/8/12', hi: 'मंगल 1/2/4/7/8/12 में नहीं' },
            });

            // Kaal Sarp: all planets between Rahu-Ketu axis
            const rahu = kundali.planets.find(p => p.planet.id === 7);
            const ketu = kundali.planets.find(p => p.planet.id === 8);
            let isKaalSarp = false;
            if (rahu && ketu) {
              const rahuLon = rahu.longitude;
              const ketuLon = ketu.longitude;
              const others = kundali.planets.filter(p => p.planet.id !== 7 && p.planet.id !== 8);
              const allOnOneSide = others.every(p => {
                const lon = p.longitude;
                if (rahuLon < ketuLon) return lon >= rahuLon && lon <= ketuLon;
                return lon >= rahuLon || lon <= ketuLon;
              });
              const allOnOtherSide = others.every(p => {
                const lon = p.longitude;
                if (ketuLon < rahuLon) return lon >= ketuLon && lon <= rahuLon;
                return lon >= ketuLon || lon <= rahuLon;
              });
              isKaalSarp = allOnOneSide || allOnOtherSide;
            }
            doshas.push({
              name: { en: 'Kaal Sarp Dosha', hi: 'काल सर्प दोष' },
              present: isKaalSarp,
              detail: isKaalSarp
                ? { en: 'All planets hemmed between Rahu-Ketu axis', hi: 'सभी ग्रह राहु-केतु अक्ष के बीच' }
                : { en: 'Not present', hi: 'उपस्थित नहीं' },
            });

            // Ganda Mula
            const moon = kundali.planets.find(p => p.planet.id === 1);
            const gandaMulaNakshatras = [1, 10, 19, 9, 18, 27];
            const isGandaMula = moon ? gandaMulaNakshatras.includes(moon.nakshatra.id) : false;
            doshas.push({
              name: { en: 'Ganda Mula', hi: 'गण्ड मूल' },
              present: isGandaMula,
              detail: isGandaMula
                ? { en: `Moon in ${moon!.nakshatra.name.en}`, hi: `चन्द्र ${moon!.nakshatra.name.hi} में` }
                : { en: 'Moon not in Ganda Mula nakshatra', hi: 'चन्द्र गण्ड मूल नक्षत्र में नहीं' },
            });

            // Sade Sati
            const isSadeSati = kundali.sadeSati?.isActive ?? false;
            doshas.push({
              name: { en: 'Sade Sati', hi: 'साढ़े साती' },
              present: isSadeSati,
              detail: isSadeSati
                ? { en: `Currently active — ${kundali.sadeSati?.currentPhase || 'ongoing'}`, hi: `वर्तमान में सक्रिय — ${kundali.sadeSati?.currentPhase || 'चालू'}` }
                : { en: 'Not currently active', hi: 'वर्तमान में सक्रिय नहीं' },
            });

            return (
            <div className="space-y-6">
              {/* Print/PDF controls */}
              <div className="flex justify-center gap-3 mb-4">
                <button
                  onClick={async () => {
                    const { exportKundaliPDF } = await import('@/lib/export/pdf-kundali');
                    exportKundaliPDF(kundali, locale as Locale, tip ?? undefined);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <PrintButton
                  contentHtml={generateKundaliPrintHtml(kundali, locale as 'en' | 'hi' | 'sa')}
                  title={`Patrika — ${bd.name}`}
                  label={locale === 'en' ? 'Print' : 'प्रिंट'}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
                />
              </div>

              {/* Patrika content */}
              <div ref={patrikaRef} className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8 space-y-8">

                {/* Header: Swastika + Om + Name + Birth Details */}
                <div className="text-center space-y-3">
                  <div className="text-5xl text-red-500" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>卐</div>
                  <div className="text-orange-500 text-xl font-bold" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>ॐ श्री गणेशाय नमः</div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
                    {locale === 'en' ? 'Janma Patrika' : 'जन्म पत्रिका'}
                  </h2>

                  {/* Name */}
                  <p className="text-gold-primary text-xl font-bold" style={headingFont}>{bd.name || (locale === 'en' ? 'Native' : 'जातक')}</p>

                  {/* Birth data grid */}
                  <div className="max-w-lg mx-auto">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                      <span className="text-gold-dark text-right">{locale === 'en' ? 'Date of Birth' : 'जन्म दिनांक'}</span>
                      <span className="text-text-secondary text-left font-mono">{bd.date}</span>
                      <span className="text-gold-dark text-right">{locale === 'en' ? 'Time of Birth' : 'जन्म समय'}</span>
                      <span className="text-text-secondary text-left font-mono">{bd.time}</span>
                      <span className="text-gold-dark text-right">{locale === 'en' ? 'Place of Birth' : 'जन्म स्थान'}</span>
                      <span className="text-text-secondary text-left">{bd.place || `${bd.lat.toFixed(2)}°N, ${bd.lng.toFixed(2)}°E`}</span>
                      <span className="text-gold-dark text-right">{locale === 'en' ? 'Ayanamsha' : 'अयनांश'}</span>
                      <span className="text-text-secondary text-left font-mono">{bd.ayanamsha} ({kundali.ayanamshaValue.toFixed(4)}°)</span>
                    </div>
                  </div>

                  <div className="border-t border-gold-primary/10 my-2" />

                  {/* Vedic birth details: Lagna, Rashi, Nakshatra, Tithi, Yoga, Masa */}
                  {(() => {
                    const moonP = kundali.planets.find(p => p.planet.id === 1);
                    const sunP = kundali.planets.find(p => p.planet.id === 0);
                    const lagnaR = RASHIS[kundali.ascendant.sign - 1];
                    const moonR = moonP ? RASHIS[moonP.sign - 1] : null;
                    const sunR = sunP ? RASHIS[sunP.sign - 1] : null;

                    // Compute tithi, yoga, masa from julianDay
                    const { calculateTithi, calculateYoga, sunLongitude: sunLon, toSidereal: toSid, getMasa, MASA_NAMES } = require('@/lib/ephem/astronomical');
                    const { TITHIS } = require('@/lib/constants/tithis');
                    const { YOGAS } = require('@/lib/constants/yogas');
                    const jd = kundali.julianDay;
                    const tR = calculateTithi(jd);
                    const tD = TITHIS[tR.number - 1];
                    const yN = calculateYoga(jd);
                    const yD = YOGAS[yN - 1];
                    const sS = toSid(sunLon(jd), jd);
                    const mI = getMasa(sS);
                    const mD = MASA_NAMES[mI];

                    return (
                      <div className="max-w-2xl mx-auto">
                        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs">
                          <span><span className="text-text-secondary/50">{locale === 'en' ? 'Lagna' : 'लग्न'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{lagnaR?.name[locale]} ({kundali.ascendant.degree.toFixed(1)}°)</span></span>
                          <span className="text-gold-primary/15">|</span>
                          <span><span className="text-text-secondary/50">{locale === 'en' ? 'Chandra' : 'चन्द्र'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{moonR?.name[locale] || '—'}</span></span>
                          <span className="text-gold-primary/15">|</span>
                          <span><span className="text-text-secondary/50">{locale === 'en' ? 'Surya' : 'सूर्य'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{sunR?.name[locale] || '—'}</span></span>
                          <span className="text-gold-primary/15">|</span>
                          <span><span className="text-text-secondary/50">{locale === 'en' ? 'Nakshatra' : 'नक्षत्र'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{moonP?.nakshatra?.name?.[locale] || '—'} ({locale === 'en' ? 'Pada' : 'पाद'} {moonP?.pada || '—'})</span></span>
                          <span className="text-gold-primary/15">|</span>
                          <span><span className="text-text-secondary/50">{locale === 'en' ? 'Tithi' : 'तिथि'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tD?.name?.[locale] || '—'} ({tD?.paksha === 'shukla' ? (locale === 'en' ? 'Shukla' : 'शुक्ल') : (locale === 'en' ? 'Krishna' : 'कृष्ण')})</span></span>
                          <span className="text-gold-primary/15">|</span>
                          <span><span className="text-text-secondary/50">{locale === 'en' ? 'Yoga' : 'योग'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{yD?.name?.[locale] || '—'}</span></span>
                          <span className="text-gold-primary/15">|</span>
                          <span><span className="text-text-secondary/50">{locale === 'en' ? 'Masa' : 'मास'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{mD?.[locale] || '—'}</span></span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="border-t border-gold-primary/10" />

                {/* D1 + D9 Charts Side by Side */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider mb-3">
                        {locale === 'en' ? 'D1 — Rashi Chart' : 'D1 — राशि चक्र'}
                      </h3>
                      <div className="flex justify-center">
                        {chartStyle === 'south' ? (
                          <ChartSouth data={kundali.chart} title={locale === 'en' ? 'D1 Rashi' : 'D1 राशि'} size={280} />
                        ) : (
                          <ChartNorth data={kundali.chart} title={locale === 'en' ? 'D1 Rashi' : 'D1 राशि'} size={280} />
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-gold-primary text-sm font-bold uppercase tracking-wider mb-3">
                        {locale === 'en' ? 'D9 — Navamsha Chart' : 'D9 — नवांश चक्र'}
                      </h3>
                      <div className="flex justify-center">
                        {chartStyle === 'south' ? (
                          <ChartSouth data={kundali.navamshaChart} title={locale === 'en' ? 'D9 Navamsha' : 'D9 नवांश'} size={280} />
                        ) : (
                          <ChartNorth data={kundali.navamshaChart} title={locale === 'en' ? 'D9 Navamsha' : 'D9 नवांश'} size={280} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gold-primary/10" />

                {/* Planet Positions Table */}
                <div>
                  <h3 className="text-gold-gradient text-xl font-bold text-center mb-4" style={headingFont}>
                    {locale === 'en' ? 'Planet Positions' : 'ग्रह स्थिति'}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-gold-primary/20">
                          <th className="text-gold-dark text-left py-2 px-3 font-semibold">{locale === 'en' ? 'Planet' : 'ग्रह'}</th>
                          <th className="text-gold-dark text-left py-2 px-3 font-semibold">{locale === 'en' ? 'Sign' : 'राशि'}</th>
                          <th className="text-gold-dark text-center py-2 px-3 font-semibold">{locale === 'en' ? 'House' : 'भाव'}</th>
                          <th className="text-gold-dark text-right py-2 px-3 font-semibold">{locale === 'en' ? 'Degree' : 'अंश'}</th>
                          <th className="text-gold-dark text-left py-2 px-3 font-semibold">{locale === 'en' ? 'Nakshatra' : 'नक्षत्र'}</th>
                          <th className="text-gold-dark text-center py-2 px-3 font-semibold">{locale === 'en' ? 'Pada' : 'पाद'}</th>
                          <th className="text-gold-dark text-center py-2 px-3 font-semibold">R</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kundali.planets.map((p) => (
                          <tr key={p.planet.id} className="border-b border-gold-primary/5 hover:bg-gold-primary/[0.03]">
                            <td className="py-2 px-3 font-medium" style={{ color: PLANET_COLORS[p.planet.id] || '#d4a853' }}>
                              <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{p.planet.name[locale]}</span>
                            </td>
                            <td className="py-2 px-3 text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                              {p.signName[locale]}
                            </td>
                            <td className="py-2 px-3 text-text-secondary text-center font-mono">{p.house}</td>
                            <td className="py-2 px-3 text-text-secondary text-right font-mono">{p.degree}</td>
                            <td className="py-2 px-3 text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                              {p.nakshatra.name[locale]}
                            </td>
                            <td className="py-2 px-3 text-text-secondary text-center font-mono">{p.pada}</td>
                            <td className="py-2 px-3 text-center">
                              {p.isRetrograde ? <span className="text-red-400 font-bold">R</span> : <span className="text-text-secondary/20">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-gold-primary/10" />

                {/* Vimshottari Dasha Summary */}
                <div>
                  <h3 className="text-gold-gradient text-xl font-bold text-center mb-4" style={headingFont}>
                    {locale === 'en' ? 'Vimshottari Maha Dasha' : 'विंशोत्तरी महादशा'}
                  </h3>
                  <div className="space-y-2">
                    {mahaDashas.map((d, i) => {
                      const start = new Date(d.startDate);
                      const end = new Date(d.endDate);
                      const isCurrent = now >= start && now <= end;
                      const isPast = now > end;
                      return (
                        <div key={i} className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${isCurrent ? 'bg-gold-primary/10 border border-gold-primary/30' : 'border border-gold-primary/5'} ${isPast ? 'opacity-40' : ''}`}>
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-gold-primary animate-pulse' : isPast ? 'bg-text-secondary/30' : 'bg-gold-dark/40'}`} />
                            <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                              {d.planetName[locale]}
                            </span>
                            {isCurrent && <span className="text-xs text-gold-primary font-bold uppercase tracking-wider">{locale === 'en' ? 'Current' : 'वर्तमान'}</span>}
                          </div>
                          <span className="text-text-secondary text-xs font-mono">{d.startDate} → {d.endDate}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-gold-primary/10" />

                {/* Key Doshas */}
                <div>
                  <h3 className="text-gold-gradient text-xl font-bold text-center mb-4" style={headingFont}>
                    {locale === 'en' ? 'Key Doshas' : 'प्रमुख दोष'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {doshas.map((dosha, i) => (
                      <div key={i} className={`rounded-xl p-4 border ${dosha.present ? 'bg-red-500/5 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/15'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2.5 h-2.5 rounded-full ${dosha.present ? 'bg-red-400' : 'bg-emerald-400'}`} />
                          <span className="text-gold-light font-semibold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                            {dosha.name[locale === 'en' ? 'en' : 'hi']}
                          </span>
                        </div>
                        <p className="text-text-secondary/60 text-xs ml-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {dosha.detail[locale === 'en' ? 'en' : 'hi']}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gold-primary/10" />

                {/* Footer */}
                <div className="text-center pt-2">
                  <p className="text-text-secondary/30 text-xs">
                    Generated by <span className="text-gold-dark/50">Dekho Panchang</span> — dekhopanchang.com
                  </p>
                </div>
              </div>
            </div>
            );
          })()}

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

  // Compute insights from SAV
  const strongSigns = RASHIS.filter((_, i) => ashtakavarga.savTable[i] >= 28).map(r => r.name[locale]);
  const weakSigns = RASHIS.filter((_, i) => ashtakavarga.savTable[i] < 22).map(r => r.name[locale]);
  const weakSignIds = RASHIS.filter((_, i) => ashtakavarga.savTable[i] < 22).map(r => r.id);

  // Compute accurate transit windows for slow planets through weak signs
  // Scan monthly from now for 15 years using actual ephemeris
  const weakTransits = useMemo(() => {
    if (weakSignIds.length === 0) return [];
    const results: { planet: string; sign: string; period: string }[] = [];
    // Planet IDs: Saturn=6, Jupiter=4, Rahu=7
    const slowPlanets = [
      { id: 6, name: { en: 'Saturn', hi: 'शनि' } },
      { id: 4, name: { en: 'Jupiter', hi: 'बृहस्पति' } },
      { id: 7, name: { en: 'Rahu', hi: 'राहु' } },
    ];
    const now = new Date();
    const startJd = dateToJD(now.getFullYear(), now.getMonth() + 1, 15, 12);
    const monthsToScan = 180; // 15 years

    for (const planet of slowPlanets) {
      for (const weakId of weakSignIds) {
        let entryMonth: string | null = null;
        let lastInSign = false;

        for (let m = 0; m <= monthsToScan; m++) {
          const jd = startJd + m * 30.44; // ~1 month
          const positions = getPlanetaryPositions(jd);
          const pos = positions.find(p => p.id === planet.id);
          if (!pos) continue;
          const sidLon = toSidereal(pos.longitude, jd);
          const sign = Math.floor(sidLon / 30) + 1;
          const inWeakSign = sign === weakId;

          if (inWeakSign && !lastInSign) {
            // Entry into weak sign
            const d = new Date(now.getTime() + m * 30.44 * 24 * 3600000);
            entryMonth = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          }
          if (!inWeakSign && lastInSign && entryMonth) {
            // Exit from weak sign
            const d = new Date(now.getTime() + m * 30.44 * 24 * 3600000);
            const exitMonth = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            results.push({
              planet: planet.name[locale === 'en' ? 'en' : 'hi'],
              sign: RASHIS[weakId - 1].name[locale],
              period: `${entryMonth} – ${exitMonth}`,
            });
            entryMonth = null;
          }
          lastInSign = inWeakSign;
        }
        // If still in sign at end of scan
        if (lastInSign && entryMonth) {
          results.push({
            planet: planet.name[locale === 'en' ? 'en' : 'hi'],
            sign: RASHIS[weakId - 1].name[locale],
            period: `${entryMonth} – ...`,
          });
        }
      }
    }
    return results;
  }, [weakSignIds, locale]);
  const totalBindu = ashtakavarga.savTable.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>{t('ashtakavarga')}</h3>

      {/* What is Ashtakavarga */}
      <div className="text-center text-text-secondary/70 text-sm max-w-2xl mx-auto leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
        {locale === 'en'
          ? 'Ashtakavarga is a point-based transit prediction system. Each planet contributes "bindu" (beneficial points) to signs. Signs with more bindus give better results during transits. SAV (Sarvashtakavarga) shows the total strength per sign; BPI (Bhinnashtakavarga) shows each planet\'s individual contribution.'
          : 'अष्टकवर्ग एक बिन्दु-आधारित गोचर फल पद्धति है। प्रत्येक ग्रह राशियों को "बिन्दु" (शुभ अंक) देता है। अधिक बिन्दु वाली राशियों में गोचर शुभ फल देते हैं। SAV कुल बल दर्शाता है; BPI प्रत्येक ग्रह का व्यक्तिगत योगदान।'}
      </div>

      {/* Quick insight */}
      {(strongSigns.length > 0 || weakSigns.length > 0) && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
          <h4 className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-3">{locale === 'en' ? 'Quick Insight' : 'संक्षिप्त अन्तर्दृष्टि'}</h4>
          <div className="space-y-2 text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {strongSigns.length > 0 && (
              <p className="text-emerald-400/80">
                {locale === 'en'
                  ? `Strong signs (28+ bindu): ${strongSigns.join(', ')} — planets transiting these signs bring favorable results.`
                  : `बलवान राशियाँ (28+ बिन्दु): ${strongSigns.join(', ')} — इन राशियों में गोचर शुभ फल देते हैं।`}
              </p>
            )}
            {weakSigns.length > 0 && (
              <div>
                <p className="text-red-400/70">
                  {locale === 'en'
                    ? `Weak signs (<22 bindu): ${weakSigns.join(', ')} — transits through these signs may bring challenges.`
                    : `दुर्बल राशियाँ (<22 बिन्दु): ${weakSigns.join(', ')} — इन राशियों में गोचर चुनौतीपूर्ण हो सकते हैं।`}
                </p>
                {weakTransits.length > 0 && (
                  <div className="mt-2 ml-2 space-y-1">
                    <p className="text-text-secondary/40 text-xs">{locale === 'en' ? 'Upcoming challenging transits:' : 'आगामी चुनौतीपूर्ण गोचर:'}</p>
                    {weakTransits.map((wt, idx) => (
                      <p key={idx} className="text-red-400/50 text-xs flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400/40 shrink-0" />
                        <span className="font-medium text-red-400/70">{wt.planet}</span> {locale === 'en' ? 'in' : ''} {wt.sign}: <span className="font-mono">{wt.period}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
            <p className="text-text-secondary/50 text-xs">
              {locale === 'en'
                ? `Total SAV: ${totalBindu} (average: ${Math.round(totalBindu / 12)} per sign). Values above 28 are strong, below 22 are weak.`
                : `कुल SAV: ${totalBindu} (औसत: ${Math.round(totalBindu / 12)} प्रति राशि)। 28 से ऊपर बलवान, 22 से नीचे दुर्बल।`}
            </p>
          </div>
        </div>
      )}

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
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 overflow-x-auto">
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
                  <div className="text-xs text-text-secondary mt-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{r.name[locale]}</div>
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
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 overflow-x-auto">
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
                        <span className="text-xs text-text-secondary/60 mt-0.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{r.name[locale].slice(0, 3)}</span>
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
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8 border-2 border-gold-primary/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-primary/0 via-gold-primary to-gold-primary/0" />
        <h4 className="text-gold-primary text-sm uppercase tracking-wider mb-3 font-semibold">{tTip('yearOverview')}</h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {yp.overview}
        </p>
      </div>

      {/* Events timeline */}
      {yp.events.length > 0 && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
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
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
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
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8 border border-gold-primary/25 bg-gradient-to-br from-gold-primary/5 to-transparent">
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
        <span className={`text-xs px-1.5 py-0.5 rounded-full border ${confidenceColors[refs.confidence]}`}>
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
                        {cite.verseRange && <span className="text-text-secondary/50 text-xs font-mono">{cite.verseRange}</span>}
                      </div>
                      {cite.sanskritExcerpt && (
                        <p className="text-amber-200/60 text-xs italic mb-1" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
                          {cite.sanskritExcerpt}
                        </p>
                      )}
                      <p className="text-text-secondary text-xs leading-relaxed">{cite.translationExcerpt}</p>
                      {cite.relevanceNote && (
                        <p className="text-amber-500/50 text-xs mt-1 italic">{cite.relevanceNote}</p>
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
      <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
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
              <div className="text-xs text-text-tertiary leading-tight mt-0.5">{isHi ? v.meaning.hi : v.meaning.en}</div>
              <div className="text-xs font-medium mt-0.5">{isHi ? sL[v.strength].hi : sL[v.strength].en}</div>
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
              className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-3 border-b border-gold-primary/10 ${sC[v.strength].split(' ').slice(1).join(' ')}`}>
                <div className="flex items-center gap-3">
                  <span className="text-gold-light font-bold text-lg">{v.chart}</span>
                  <span className="text-text-secondary text-xs">{isHi ? v.label.hi : v.label.en}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${sC[v.strength]}`}>
                  {isHi ? sL[v.strength].hi : sL[v.strength].en}
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Overall Commentary */}
                <div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
                    {isHi ? 'समग्र टिप्पणी' : 'Overall Commentary'}
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed whitespace-pre-line">
                    {isHi ? v.overallCommentary.hi : v.overallCommentary.en}
                  </div>
                </div>

                {/* Key Findings */}
                {v.keyFindings.length > 0 && (
                  <div>
                    <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
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
                  <div className="text-indigo-400 text-xs uppercase tracking-widest font-bold mb-2">
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
  const [expandedAntar, setExpandedAntar] = useState<number | null>(null);
  const [expandedPratyantar, setExpandedPratyantar] = useState<string | null>(null);
  const [selectedMahaTimeline, setSelectedMahaTimeline] = useState<number | null>(null);

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

  // Detect afflicted planets for graha shanti recommendations
  const afflictedPlanets = useMemo<AfflictedPlanet[]>(() => {
    if (!kundali.planets) return [];
    const strengthMap = new Map<number, number>();
    tip.strengthOverview.forEach(s => {
      const planet = kundali.planets.find(p => p.planet.name[locale] === s.planetName || p.planet.name.en === s.planetName);
      if (planet) strengthMap.set(planet.planet.id, s.strength);
    });
    const planetInputs = kundali.planets.map(p => ({
      id: p.planet.id,
      name: p.planet.name.en,
      house: p.house,
      isDebilitated: p.isDebilitated,
      isCombust: p.isCombust,
      isRetrograde: p.isRetrograde,
      shadbalaPercent: strengthMap.get(p.planet.id),
    }));
    return detectAfflictedPlanets(planetInputs);
  }, [kundali.planets, tip.strengthOverview, locale]);

  const severityColors: Record<string, string> = {
    severe: 'bg-red-500/20 text-red-400',
    moderate: 'bg-orange-500/20 text-orange-400',
    mild: 'bg-yellow-500/20 text-yellow-400',
    none: 'bg-green-500/20 text-green-400',
  };

  // Convergence synthesis — only available from server-side API response
  const convergence = (ragTip || tip)?.convergence || null;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>{tTip('title')}</h2>

      {/* ===== CONVERGENCE SYNTHESIS (hero card) ===== */}
      {convergence && (
        <ConvergenceSummary convergence={convergence} locale={locale} headingFont={headingFont} />
      )}

      {/* ===== AI READING (premium, below convergence) ===== */}
      <AIReadingButton kundali={kundali} locale={locale} headingFont={headingFont} />

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
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
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
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
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
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('yogas')}</h3>
        <div className="space-y-3">
          {tip.yogas.filter(y => y.present).map((yoga, i) => {
            const isInauspicious = yoga.type === 'Arishta' || yoga.type === 'Dosha';
            const borderColor = isInauspicious ? 'border-rose-500/20 bg-rose-500/5 hover:border-rose-500/30' : 'border-green-500/20 bg-green-500/5 hover:border-green-500/30';
            const badgeColor = isInauspicious ? 'bg-rose-500/20 text-rose-400' : 'bg-green-500/20 text-green-400';
            const strengthColor = yoga.strength === 'Strong' ? badgeColor : 'bg-yellow-500/20 text-yellow-400';
            return (
            <div key={i}>
              <motion.div
                onClick={() => setExpandedYoga(expandedYoga === i ? null : i)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${borderColor}`}
                whileHover={{ scale: 1.005 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gold-light font-semibold">{yoga.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${strengthColor}`}>{yoga.strength}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>
                      {isInauspicious ? (locale === 'en' ? 'Inauspicious' : 'अशुभ') : (locale === 'en' ? 'Auspicious' : 'शुभ')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-gold-primary/15 text-gold-primary/70`}>{yoga.type}</span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm">{yoga.description}</p>
              </motion.div>
              <AnimatePresence>
                {expandedYoga === i && yoga.implications && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="ml-4 mt-1 space-y-2">
                      <div className={`p-3 rounded-lg border ${isInauspicious ? 'bg-rose-500/5 border-rose-500/10' : 'bg-green-500/5 border-green-500/10'}`}>
                        <p className={`text-xs uppercase tracking-wider mb-1 ${isInauspicious ? 'text-rose-400' : 'text-green-400'}`}>{locale === 'en' ? 'What This Means For You' : 'आपके लिए इसका अर्थ'}</p>
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
          );})}
        </div>
      </section>

      {/* ===== DOSHAS ===== */}
      {/* Ganda Mula Banner — prominent alert if detected */}
      {tip.doshas.some(d => d.name.includes('Ganda Mula') && d.present) && (
        <div className="rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-red-500/5 to-amber-500/10 p-5 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-amber-400 text-lg font-bold">!</span>
            </div>
            <div>
              <h4 className="text-amber-300 font-bold text-base mb-1">
                {locale === 'en' ? 'Ganda Mula Nakshatra Detected' : 'गण्ड मूल नक्षत्र पाया गया'}
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                {locale === 'en'
                  ? 'The Moon at birth is in a Ganda Mula nakshatra — one of 6 nakshatras at the water-fire sign junctions. This requires a Ganda Mula Shanti Puja. See the dosha details below for specific remedies.'
                  : 'जन्म के समय चन्द्रमा गण्ड मूल नक्षत्र में है — जल-अग्नि राशि सन्धि के 6 नक्षत्रों में से एक। गण्ड मूल शान्ति पूजा आवश्यक है। विशिष्ट उपायों के लिए नीचे दोष विवरण देखें।'}
              </p>
              <Link href="/learn/modules/24-1" className="inline-block mt-2 text-xs text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2" tabIndex={-1}>
                {locale === 'en' ? 'Learn about Ganda Mula Nakshatras →' : 'गण्ड मूल नक्षत्रों के बारे में जानें →'}
              </Link>
            </div>
          </div>
        </div>
      )}
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('doshas')}</h3>
        <div className="space-y-4">
          {tip.doshas.filter(d => d.present).map((dosha, i) => {
            const effectiveColor = dosha.effectiveSeverity === 'cancelled' ? 'border-green-500/20 bg-green-500/5' : dosha.effectiveSeverity === 'partial' ? 'border-yellow-500/20 bg-yellow-500/5' : dosha.present ? 'border-red-500/20 bg-red-500/5' : 'border-green-500/10 bg-bg-primary/30';
            return (
            <div key={i} className={`p-4 rounded-lg border ${effectiveColor}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gold-light font-semibold">{dosha.name}</span>
                <div className="flex items-center gap-2">
                  {dosha.present && <span className={`text-xs px-2 py-0.5 rounded-full ${severityColors[dosha.severity]}`}>{dosha.severity}</span>}
                  {dosha.effectiveSeverity && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${dosha.effectiveSeverity === 'cancelled' ? 'bg-green-500/20 text-green-400' : dosha.effectiveSeverity === 'partial' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {dosha.effectiveSeverity === 'cancelled' ? (locale === 'en' ? 'Cancelled' : 'निरस्त') : dosha.effectiveSeverity === 'partial' ? (locale === 'en' ? 'Partial' : 'आंशिक') : (locale === 'en' ? 'Full' : 'पूर्ण')}
                    </span>
                  )}
                  {!dosha.effectiveSeverity && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${dosha.present ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {dosha.present ? tTip('present') : tTip('absent')}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{dosha.description}</p>
              {dosha.activeDasha && (
                <p className="text-purple-400 text-xs mt-2">{dosha.activeDasha}</p>
              )}
              {dosha.present && dosha.cancellationConditions && dosha.cancellationConditions.length > 0 && (
                <div className="mt-3 p-3 bg-bg-primary/40 rounded-lg border border-gold-primary/10">
                  <p className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' ? 'Cancellation Conditions (BPHS)' : 'निरसन शर्तें (बृहत्पाराशरहोराशास्त्र)'}</p>
                  <div className="space-y-1.5">
                    {dosha.cancellationConditions.map((cc, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm">
                        <span className={`mt-0.5 w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full text-xs ${cc.met ? 'bg-green-500/20 text-green-400' : 'bg-red-500/10 text-red-400/60'}`}>
                          {cc.met ? '✓' : '✗'}
                        </span>
                        <span className={`${cc.met ? 'text-green-400' : 'text-text-tertiary'}`}>{cc.condition}</span>
                        {cc.source && <span className="text-text-tertiary/50 text-xs ml-auto flex-shrink-0">{cc.source}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            );
          })}
        </div>
      </section>

      {/* ===== LIFE AREA PROGNOSIS ===== */}
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
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

      {/* ===== DASHA SYNTHESIS (new) ===== */}
      {tip.dashaSynthesis?.currentMaha && (() => {
        const ds = tip.dashaSynthesis!;
        const cm = ds.currentMaha!;
        const NAME_TO_ID: Record<string, number> = { Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8 };
        const ASSESSMENT_COLORS: Record<PeriodAssessment, { bg: string; border: string; text: string; bar: string }> = {
          very_favorable: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/25', text: 'text-emerald-400', bar: 'bg-emerald-500' },
          favorable: { bg: 'bg-green-500/15', border: 'border-green-500/25', text: 'text-green-400', bar: 'bg-green-500' },
          mixed: { bg: 'bg-amber-500/15', border: 'border-amber-500/25', text: 'text-amber-400', bar: 'bg-amber-500' },
          challenging: { bg: 'bg-orange-500/15', border: 'border-orange-500/25', text: 'text-orange-400', bar: 'bg-orange-500' },
          difficult: { bg: 'bg-rose-500/15', border: 'border-rose-500/25', text: 'text-rose-400', bar: 'bg-rose-500' },
        };
        const ASSESSMENT_LABELS: Record<PeriodAssessment, { en: string; hi: string }> = {
          very_favorable: { en: 'Very Favorable', hi: 'अत्यन्त शुभ' },
          favorable: { en: 'Favorable', hi: 'शुभ' },
          mixed: { en: 'Mixed', hi: 'मिश्रित' },
          challenging: { en: 'Challenging', hi: 'चुनौतीपूर्ण' },
          difficult: { en: 'Difficult', hi: 'कठिन' },
        };
        const lifeAreaArrow = (text: string): string => {
          if (/favorable|strong|excellent|growth|success|gains|flourish|prosper|expand/i.test(text)) return '\u2191';
          if (/challenge|difficult|obstacle|strain|loss|conflict|stress|caution|decline/i.test(text)) return '\u2193';
          return '\u2192';
        };
        const lifeAreaColor = (arrow: string) => arrow === '\u2191' ? 'text-emerald-400' : arrow === '\u2193' ? 'text-rose-400' : 'text-amber-400';
        const fmtYear = (d: string) => d.slice(0, 4);
        const fmtDate = (d: string) => { const p = d.split('-'); return `${p[2]}/${p[1]}/${p[0].slice(2)}`; };
        const loc = locale === 'sa' ? 'hi' : locale;

        return (
          <section className="space-y-6">
            {/* ── Section 1: Lifetime Timeline ── */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
              <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>
                {locale === 'en' ? 'Dasha Period Analysis' : locale === 'hi' ? 'दशा काल विश्लेषण' : 'दशाकालविश्लेषणम्'}
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gold-primary/30">
                {ds.lifetimeSummary.map((md, i) => {
                  const pid = NAME_TO_ID[md.planet] ?? 0;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedMahaTimeline(selectedMahaTimeline === i ? null : i)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all duration-200 ${
                        md.isCurrent
                          ? 'bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border-gold-primary/50 scale-105 shadow-lg shadow-gold-primary/10'
                          : md.isPast
                            ? 'bg-bg-primary/20 border-gold-primary/10 opacity-40'
                            : 'bg-bg-primary/30 border-gold-primary/15 hover:border-gold-primary/30'
                      } ${selectedMahaTimeline === i ? 'ring-1 ring-gold-primary/40' : ''}`}
                    >
                      <GrahaIconById id={pid} size={16} />
                      <span className={`text-xs font-medium whitespace-nowrap ${md.isCurrent ? 'text-gold-light' : 'text-text-secondary'}`}
                        style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {md.planetName[locale]}
                      </span>
                      <span className="text-xs text-text-secondary/60 whitespace-nowrap">
                        {fmtYear(md.startDate)}-{fmtYear(md.endDate).slice(2)}
                      </span>
                      {md.isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                {selectedMahaTimeline !== null && ds.lifetimeSummary[selectedMahaTimeline] && (
                  <motion.div
                    key={selectedMahaTimeline}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 rounded-lg bg-bg-primary/30 border border-gold-primary/10 overflow-hidden"
                  >
                    <p className="text-text-secondary text-sm leading-relaxed">{ds.lifetimeSummary[selectedMahaTimeline].theme}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Section 2: Current Mahadasha Card ── */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <GrahaIconById id={NAME_TO_ID[cm.planet] ?? 0} size={40} />
                <div>
                  <h3 className="text-xl text-gold-light font-bold" style={headingFont}>
                    {cm.planetName[locale]} {locale === 'en' ? 'Mahadasha' : 'महादशा'}
                  </h3>
                  <p className="text-text-secondary text-sm">{fmtDate(cm.startDate)} — {fmtDate(cm.endDate)} ({cm.years} {locale === 'en' ? 'years' : 'वर्ष'})</p>
                </div>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-6 whitespace-pre-line">{cm.overview}</p>

              {/* Activated Yogas */}
              {cm.yogasActivated.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' ? 'Activated Yogas' : 'सक्रिय योग'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {cm.yogasActivated.map((y, i) => {
                      const isAuspicious = /raja|dhana|mahapurusha|pancha|lakshmi|saraswati|budhaditya|gajakesari/i.test(y.type);
                      return (
                        <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          isAuspicious ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`} title={y.effect}>
                          {y.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Activated Doshas */}
              {cm.doshasActivated.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' ? 'Activated Doshas' : 'सक्रिय दोष'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {cm.doshasActivated.map((d, i) => (
                      <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        d.severity === 'high' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`} title={d.effect}>
                        {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Divisional Insights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['D1', 'D9', 'D10', 'D2'] as const).map((key) => (
                  <div key={key} className="p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10">
                    <span className="text-gold-primary text-xs font-bold">{key}</span>
                    <p className="text-text-secondary text-xs mt-1 leading-relaxed">{cm.divisionalInsights[key]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section 3: Antardasha Stack ── */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
              <h3 className="text-lg text-gold-light font-semibold mb-5" style={headingFont}>
                {locale === 'en' ? 'Antardasha Periods' : locale === 'hi' ? 'अन्तर्दशा काल' : 'अन्तर्दशाकालाः'}
              </h3>
              <div className="space-y-3 max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-gold-primary/20 pr-1">
                {cm.antardashas.map((ad, ai) => {
                  const aColors = ASSESSMENT_COLORS[ad.netAssessment];
                  const aLabel = ASSESSMENT_LABELS[ad.netAssessment];
                  const isExpanded = expandedAntar === ai;
                  const adPlanetId = NAME_TO_ID[ad.planet] ?? 0;
                  const lifeKeys = ['career', 'relationships', 'health', 'finance', 'spirituality'] as const;
                  const LIFE_ICONS: Record<string, string> = { career: '\u{1F4BC}', relationships: '\u2764', health: '\u2695', finance: '\u{1F4B0}', spirituality: '\u2728' };
                  const LIFE_LABELS: Record<string, { en: string; hi: string }> = {
                    career: { en: 'Career', hi: 'करियर' },
                    relationships: { en: 'Relations', hi: 'सम्बन्ध' },
                    health: { en: 'Health', hi: 'स्वास्थ्य' },
                    finance: { en: 'Finance', hi: 'वित्त' },
                    spirituality: { en: 'Spirit', hi: 'आध्यात्म' },
                  };

                  return (
                    <div key={ai} className={`rounded-xl border transition-all duration-200 ${
                      ad.isCurrent ? 'border-gold-primary/40 shadow-lg shadow-gold-primary/5' : 'border-gold-primary/10'
                    } ${aColors.bg}`}>
                      {/* Collapsed Header */}
                      <button
                        onClick={() => { setExpandedAntar(isExpanded ? null : ai); setExpandedPratyantar(null); }}
                        className="w-full p-4 text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <GrahaIconById id={adPlanetId} size={28} />
                            <div>
                              <span className="text-gold-light font-semibold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                                {ad.planetName[locale]}
                              </span>
                              {ad.isCurrent && <span className="ml-2 w-1.5 h-1.5 inline-block rounded-full bg-gold-primary animate-pulse" />}
                              <p className="text-text-secondary/60 text-xs">
                                {fmtDate(ad.startDate)} — {fmtDate(ad.endDate)} ({ad.durationMonths} {locale === 'en' ? 'mo' : 'मा'})
                              </p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${aColors.bg} ${aColors.border} ${aColors.text}`}>
                            {aLabel[loc as 'en' | 'hi']}
                          </span>
                        </div>
                        {/* Life area arrows */}
                        <div className="flex gap-3 mt-1">
                          {lifeKeys.map(k => {
                            const arrow = lifeAreaArrow(ad.lifeAreas[k]);
                            return (
                              <span key={k} className="flex items-center gap-0.5 text-xs">
                                <span className="text-text-secondary/50">{LIFE_LABELS[k][loc as 'en' | 'hi']}</span>
                                <span className={`font-bold ${lifeAreaColor(arrow)}`}>{arrow}</span>
                              </span>
                            );
                          })}
                        </div>
                        <p className="text-text-secondary text-xs mt-2 line-clamp-1">{ad.summary}</p>
                      </button>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-4 border-t border-gold-primary/10 pt-4">
                              {/* Lord Analysis */}
                              <div>
                                <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Lord Analysis' : 'स्वामी विश्लेषण'}</h5>
                                <p className="text-text-secondary text-sm leading-relaxed">{ad.lordAnalysis}</p>
                              </div>

                              {/* Interaction */}
                              <div>
                                <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Interaction' : 'परस्पर सम्बन्ध'}</h5>
                                <p className="text-text-secondary text-sm leading-relaxed">{ad.interaction}</p>
                              </div>

                              {/* Yogas & Doshas */}
                              {ad.yogasTriggered.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Yogas Triggered' : 'योग सक्रिय'}</h5>
                                  <p className="text-emerald-400/80 text-xs">{ad.yogasTriggered.join(', ')}</p>
                                </div>
                              )}
                              {ad.doshasTriggered.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Doshas Triggered' : 'दोष सक्रिय'}</h5>
                                  <p className="text-rose-400/80 text-xs">{ad.doshasTriggered.join(', ')}</p>
                                </div>
                              )}

                              {/* Houses Activated */}
                              {ad.housesActivated.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Houses Activated' : 'भाव सक्रिय'}</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {ad.housesActivated.map((h, hi) => (
                                      <span key={hi} className="px-2 py-0.5 rounded bg-bg-primary/40 border border-gold-primary/10 text-xs text-text-secondary">
                                        <span className="text-gold-light font-medium">H{h.house}</span> {h.theme}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Transit Context */}
                              {ad.transitContext && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Transit Context' : 'गोचर सन्दर्भ'}</h5>
                                  <p className="text-text-secondary text-sm">{ad.transitContext}</p>
                                </div>
                              )}

                              {/* Life Areas */}
                              <div>
                                <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' ? 'Life Areas' : 'जीवन क्षेत्र'}</h5>
                                <div className="space-y-2">
                                  {lifeKeys.map(k => {
                                    const arrow = lifeAreaArrow(ad.lifeAreas[k]);
                                    return (
                                      <div key={k} className="flex items-start gap-2">
                                        <span className={`font-bold mt-0.5 ${lifeAreaColor(arrow)}`}>{arrow}</span>
                                        <div>
                                          <span className="text-gold-light text-xs font-medium">{LIFE_LABELS[k][loc as 'en' | 'hi']}</span>
                                          <p className="text-text-secondary text-xs leading-relaxed">{ad.lifeAreas[k]}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Divisional Insights */}
                              <div>
                                <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' ? 'Divisional Insights' : 'वर्ग दृष्टि'}</h5>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {(['D1', 'D9', 'D10', 'D2'] as const).map(dk => (
                                    <div key={dk} className="p-2 rounded bg-bg-primary/40 border border-gold-primary/10">
                                      <span className="text-gold-primary text-xs font-bold">{dk}</span>
                                      <p className="text-text-secondary text-xs mt-0.5">{ad.divisionalInsights[dk]}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Advice */}
                              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                                <h5 className="text-amber-400 text-xs font-semibold mb-1">{locale === 'en' ? 'Advice' : 'सलाह'}</h5>
                                <p className="text-text-secondary text-sm leading-relaxed">{ad.advice}</p>
                              </div>

                              {/* Key Dates */}
                              {ad.keyDates.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' ? 'Key Dates' : 'महत्त्वपूर्ण तिथियाँ'}</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {ad.keyDates.map((kd, ki) => (
                                      <span key={ki} className="px-2 py-0.5 rounded bg-bg-primary/40 border border-gold-primary/10 text-xs text-text-secondary font-mono">{kd}</span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Section 4: Pratyantardasha Blocks */}
                              {ad.pratyantardashas.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' ? 'Pratyantardasha Periods' : 'प्रत्यन्तर्दशा'}</h5>
                                  <div className="flex flex-wrap gap-1.5">
                                    {ad.pratyantardashas.map((pd, pi) => {
                                      const pColors = ASSESSMENT_COLORS[pd.netAssessment];
                                      const ppid = NAME_TO_ID[pd.planet] ?? 0;
                                      const abbr = GRAHA_ABBREVIATIONS[ppid] || pd.planet.slice(0, 2);
                                      const pratyKey = `${ai}-${pi}`;
                                      const isPratyExpanded = expandedPratyantar === pratyKey;

                                      return (
                                        <div key={pi} className="flex flex-col items-center">
                                          <button
                                            onClick={(e) => { e.stopPropagation(); setExpandedPratyantar(isPratyExpanded ? null : pratyKey); }}
                                            className={`relative w-10 h-10 rounded-lg flex items-center justify-center border text-xs font-bold transition-all ${pColors.bg} ${pColors.border} ${pColors.text} hover:scale-110`}
                                            title={`${pd.planetName[locale]} | ${fmtDate(pd.startDate)}-${fmtDate(pd.endDate)} | ${pd.keyTheme}`}
                                          >
                                            {abbr}
                                            {pd.isCritical && (
                                              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold-primary" />
                                            )}
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {/* Expanded pratyantardasha detail */}
                                  <AnimatePresence>
                                    {expandedPratyantar?.startsWith(`${ai}-`) && (() => {
                                      const pIdx = parseInt(expandedPratyantar.split('-')[1]);
                                      const pd = ad.pratyantardashas[pIdx];
                                      if (!pd) return null;
                                      const pColors = ASSESSMENT_COLORS[pd.netAssessment];
                                      const pLabel = ASSESSMENT_LABELS[pd.netAssessment];
                                      return (
                                        <motion.div
                                          key={expandedPratyantar}
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden"
                                        >
                                          <div className={`mt-3 p-3 rounded-lg border ${pColors.bg} ${pColors.border}`}>
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <GrahaIconById id={NAME_TO_ID[pd.planet] ?? 0} size={20} />
                                                <span className="text-gold-light text-sm font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                                                  {pd.planetName[locale]}
                                                </span>
                                                <span className="text-text-secondary/50 text-xs">{fmtDate(pd.startDate)} — {fmtDate(pd.endDate)} ({pd.durationDays}d)</span>
                                              </div>
                                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pColors.text}`}>{pLabel[loc as 'en' | 'hi']}</span>
                                            </div>
                                            <p className="text-text-secondary text-xs mb-1"><span className="text-gold-primary font-medium">{locale === 'en' ? 'Theme' : 'विषय'}:</span> {pd.keyTheme}</p>
                                            <p className="text-text-secondary text-xs"><span className="text-gold-primary font-medium">{locale === 'en' ? 'Advice' : 'सलाह'}:</span> {pd.advice}</p>
                                            {pd.expanded && (
                                              <div className="mt-2 pt-2 border-t border-gold-primary/10 space-y-1">
                                                <p className="text-text-secondary text-xs">{pd.expanded.lordAnalysis}</p>
                                                <div className="flex gap-2">
                                                  <span className="text-xs text-text-secondary/60"><span className="text-gold-primary">D1:</span> {pd.expanded.divisionalInsights.D1}</span>
                                                  {pd.expanded.divisionalInsights.D9 && <span className="text-xs text-text-secondary/60"><span className="text-gold-primary">D9:</span> {pd.expanded.divisionalInsights.D9}</span>}
                                                  {pd.expanded.divisionalInsights.D10 && <span className="text-xs text-text-secondary/60"><span className="text-gold-primary">D10:</span> {pd.expanded.divisionalInsights.D10}</span>}
                                                </div>
                                                {pd.expanded.warning && (
                                                  <p className="text-rose-400 text-xs mt-1 p-2 rounded bg-rose-500/5 border border-rose-500/10">{pd.expanded.warning}</p>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </motion.div>
                                      );
                                    })()}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ===== DASHA INSIGHT (fallback when synthesis unavailable) ===== */}
      {!tip.dashaSynthesis && tip.dashaInsight.currentMaha && (
        <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
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
        <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
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
        <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
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

      {/* ===== GRAHA SHANTI PUJA RECOMMENDATIONS ===== */}
      {afflictedPlanets.length > 0 && (
        <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
          <h3 className="text-xl text-gold-light font-semibold mb-2" style={headingFont}>
            {locale === 'en' ? 'Recommended Graha Shanti Pujas' : locale === 'hi' ? 'अनुशंसित ग्रह शान्ति पूजा' : 'अनुशंसित ग्रहशान्तिपूजाः'}
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            {locale === 'en'
              ? 'Based on your chart analysis, the following planets are afflicted and may benefit from graha shanti rituals.'
              : 'आपकी कुण्डली विश्लेषण के अनुसार, निम्नलिखित ग्रह पीड़ित हैं और ग्रह शान्ति पूजा से लाभ हो सकता है।'}
          </p>
          <div className="space-y-4">
            {afflictedPlanets.map((ap) => {
              const severityConfig = {
                severe: { border: 'border-rose-500/20', bg: 'bg-rose-500/8', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-400', label: locale === 'en' ? 'Severe' : 'गम्भीर' },
                moderate: { border: 'border-amber-500/20', bg: 'bg-amber-500/8', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400', label: locale === 'en' ? 'Moderate' : 'मध्यम' },
                mild: { border: 'border-blue-500/20', bg: 'bg-blue-500/8', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-400', label: locale === 'en' ? 'Mild' : 'साधारण' },
              }[ap.severity];
              const planetData = kundali.planets.find(p => p.planet.id === ap.planetId);
              const planetName = planetData?.planet.name[locale] || ap.planetName;
              return (
                <div key={ap.planetId} className={`p-4 rounded-xl border ${severityConfig.border} ${severityConfig.bg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <GrahaIconById id={ap.planetId} size={32} />
                      <span className={`text-lg font-bold ${severityConfig.text}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' }}>
                        {planetName}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${severityConfig.badge}`}>
                      {severityConfig.label}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">{ap.reasons.join(', ')}</p>
                  <a
                    href={`/${locale}/puja/${ap.remedySlug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gold-primary hover:text-gold-light transition-colors"
                  >
                    {locale === 'en'
                      ? `${planetName} Graha Shanti Puja`
                      : `${planetName} ग्रह शान्ति पूजा`}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// ===== GRAHA TAB COMPONENT =====
function GrahaTab({ grahaDetails, upagrahas, locale, isDevanagari, headingFont, planetInsights }: {
  grahaDetails: GrahaDetail[];
  upagrahas: UpagrahaPosition[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
  planetInsights?: PlanetInsight[];
}) {
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' ? 'Graha Details' : 'ग्रह विवरण'}
      </h3>

      {/* Graha Table */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 overflow-x-auto">
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

      {/* Planetary Interpretations */}
      {planetInsights && planetInsights.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
            {locale === 'en' ? 'Planetary Interpretations' : 'ग्रह व्याख्या'}
          </h4>
          <div className="space-y-3">
            {grahaDetails.map((g) => {
              const insight = planetInsights.find(pi => pi.planetId === g.planetId);
              if (!insight) return null;
              return (
                <div key={g.planetId} className="p-4 rounded-lg border border-gold-primary/10 bg-gold-primary/[0.02]">
                  <div className="flex items-center gap-2 mb-2">
                    <GrahaIconById id={g.planetId} size={24} />
                    <span className="text-gold-light font-semibold" style={bodyFont}>{g.planetName[locale]}</span>
                    <span className="text-text-secondary/50 text-xs">{locale === 'en' ? 'in' : 'में'} {g.signName[locale]} — {locale === 'en' ? 'House' : 'भाव'} {insight.house}</span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{insight.description}</p>
                  {insight.implications && (
                    <p className="text-text-secondary/70 text-sm mt-2 italic">{insight.implications}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upagrahas */}
      {upagrahas.length > 0 && (() => {
        const UPAGRAHA_NOTES: Record<string, { en: string; hi: string }> = {
          'Dhuma': { en: 'Smoke of the Sun — indicates obstacles and hidden enemies when afflicted', hi: 'सूर्य का धूम — पीड़ित होने पर बाधाएँ और छिपे शत्रु' },
          'Vyatipata': { en: 'Calamity point — sensitive degree that can trigger sudden events', hi: 'आपत्ति बिन्दु — अचानक घटनाओं को उत्प्रेरित करने वाला संवेदनशील अंश' },
          'Parivesha': { en: 'Halo of the Moon — spiritual awareness and intuitive perception', hi: 'चन्द्र का परिवेश — आध्यात्मिक जागरूकता और अन्तर्ज्ञान' },
          'Indrachapa': { en: 'Indra\'s bow — rainbow point indicating divine grace and protection', hi: 'इन्द्रचाप — दिव्य कृपा और सुरक्षा का सूचक इन्द्रधनुष बिन्दु' },
          'Upaketu': { en: 'Sub-Ketu — deepens Ketu\'s spiritual and detachment effects', hi: 'उपकेतु — केतु के आध्यात्मिक और वैराग्य प्रभावों को गहन करता है' },
          'Kala': { en: 'Time — indicates karmic timing and fateful periods in life', hi: 'काल — कार्मिक समय और जीवन के भाग्यपूर्ण काल का सूचक' },
          'Mrityu': { en: 'Death point — sensitive degree related to health vulnerabilities', hi: 'मृत्यु बिन्दु — स्वास्थ्य कमजोरियों से सम्बन्धित संवेदनशील अंश' },
          'Ardhaprahara': { en: 'Half-watch — indicates midpoint energy and balance in the chart', hi: 'अर्धप्रहर — कुण्डली में मध्यबिन्दु ऊर्जा और सन्तुलन का सूचक' },
          'Gulika': { en: 'Son of Saturn — malefic point indicating chronic issues and karmic debts', hi: 'शनि पुत्र — दीर्घकालिक समस्याओं और कार्मिक ऋणों का अशुभ बिन्दु' },
          'Mandi': { en: 'Son of Saturn — similar to Gulika, indicates delays and karmic blocks', hi: 'शनि पुत्र — गुलिक के समान, विलम्ब और कार्मिक अवरोधों का सूचक' },
        };
        return (
          <div>
            <h3 className="text-xl font-bold text-gold-gradient text-center mb-4" style={headingFont}>
              {locale === 'en' ? 'Upagraha Positions' : 'उपग्रह स्थिति'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {upagrahas.map((u, i) => (
                <div key={i} className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 text-center">
                  <p className="text-gold-light font-bold text-sm mb-1" style={bodyFont}>{u.name[locale]}</p>
                  <RashiIconById id={u.sign} size={28} />
                  <p className="text-text-primary text-sm mt-1" style={bodyFont}>{u.signName[locale]} {u.degree}</p>
                  <p className="text-text-secondary/60 text-xs mt-0.5" style={bodyFont}>{u.nakshatra[locale]}</p>
                  <p className="text-text-secondary/50 text-xs mt-1 leading-relaxed">{UPAGRAHA_NOTES[u.name.en]?.[locale === 'en' ? 'en' : 'hi'] || ''}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
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

  // Deduplicate yogas by ID — keep the one that's present, or first occurrence
  const deduped = useMemo(() => {
    const seen = new Map<string, YogaComplete>();
    for (const y of yogas) {
      const existing = seen.get(y.id);
      if (!existing || (y.present && !existing.present)) {
        seen.set(y.id, y);
      }
    }
    return [...seen.values()];
  }, [yogas]);

  const filtered = deduped.filter(y => {
    if (filter === 'present') return y.present;
    if (filter === 'auspicious') return y.isAuspicious;
    if (filter === 'inauspicious') return !y.isAuspicious;
    return true;
  });

  const presentCount = deduped.filter(y => y.present).length;
  const auspiciousPresent = deduped.filter(y => y.present && y.isAuspicious).length;
  const inauspiciousPresent = deduped.filter(y => y.present && !y.isAuspicious).length;

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

      <InfoBlock
        id="kundali-yogas"
        title={locale === 'hi' ? 'योग क्या हैं?' : 'What are Yogas?'}
        defaultOpen={false}
      >
        {locale === 'hi'
          ? 'वैदिक ज्योतिष में "योग" एक विशिष्ट ग्रह संयोजन है जो एक निश्चित परिणाम उत्पन्न करता है — जैसे एक ब्रह्मांडीय नुस्खा। राजयोग शक्ति और अधिकार लाते हैं, धनयोग धन लाते हैं, महापुरुष योग असाधारण व्यक्तित्व बनाते हैं (केवल 5 होते हैं), और अशुभ योग चुनौतियाँ लाते हैं जो चरित्र निर्माण करती हैं। "उपस्थित" का अर्थ है कि यह संयोजन आपकी कुण्डली में विद्यमान है। "शक्ति" दिखाती है कि यह कितनी प्रभावशाली ढंग से काम करता है। हरा = शुभ, लाल = चुनौतीपूर्ण किंतु प्रायः परिवर्तनकारी।'
          : 'In Vedic astrology, a \'Yoga\' is a specific planetary combination that produces a defined result — like a cosmic recipe. Raja Yogas bring power and authority, Dhana Yogas bring wealth, Mahapurusha Yogas create exceptional personalities (only 5 exist), and Inauspicious Yogas bring challenges that build character. \'Present\' means the combination exists in your chart. \'Strength\' shows how powerfully it operates. Green = auspicious, Red = challenging but often transformative.'}
      </InfoBlock>

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
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                          y.strength === 'Strong' ? 'bg-green-500/20 text-green-400' :
                          y.strength === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {y.strength}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                        y.isAuspicious ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {y.isAuspicious ? (locale === 'en' ? 'Auspicious' : 'शुभ') : (locale === 'en' ? 'Inauspicious' : 'अशुभ')}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${y.present ? 'bg-gold-primary/20 text-gold-light' : 'bg-bg-primary/50 text-text-secondary/50'}`}>
                        {y.present ? (locale === 'en' ? 'Present' : 'है') : (locale === 'en' ? 'Absent' : 'नहीं')}
                      </span>
                    </div>
                  </div>
                  {expandedYoga === y.id && (
                    <div className="mt-2 pt-2 border-t border-gold-primary/10 space-y-1">
                      <p className="text-text-secondary text-xs" style={bodyFont}>{y.description[locale]}</p>
                      <p className="text-gold-dark text-xs italic" style={bodyFont}>
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

      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 overflow-x-auto">
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

      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 overflow-x-auto">
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
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
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
                <div className="w-20 text-right text-xs text-text-secondary truncate" style={bodyFont}>{houseName[locale === 'sa' ? 'hi' : locale]}</div>
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

// ─── Sade Sati Helpers ──────────────────────────────────────────────────────

function intensityColor(v: number): string {
  if (v < 3) return 'text-green-400';
  if (v < 5) return 'text-gold-light';
  if (v < 7) return 'text-orange-400';
  return 'text-red-400';
}

function intensityLabel(v: number): { en: string; hi: string } {
  if (v < 3) return { en: 'Mild', hi: 'हल्का' };
  if (v < 5) return { en: 'Moderate', hi: 'मध्यम' };
  if (v < 7) return { en: 'Challenging', hi: 'चुनौतीपूर्ण' };
  return { en: 'Intense', hi: 'तीव्र' };
}

function intensityStrokeColor(v: number): string {
  if (v < 3) return '#4ade80';
  if (v < 5) return '#d4a853';
  if (v < 7) return '#fb923c';
  return '#f87171';
}

const SECTION_LABELS: Record<string, { en: string; hi: string }> = {
  summary: { en: 'Summary', hi: 'सारांश' },
  phaseEffect: { en: 'Phase Effect', hi: 'चरण प्रभाव' },
  saturnNature: { en: "Saturn's Nature for Your Ascendant", hi: 'आपके लग्न के लिए शनि का स्वभाव' },
  moonStrength: { en: 'Moon Strength', hi: 'चन्द्र बल' },
  dashaInterplay: { en: 'Dasha Interplay', hi: 'दशा अन्तर्क्रिया' },
  ashtakavargaInsight: { en: 'Ashtakavarga Insight', hi: 'अष्टकवर्ग अंतर्दृष्टि' },
  nakshatraTransit: { en: 'Nakshatra Transit', hi: 'नक्षत्र गोचर' },
  houseEffect: { en: 'House Effects', hi: 'भाव प्रभाव' },
};

const PHASE_LABELS: Record<string, { en: string; hi: string }> = {
  rising: { en: 'Rising (12th House Transit)', hi: 'उदय (द्वादश भाव गोचर)' },
  peak: { en: 'Peak (1st House Transit)', hi: 'शिखर (प्रथम भाव गोचर)' },
  setting: { en: 'Setting (2nd House Transit)', hi: 'अस्त (द्वितीय भाव गोचर)' },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  essential: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  recommended: { bg: 'bg-gold-primary/10', text: 'text-gold-light', border: 'border-gold-primary/20' },
  optional: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
};

const PRIORITY_LABELS: Record<string, { en: string; hi: string }> = {
  essential: { en: 'Essential', hi: 'अनिवार्य' },
  recommended: { en: 'Recommended', hi: 'अनुशंसित' },
  optional: { en: 'Optional', hi: 'वैकल्पिक' },
};

function SadeSatiTab({ sadeSati, locale, isDevanagari, headingFont }: {
  sadeSati: SadeSatiAnalysis;
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const lk = locale === 'sa' ? 'hi' : locale;
  const [expandedSection, setExpandedSection] = useState<string>('summary');

  const interp = sadeSati.interpretation;
  const interpretationKeys = Object.keys(SECTION_LABELS).filter(k => {
    const val = interp[k as keyof typeof interp];
    return val && (val as { en: string; hi: string })[lk]?.trim();
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' ? 'Sade Sati Analysis' : 'साढ़े साती विश्लेषण'}
      </h3>

      {/* ── Status Banner ── */}
      {sadeSati.isActive ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 border border-red-500/30 bg-red-500/5"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/15 border-2 border-red-500/40 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="text-red-400 text-lg font-bold uppercase tracking-wider" style={headingFont}>
                {locale === 'en' ? 'Sade Sati Active' : 'साढ़े साती सक्रिय'}
              </div>
              <div className="text-text-secondary text-sm mt-1" style={bodyFont}>
                {sadeSati.cycleStart} &mdash; {sadeSati.cycleEnd}
                {sadeSati.currentPhase && (
                  <span className="ml-2 text-gold-light">
                    ({PHASE_LABELS[sadeSati.currentPhase]?.[lk] || sadeSati.currentPhase})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>{sadeSati.cycleStart}</span>
              <span className="text-gold-light font-bold">{Math.round(sadeSati.phaseProgress * 100)}%</span>
              <span>{sadeSati.cycleEnd}</span>
            </div>
            <div className="h-2.5 rounded-full bg-bg-primary/60 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sadeSati.phaseProgress * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' as const }}
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-gold-primary"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 border border-green-500/30 bg-green-500/5 text-center">
          <div className="text-green-400 text-lg font-bold uppercase tracking-wider" style={headingFont}>
            {locale === 'en' ? 'Not in Sade Sati' : 'साढ़े साती नहीं'}
          </div>
          {sadeSati.allCycles.length > 0 && (() => {
            const nextCycle = sadeSati.allCycles.find(c => !c.isActive && c.startYear > new Date().getFullYear());
            if (!nextCycle) return null;
            return (
              <div className="text-text-secondary text-sm mt-2" style={bodyFont}>
                {locale === 'en' ? `Next cycle: ${nextCycle.startYear} — ${nextCycle.endYear}` : `अगला चक्र: ${nextCycle.startYear} — ${nextCycle.endYear}`}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Intensity Gauge (only if active) ── */}
      {sadeSati.isActive && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6"
        >
          <h4 className="text-gold-primary text-xs uppercase tracking-wider font-bold text-center mb-6" style={bodyFont}>
            {locale === 'en' ? 'Intensity Gauge' : 'तीव्रता मापक'}
          </h4>

          <div className="flex flex-col items-center gap-6">
            {/* Circular SVG gauge */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* Background circle */}
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-bg-primary/60" strokeLinecap="round"
                  strokeDasharray="235.6 78.5" transform="rotate(135 60 60)" />
                {/* Value arc */}
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke={intensityStrokeColor(sadeSati.overallIntensity)}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(sadeSati.overallIntensity / 10) * 235.6} ${314.16 - (sadeSati.overallIntensity / 10) * 235.6}`}
                  transform="rotate(135 60 60)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold font-mono ${intensityColor(sadeSati.overallIntensity)}`}>
                  {sadeSati.overallIntensity.toFixed(1)}
                </span>
                <span className="text-text-secondary text-xs uppercase tracking-wider" style={bodyFont}>
                  {intensityLabel(sadeSati.overallIntensity)[lk]}
                </span>
              </div>
            </div>

            {/* Intensity factors as bars */}
            {sadeSati.intensityFactors.length > 0 && (
              <div className="w-full max-w-md space-y-2.5">
                {sadeSati.intensityFactors.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-28 text-right text-xs text-text-secondary truncate" style={bodyFont}>
                      {f.description[lk]}
                    </div>
                    <div className="flex-1 bg-bg-primary/60 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(f.score / 10) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.1 * i, ease: 'easeOut' as const }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: intensityStrokeColor(f.score) }}
                      />
                    </div>
                    <span className={`w-6 text-right text-xs font-mono font-bold ${intensityColor(f.score)}`}>
                      {f.score.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Interpretation Sections (expandable cards) ── */}
      {interpretationKeys.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-gold-primary text-xs uppercase tracking-wider font-bold text-center mb-2" style={bodyFont}>
            {locale === 'en' ? 'Detailed Interpretation' : 'विस्तृत व्याख्या'}
          </h4>
          {interpretationKeys.map((key) => {
            const label = SECTION_LABELS[key];
            const text = (interp[key as keyof typeof interp] as { en: string; hi: string })[lk];
            const isOpen = expandedSection === key;
            return (
              <motion.div
                key={key}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden"
                layout
              >
                <button
                  onClick={() => setExpandedSection(isOpen ? '' : key)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gold-primary/5 transition-colors"
                >
                  <span className="text-gold-light text-sm font-bold" style={headingFont}>
                    {label[lk]}
                  </span>
                  <svg className={`w-4 h-4 text-gold-dark/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                        {text}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Timeline ── */}
      {sadeSati.allCycles.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
          <h4 className="text-gold-primary text-xs uppercase tracking-wider font-bold text-center mb-5" style={bodyFont}>
            {locale === 'en' ? 'Sade Sati Timeline' : 'साढ़े साती समयरेखा'}
          </h4>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gold-primary/20" />
            <div className="space-y-4">
              {sadeSati.allCycles.map((cycle, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`flex items-start gap-4 pl-2 ${cycle.isActive ? '' : 'opacity-60'}`}
                >
                  <div className={`mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    cycle.isActive ? 'border-gold-primary bg-gold-primary/20' : 'border-gold-primary/30 bg-bg-primary/40'
                  }`}>
                    {cycle.isActive && <div className="w-2.5 h-2.5 rounded-full bg-gold-primary animate-pulse" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold font-mono text-sm ${cycle.isActive ? 'text-gold-light' : 'text-text-secondary'}`}>
                        {cycle.startYear} &mdash; {cycle.endYear}
                      </span>
                      {cycle.isActive && (
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-primary/15 text-gold-light border border-gold-primary/30">
                          {locale === 'en' ? 'Active' : 'सक्रिय'}
                        </span>
                      )}
                    </div>
                    {cycle.phases.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {cycle.phases.map((ph, j) => (
                          <span key={j} className={`text-xs px-2 py-0.5 rounded border ${
                            cycle.isActive && sadeSati.currentPhase === ph.phase
                              ? 'bg-gold-primary/15 text-gold-light border-gold-primary/30 font-bold'
                              : 'text-text-tertiary border-gold-primary/10'
                          }`}>
                            {ph.phase === 'rising' ? (locale === 'en' ? 'Rising' : 'उदय') :
                             ph.phase === 'peak' ? (locale === 'en' ? 'Peak' : 'शिखर') :
                             (locale === 'en' ? 'Setting' : 'अस���त')}
                            {' '}{ph.startYear}-{ph.endYear}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Nakshatra transit sub-items for active cycle */}
                    {cycle.isActive && sadeSati.nakshatraTimeline.length > 0 && (
                      <div className="mt-3 ml-1 space-y-1">
                        <div className="text-xs text-text-tertiary uppercase tracking-wider mb-1.5">
                          {locale === 'en' ? 'Nakshatra Transits' : 'नक्षत्र गोचर'}
                        </div>
                        {sadeSati.nakshatraTimeline.map((nt, k) => {
                          const nak = NAKSHATRAS[nt.nakshatra - 1];
                          const nakName = nak?.name?.[locale as 'en' | 'hi' | 'sa'] || nak?.name?.en || '';
                          const yearLabel = nt.firstYear === nt.lastYear ? String(nt.firstYear) : `${nt.firstYear}–${nt.lastYear}`;
                          return (
                            <div
                              key={k}
                              className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border ${
                                nt.isBirthNakshatra
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                                  : nt.isCurrent
                                    ? 'bg-gold-primary/10 border-gold-primary/25 text-gold-light'
                                    : 'border-transparent text-text-secondary'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                nt.isCurrent ? 'bg-gold-primary animate-pulse' : nt.isBirthNakshatra ? 'bg-amber-400' : 'bg-text-tertiary/40'
                              }`} />
                              <span className="flex-1">{nakName}</span>
                              <span className="font-mono text-xs opacity-70">{yearLabel}</span>
                              {nt.isBirthNakshatra && (
                                <span className="text-xs uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/25 text-amber-300">
                                  {locale === 'en' ? 'Birth' : 'जन्म'}
                                </span>
                              )}
                              {nt.isCurrent && !nt.isBirthNakshatra && (
                                <span className="text-xs uppercase tracking-wider px-1.5 py-0.5 rounded bg-gold-primary/15 border border-gold-primary/25 text-gold-light">
                                  {locale === 'en' ? 'Now' : 'अभी'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Remedies (only if active) ── */}
      {sadeSati.isActive && sadeSati.remedies.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
          <h4 className="text-gold-primary text-xs uppercase tracking-wider font-bold text-center mb-5" style={bodyFont}>
            {locale === 'en' ? 'Remedies' : 'उपाय'}
          </h4>
          {(['essential', 'recommended', 'optional'] as const).map(priority => {
            const items = sadeSati.remedies.filter(r => r.priority === priority);
            if (items.length === 0) return null;
            const pc = PRIORITY_COLORS[priority];
            return (
              <div key={priority} className="mb-5 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
                    {PRIORITY_LABELS[priority][lk]}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {items.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className={`rounded-xl p-4 border ${pc.border} ${pc.bg}`}
                    >
                      <div className={`font-bold text-sm mb-1 ${pc.text}`} style={headingFont}>
                        {r.title[lk]}
                      </div>
                      <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                        {r.description[lk]}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useAuthStore } from '@/stores/auth-store';
import { motion, AnimatePresence } from 'framer-motion';
import ChartNorth from '@/components/kundali/ChartNorth';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LocationSearch from '@/components/ui/LocationSearch';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { GRAHAS } from '@/lib/constants/grahas';
import type { Locale } from '@/types/panchang';
import type { KPChartData } from '@/types/kp';

const T = {
  en: {
    title: 'KP System', subtitle: 'Krishnamurti Paddhati — Sub-Lord Analysis',
    desc: 'Placidus house system with the 249 sub-lord table. Each degree has a Sign Lord, Star Lord, and Sub Lord for precise event prediction.',
    generate: 'Generate KP Chart', generating: 'Computing Sub-Lords...',
    name: 'Name', date: 'Birth Date', time: 'Birth Time', place: 'Place', lat: 'Latitude', lng: 'Longitude', tz: 'Timezone',
    cuspalTable: 'Cuspal Sub-Lord Table', planetTable: 'Planetary Sub-Lord Table',
    cuspalAnalysis: 'Cuspal Sub-Lord Signification (P2-05)',
    significators: 'Significator Table', rulingPlanets: 'Ruling Planets',
    cusp: 'Cusp', sign: 'Sign Lord', star: 'Star Lord', sub: 'Sub Lord', subsub: 'Sub-Sub Lord', degree: 'Degree',
    planet: 'Planet', house: 'House', h: 'House', l1: 'L1', l2: 'L2', l3: 'L3', l4: 'L4', combined: 'Combined',
    predictions: 'Quick Predictions', asc: 'Asc', moon: 'Moon', day: 'Day',
    marriage: 'Marriage (2/7/11)', career: 'Career (2/6/10)', wealth: 'Wealth (2/6/11)', health: 'Health (1/5/11)',
    signifies: 'Signifies', required: 'Required', materialises: 'Materialises', denied: 'Denied',
  },
  hi: {
    title: 'केपी पद्धति', subtitle: 'कृष्णमूर्ति पद्धति — उप-स्वामी विश्लेषण',
    desc: 'प्लेसिडस भाव पद्धति और 249 उप-स्वामी तालिका। प्रत्येक अंश का राशि स्वामी, नक्षत्र स्वामी और उप-स्वामी।',
    generate: 'केपी कुण्डली बनाएं', generating: 'उप-स्वामी गणना...',
    name: 'नाम', date: 'जन्म तिथि', time: 'जन्म समय', place: 'स्थान', lat: 'अक्षांश', lng: 'देशान्तर', tz: 'समयक्षेत्र',
    cuspalTable: 'कस्प उप-स्वामी तालिका', planetTable: 'ग्रह उप-स्वामी तालिका',
    cuspalAnalysis: 'कस्प उप-स्वामी सूचन विश्लेषण',
    significators: 'कारक तालिका', rulingPlanets: 'शासक ग्रह',
    cusp: 'कस्प', sign: 'राशि स्वामी', star: 'नक्षत्र स्वामी', sub: 'उप-स्वामी', subsub: 'उप-उप-स्वामी', degree: 'अंश',
    planet: 'ग्रह', house: 'भाव', h: 'भाव', l1: 'स्तर1', l2: 'स्तर2', l3: 'स्तर3', l4: 'स्तर4', combined: 'संयुक्त',
    predictions: 'त्वरित भविष्यवाणी', asc: 'लग्न', moon: 'चन्द्र', day: 'वार',
    marriage: 'विवाह (2/7/11)', career: 'करियर (2/6/10)', wealth: 'धन (2/6/11)', health: 'स्वास्थ्य (1/5/11)',
    signifies: 'सूचित भाव', required: 'आवश्यक', materialises: 'फलदायी', denied: 'अभाव',
  },
  sa: {
    title: 'केपी पद्धतिः', subtitle: 'कृष्णमूर्तिपद्धतिः — उपस्वामिविश्लेषणम्',
    desc: 'प्लेसिडसभावपद्धतिः 249 उपस्वामिसारणी च। प्रत्येकांशस्य राशिस्वामी नक्षत्रस्वामी उपस्वामी च।',
    generate: 'केपी कुण्डलीं रचयतु', generating: 'उपस्वामिगणना...',
    name: 'नाम', date: 'जन्मतिथिः', time: 'जन्मसमयः', place: 'स्थानम्', lat: 'अक्षांशः', lng: 'देशान्तरः', tz: 'समयक्षेत्रम्',
    cuspalTable: 'कस्पोपस्वामिसारणी', planetTable: 'ग्रहोपस्वामिसारणी',
    cuspalAnalysis: 'कस्पोपस्वामिसूचनविश्लेषणम्',
    significators: 'कारकसारणी', rulingPlanets: 'शासकग्रहाः',
    cusp: 'कस्पः', sign: 'राशिस्वामी', star: 'नक्षत्रस्वामी', sub: 'उपस्वामी', subsub: 'उपउपस्वामी', degree: 'अंशः',
    planet: 'ग्रहः', house: 'भावः', h: 'भावः', l1: 'स्तर1', l2: 'स्तर2', l3: 'स्तर3', l4: 'स्तर4', combined: 'संयुक्तम्',
    predictions: 'त्वरितभविष्यवाणी', asc: 'लग्नम्', moon: 'चन्द्रः', day: 'वारः',
    marriage: 'विवाहः (2/7/11)', career: 'व्यवसायः (2/6/10)', wealth: 'धनम् (2/6/11)', health: 'स्वास्थ्यम् (1/5/11)',
    signifies: 'सूचितभावाः', required: 'आवश्यकम्', materialises: 'फलितम्', denied: 'अभावः',
  },
};

export default function KPSystemPage() {
  const locale = useLocale() as Locale;
  const t = T[locale] || T.en;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const [form, setForm] = useState({ name: '', date: '1990-01-15', time: '08:00', ayanamsha: 'lahiri' as const });
  const [placeName, setPlaceName] = useState('');
  const [placeLat, setPlaceLat] = useState<number | null>(null);
  const [placeLng, setPlaceLng] = useState<number | null>(null);
  const [placeTimezone, setPlaceTimezone] = useState<string | null>(null);
  const [data, setData] = useState<KPChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const session = useAuthStore(s => s.session);

  const handleSubmit = async () => {
    if (placeLat === null || placeLng === null) return;
    setLoading(true);
    setUpgradeRequired(false);
    const [y, m, d] = form.date.split('-').map(Number);
    const tz = placeTimezone ? getUTCOffsetForDate(y, m, d, placeTimezone) : -(new Date(y, m - 1, d).getTimezoneOffset() / 60);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      const res = await fetch('/api/kp-system', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...form, place: placeName, lat: placeLat, lng: placeLng, timezone: String(tz) }),
      });
      const result = await res.json();
      if (result.error === 'upgrade_required') { setUpgradeRequired(true); return; }
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const planetName = (id: number) => {
    const g = GRAHAS[id];
    return g ? g.name[locale] : `P${id}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t.title}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto" style={bodyFont}>{t.desc}</p>
      </motion.div>

      {/* KP Intro */}
      <InfoBlock
        id="kp-intro"
        title={locale === 'en' ? 'What is the KP System?' : locale === 'hi' ? 'केपी पद्धति क्या है?' : 'केपी पद्धतिः किम्?'}
        defaultOpen={false}
      >
        {locale === 'hi' ? (
          <p>कृष्णमूर्ति पद्धति (KP) वैदिक ज्योतिष का एक आधुनिक परिष्करण है। यह प्रत्येक नक्षत्र को &apos;उप-स्वामी&apos; नामक 9 उपखंडों में विभाजित करता है, जिससे बहुत सटीक भविष्यवाणी संभव होती है। जहां पारंपरिक ज्योतिष कहता है &apos;करियर के लिए शुभ&apos;, वहीं KP बता सकता है &apos;15-22 मार्च के बीच पदोन्नति संभव।&apos; यह वैदिक सिद्धांतों के साथ प्लेसिडस भाव पद्धति का उपयोग करता है।</p>
        ) : (
          <p>Krishnamurti Paddhati (KP) is a modern refinement of Vedic astrology. It divides each nakshatra into 9 sub-divisions called &apos;sub-lords&apos;, giving much more precise predictions. While traditional astrology tells you &apos;good for career&apos;, KP can pinpoint &apos;promotion likely between March 15–22.&apos; It uses the Placidus house system with Vedic principles.</p>
        )}
      </InfoBlock>

      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['name', 'date', 'time'] as const).map(f => (
            <label key={f} className="block">
              <span className="text-text-secondary text-xs uppercase tracking-wider" style={bodyFont}>{t[f]}</span>
              <input type={f === 'date' ? 'date' : f === 'time' ? 'time' : 'text'} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                className="w-full mt-1 bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none" />
            </label>
          ))}
          <label className="block">
            <span className="text-text-secondary text-xs uppercase tracking-wider" style={bodyFont}>{t.place}</span>
            <LocationSearch value={placeName} onSelect={(loc) => { setPlaceName(loc.name); setPlaceLat(loc.lat); setPlaceLng(loc.lng); setPlaceTimezone(loc.timezone); }} placeholder={locale === 'en' ? 'Search birth place...' : 'जन्म स्थान खोजें...'} />
          </label>
        </div>
        <div className="text-center mt-6">
          <motion.button onClick={handleSubmit} disabled={loading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border-2 border-gold-primary/40 rounded-2xl text-gold-light text-lg font-bold hover:bg-gold-primary/30 disabled:opacity-50" style={headingFont}>
            {loading ? t.generating : t.generate}
          </motion.button>
        </div>
      </div>

      {upgradeRequired && (
        <div className="mt-6 rounded-xl bg-amber-500/10 border border-amber-500/30 p-5 text-center">
          <p className="text-amber-300 font-bold text-base mb-1" style={headingFont}>
            {locale === 'en' ? 'Pro or Jyotishi plan required' : 'प्रो या ज्योतिषी योजना आवश्यक'}
          </p>
          <p className="text-text-secondary/70 text-sm" style={bodyFont}>
            {locale === 'en'
              ? 'KP System analysis is a paid feature. Upgrade your plan to access it.'
              : 'केपी पद्धति एक सशुल्क सुविधा है। इसे एक्सेस करने के लिए अपनी योजना अपग्रेड करें।'}
          </p>
        </div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <GoldDivider />

            {/* Chart */}
            <div className="flex justify-center">
              <ChartNorth data={data.chart} title={t.title} size={460} />
            </div>

            {/* Cuspal Sub-Lord Table */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 overflow-x-auto">
              <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold">{t.cuspalTable}</h2>
              <table className="w-full text-sm">
                <thead><tr className="text-text-secondary border-b border-gold-primary/10">
                  <th className="text-left py-2 px-2">{t.cusp}</th>
                  <th className="text-left py-2 px-2">{t.degree}</th>
                  <th className="text-left py-2 px-2" style={bodyFont}>{t.sign}</th>
                  <th className="text-left py-2 px-2" style={bodyFont}>{t.star}</th>
                  <th className="text-left py-2 px-2" style={bodyFont}>{t.sub}</th>
                  <th className="text-left py-2 px-2 text-amber-400/80" style={bodyFont}>{t.subsub}</th>
                </tr></thead>
                <tbody>{data.cusps.map(c => (
                  <tr key={c.house} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                    <td className="py-2 px-2 text-gold-light font-bold">{c.house}</td>
                    <td className="py-2 px-2 text-text-secondary font-mono text-xs">{c.degree.toFixed(2)}°</td>
                    <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{c.subLordInfo.signLord.name[locale]}</td>
                    <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{c.subLordInfo.starLord.name[locale]}</td>
                    <td className="py-2 px-2 text-gold-light font-medium" style={bodyFont}>{c.subLordInfo.subLord.name[locale]}</td>
                    <td className="py-2 px-2 text-amber-400/80 text-xs" style={bodyFont}>{c.subLordInfo.subSubLord.name[locale]}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>

            {/* P2-05: Cuspal Sub-Lord Signification Analysis */}
            <div className="bg-gradient-to-br from-[#1a1040]/60 via-[#0a0e27]/80 to-[#0a0e27] border border-amber-500/20 rounded-xl p-6">
              <h2 className="text-amber-400 text-sm uppercase tracking-wider mb-1 font-bold">{t.cuspalAnalysis}</h2>
              <p className="text-text-secondary text-xs mb-4">The sub-lord of each house cusp determines whether that house&apos;s matters will materialise.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.cuspalAnalysis.map(ca => (
                  <div key={ca.house} className={`rounded-lg p-3 border ${ca.favorable ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-gold-light font-bold text-sm">H{ca.house}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ca.favorable ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                        {ca.favorable ? t.materialises : t.denied}
                      </span>
                    </div>
                    <div className="text-xs text-text-secondary mb-1" style={bodyFont}>
                      <span className="text-text-primary">{ca.subLordName[locale]}</span> → <span className="text-amber-400/80">{ca.subSubLordName[locale]}</span>
                    </div>
                    <div className="text-xs text-text-secondary">
                      {t.signifies}: <span className="text-gold-primary">{ca.signifiedHouses.length > 0 ? ca.signifiedHouses.join(', ') : '—'}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{ca.interpretation[locale]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Planetary Sub-Lord Table */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 overflow-x-auto">
              <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold">{t.planetTable}</h2>
              <table className="w-full text-sm">
                <thead><tr className="text-text-secondary border-b border-gold-primary/10">
                  <th className="text-left py-2 px-2" style={bodyFont}>{t.planet}</th>
                  <th className="text-left py-2 px-2">{t.degree}</th>
                  <th className="text-left py-2 px-2">{t.house}</th>
                  <th className="text-left py-2 px-2" style={bodyFont}>{t.sign}</th>
                  <th className="text-left py-2 px-2" style={bodyFont}>{t.star}</th>
                  <th className="text-left py-2 px-2" style={bodyFont}>{t.sub}</th>
                  <th className="text-left py-2 px-2 text-amber-400/80" style={bodyFont}>{t.subsub}</th>
                </tr></thead>
                <tbody>{data.planets.map(p => (
                  <tr key={p.planet.id} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                    <td className="py-2 px-2"><div className="flex items-center gap-2"><GrahaIconById id={p.planet.id} size={20} /><span className="text-gold-light font-medium" style={bodyFont}>{p.planet.name[locale]}</span></div></td>
                    <td className="py-2 px-2 text-text-secondary font-mono text-xs">{p.longitude.toFixed(2)}°</td>
                    <td className="py-2 px-2 text-text-secondary">{p.house}</td>
                    <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{p.subLordInfo.signLord.name[locale]}</td>
                    <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{p.subLordInfo.starLord.name[locale]}</td>
                    <td className="py-2 px-2 text-gold-light font-medium" style={bodyFont}>{p.subLordInfo.subLord.name[locale]}</td>
                    <td className="py-2 px-2 text-amber-400/80 text-xs" style={bodyFont}>{p.subLordInfo.subSubLord.name[locale]}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>

            {/* Significator Table */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 overflow-x-auto">
              <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold">{t.significators}</h2>
              <table className="w-full text-sm">
                <thead><tr className="text-text-secondary border-b border-gold-primary/10">
                  <th className="text-left py-2 px-2">{t.h}</th>
                  <th className="text-left py-2 px-2">{t.l1}</th>
                  <th className="text-left py-2 px-2">{t.l2}</th>
                  <th className="text-left py-2 px-2">{t.l3}</th>
                  <th className="text-left py-2 px-2">{t.l4}</th>
                  <th className="text-left py-2 px-2 text-gold-light">{t.combined}</th>
                </tr></thead>
                <tbody>{data.significators.map(s => (
                  <tr key={s.house} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                    <td className="py-2 px-2 text-gold-light font-bold">{s.house}</td>
                    <td className="py-2 px-2 text-text-secondary text-xs" style={bodyFont}>{s.level1.map(id => planetName(id)).join(', ') || '-'}</td>
                    <td className="py-2 px-2 text-text-secondary text-xs" style={bodyFont}>{s.level2.map(id => planetName(id)).join(', ') || '-'}</td>
                    <td className="py-2 px-2 text-text-secondary text-xs" style={bodyFont}>{s.level3.map(id => planetName(id)).join(', ') || '-'}</td>
                    <td className="py-2 px-2 text-text-secondary text-xs" style={bodyFont}>{s.level4.map(id => planetName(id)).join(', ') || '-'}</td>
                    <td className="py-2 px-2 text-gold-light text-xs font-medium" style={bodyFont}>{s.combined.map(id => planetName(id)).join(', ') || '-'}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>

            {/* Ruling Planets */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6">
              <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold">{t.rulingPlanets}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {[
                  { label: `${t.asc} ${t.sign}`, data: data.rulingPlanets.ascSignLord },
                  { label: `${t.asc} ${t.star}`, data: data.rulingPlanets.ascStarLord },
                  { label: `${t.moon} ${t.sign}`, data: data.rulingPlanets.moonSignLord },
                  { label: `${t.moon} ${t.star}`, data: data.rulingPlanets.moonStarLord },
                  { label: `${t.day}`, data: data.rulingPlanets.dayLord },
                ].map((rp, i) => (
                  <div key={i} className="text-center p-4 rounded-lg bg-gold-primary/5 border border-gold-primary/15">
                    <GrahaIconById id={rp.data.id} size={32} />
                    <p className="text-gold-light font-bold text-sm mt-2" style={bodyFont}>{rp.data.name[locale]}</p>
                    <p className="text-text-secondary text-xs mt-1">{rp.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

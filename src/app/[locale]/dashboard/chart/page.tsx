'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { KundaliData, ChartStyle } from '@/types/kundali';
import type { Locale } from '@/types/panchang';

export default function ChartPage() {
  const locale = useLocale() as Locale;
  const hf = ((locale === 'hi' || String(locale) === 'sa')) ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = ((locale === 'hi' || String(locale) === 'sa')) ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const user = useAuthStore(s => s.user);
  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('north');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }

    supabase.from('kundali_snapshots')
      .select('full_kundali')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_kundali) setKundali(data.full_kundali as KundaliData);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-text-secondary">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Sign in to view your chart' : 'चार्ट देखने के लिए साइन इन करें'}</p></div>;
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-primary border-t-transparent" /></div>;
  }

  if (!kundali) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-text-secondary">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Complete your profile to see your birth chart' : 'जन्म कुण्डली देखने के लिए प्रोफ़ाइल पूरा करें'}</p><a href={`/${locale}/settings`} className="text-gold-primary text-sm mt-2 inline-block">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Go to Settings' : 'सेटिंग्स पर जाएँ'}</a></div>;
  }

  const ChartComponent = chartStyle === 'north' ? ChartNorth : ChartSouth;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a href={`/${locale}/dashboard`} className="text-gold-primary text-sm hover:text-gold-light mb-6 inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" />{(locale !== 'hi' && String(locale) !== 'sa') ? 'Dashboard' : 'डैशबोर्ड'}</a>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold mb-3" style={hf}><span className="text-gold-gradient">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Your Birth Chart' : 'आपकी जन्म कुण्डली'}</span></h1>
        <p className="text-text-secondary text-sm">{kundali.birthData.date} | {kundali.birthData.time} | {kundali.birthData.place}</p>
      </motion.div>

      {/* Style toggle */}
      <div className="flex gap-3 mb-6">
        {(['north', 'south'] as ChartStyle[]).map(s => (
          <button key={s} onClick={() => setChartStyle(s)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${chartStyle === s ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10'}`}>
            {s === 'north' ? '◇ North' : '▦ South'}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6">
          <h3 className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-4">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Rashi (D1)' : 'राशि (D1)'}</h3>
          <ChartComponent data={kundali.chart} title="" />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6">
          <h3 className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-4">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Navamsha (D9)' : 'नवांश (D9)'}</h3>
          <ChartComponent data={kundali.navamshaChart} title="" />
        </motion.div>
      </div>

      {/* Ascendant */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 mb-6 flex items-center gap-4">
        <RashiIconById id={kundali.ascendant.sign} size={40} />
        <div>
          <p className="text-gold-dark text-xs uppercase tracking-wider font-bold">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Ascendant (Lagna)' : 'लग्न'}</p>
          <p className="text-gold-light text-lg font-bold" style={hf}>{kundali.ascendant.signName[locale]} ({kundali.ascendant.degree.toFixed(2)}°)</p>
        </div>
      </div>

      {/* Planet table */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 overflow-x-auto">
        <h3 className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-4">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Planet Positions' : 'ग्रह स्थिति'}</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-secondary border-b border-gold-primary/10 text-xs">
              <th className="text-left py-2 px-2">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Planet' : 'ग्रह'}</th>
              <th className="text-left py-2 px-2">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Sign' : 'राशि'}</th>
              <th className="text-left py-2 px-2">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Degree' : 'अंश'}</th>
              <th className="text-left py-2 px-2">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Nakshatra' : 'नक्षत्र'}</th>
              <th className="text-center py-2 px-2">{(locale !== 'hi' && String(locale) !== 'sa') ? 'House' : 'भाव'}</th>
              <th className="text-center py-2 px-2">R/C</th>
            </tr>
          </thead>
          <tbody>
            {kundali.planets.map(p => (
              <tr key={p.planet.id} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                <td className="py-2 px-2 flex items-center gap-2"><GrahaIconById id={p.planet.id} size={18} /><span className="text-gold-light" style={bf}>{p.planet.name[locale]}</span></td>
                <td className="py-2 px-2 text-text-secondary" style={bf}>{p.signName[locale]}</td>
                <td className="py-2 px-2 text-text-secondary font-mono text-xs">{p.degree}</td>
                <td className="py-2 px-2 text-text-secondary" style={bf}>{p.nakshatra.name[locale]} P{p.pada}</td>
                <td className="py-2 px-2 text-center text-gold-light font-bold">{p.house}</td>
                <td className="py-2 px-2 text-center">
                  {p.isRetrograde && <span className="text-red-400 text-xs font-bold mr-1">R</span>}
                  {p.isCombust && <span className="text-orange-400 text-xs font-bold">C</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-8">
        <a href={`/${locale}/kundali`} className="text-gold-primary hover:text-gold-light text-sm">
          {(locale !== 'hi' && String(locale) !== 'sa') ? 'Generate detailed analysis with all tabs →' : 'सभी टैब के साथ विस्तृत विश्लेषण →'}
        </a>
      </div>
    </div>
  );
}

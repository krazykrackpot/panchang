'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { DashaEntry } from '@/types/kundali';
import type { Locale } from '@/types/panchang';

const PLANET_ID: Record<string, number> = { Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8 };

const DASHA_EFFECTS: Record<string, { en: string; hi: string }> = {
  Sun: { en: 'Authority, career, government, father, vitality', hi: 'अधिकार, करियर, सरकार, पिता, जीवनशक्ति' },
  Moon: { en: 'Emotions, mother, public dealings, travel, nurturing', hi: 'भावनाएँ, माता, जनसंपर्क, यात्रा, पोषण' },
  Mars: { en: 'Energy, property, siblings, courage, surgery', hi: 'ऊर्जा, संपत्ति, भाई-बहन, साहस, शल्यक्रिया' },
  Mercury: { en: 'Intellect, business, communication, education', hi: 'बुद्धि, व्यापार, संवाद, शिक्षा' },
  Jupiter: { en: 'Wisdom, children, fortune, spirituality, teaching', hi: 'ज्ञान, संतान, भाग्य, आध्यात्मिकता, शिक्षण' },
  Venus: { en: 'Relationships, luxury, arts, marriage, comfort', hi: 'संबंध, विलासिता, कला, विवाह, सुख' },
  Saturn: { en: 'Discipline, delays, hard work, karma, longevity', hi: 'अनुशासन, विलंब, कठिन परिश्रम, कर्म, दीर्घायु' },
  Rahu: { en: 'Sudden changes, foreign, technology, unconventional', hi: 'अचानक बदलाव, विदेश, प्रौद्योगिकी, अपरंपरागत' },
  Ketu: { en: 'Spirituality, detachment, past karma, liberation', hi: 'आध्यात्मिकता, वैराग्य, पूर्व कर्म, मोक्ष' },
};

function progressPercent(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const now = Date.now();
  if (now <= s) return 0;
  if (now >= e) return 100;
  return Math.round(((now - s) / (e - s)) * 100);
}

function yearsDiff(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const years = ms / (365.25 * 24 * 60 * 60 * 1000);
  return years.toFixed(1);
}

export default function DashasPage() {
  const locale = useLocale() as Locale;
  const lk = locale === 'sa' ? 'hi' : locale;
  const hf = locale !== 'en' ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = locale !== 'en' ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const user = useAuthStore(s => s.user);
  const [dashas, setDashas] = useState<DashaEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMaha, setExpandedMaha] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }

    supabase.from('kundali_snapshots')
      .select('dasha_timeline')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.dasha_timeline) {
          setDashas(data.dasha_timeline as DashaEntry[]);
          // Auto-expand current maha
          const now = new Date();
          const current = (data.dasha_timeline as DashaEntry[]).find(d => new Date(d.startDate) <= now && now <= new Date(d.endDate));
          if (current) setExpandedMaha(current.planet);
        }
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-text-secondary">{locale === 'en' ? 'Sign in to view your dashas' : 'दशा देखने के लिए साइन इन करें'}</p></div>;
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-primary border-t-transparent" /></div>;
  }

  const now = new Date();
  const currentMaha = dashas.find(d => new Date(d.startDate) <= now && now <= new Date(d.endDate));
  const currentAntar = currentMaha?.subPeriods?.find(s => new Date(s.startDate) <= now && now <= new Date(s.endDate));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a href={`/${locale}/dashboard`} className="text-gold-primary text-sm hover:text-gold-light mb-6 inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" />{locale === 'en' ? 'Dashboard' : 'डैशबोर्ड'}</a>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold mb-3" style={hf}><span className="text-gold-gradient">{locale === 'en' ? 'Dasha Timeline' : 'दशा समयरेखा'}</span></h1>
      </motion.div>

      {/* Current Period */}
      {currentMaha && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 mb-8">
          <p className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-4">{locale === 'en' ? 'Current Period' : 'वर्तमान काल'}</p>

          {/* Mahadasha */}
          <div className="flex items-center gap-4 mb-4">
            <GrahaIconById id={PLANET_ID[currentMaha.planet] ?? 0} size={40} />
            <div className="flex-1">
              <p className="text-gold-light font-bold text-lg" style={hf}>{currentMaha.planetName[lk as keyof typeof currentMaha.planetName]} {locale === 'en' ? 'Mahadasha' : 'महादशा'}</p>
              <p className="text-text-secondary text-xs font-mono">{currentMaha.startDate} — {currentMaha.endDate} ({yearsDiff(currentMaha.startDate, currentMaha.endDate)} {locale === 'en' ? 'years' : 'वर्ष'})</p>
              <div className="mt-2 h-2 bg-bg-tertiary/40 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full" style={{ width: `${progressPercent(currentMaha.startDate, currentMaha.endDate)}%` }} />
              </div>
              <p className="text-text-secondary/70 text-xs mt-1">{progressPercent(currentMaha.startDate, currentMaha.endDate)}% {locale === 'en' ? 'complete' : 'पूर्ण'}</p>
            </div>
          </div>

          {/* Antardasha */}
          {currentAntar && (
            <div className="flex items-center gap-4 ml-8 pl-4 border-l-2 border-gold-primary/20">
              <GrahaIconById id={PLANET_ID[currentAntar.planet] ?? 0} size={28} />
              <div className="flex-1">
                <p className="text-gold-light font-semibold text-sm" style={bf}>{currentAntar.planetName[lk as keyof typeof currentAntar.planetName]} {locale === 'en' ? 'Antardasha' : 'अंतर्दशा'}</p>
                <p className="text-text-secondary text-xs font-mono">{currentAntar.startDate} — {currentAntar.endDate}</p>
                <div className="mt-1 h-1.5 bg-bg-tertiary/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-primary/60 rounded-full" style={{ width: `${progressPercent(currentAntar.startDate, currentAntar.endDate)}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* Effect */}
          <div className="mt-4 p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
            <p className="text-text-secondary text-xs" style={bf}>
              {DASHA_EFFECTS[currentMaha.planet]?.[lk as 'en' | 'hi'] || DASHA_EFFECTS[currentMaha.planet]?.en || ''}
            </p>
          </div>
        </motion.div>
      )}

      {/* Full Timeline */}
      <h2 className="text-xl font-bold text-gold-gradient mb-4" style={hf}>{locale === 'en' ? 'Full Timeline' : 'पूर्ण समयरेखा'}</h2>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gold-primary/15" />

        <div className="space-y-3">
          {dashas.map((d, i) => {
            const isCurrent = currentMaha?.planet === d.planet;
            const isPast = new Date(d.endDate) < now;
            const isExpanded = expandedMaha === d.planet;

            return (
              <motion.div key={`${d.planet}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <button onClick={() => setExpandedMaha(isExpanded ? null : d.planet)}
                  className={`w-full text-left ml-10 rounded-xl p-4 border transition-all relative ${
                    isCurrent ? 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/30 bg-gold-primary/5' : isPast ? 'bg-bg-tertiary/10 border-gold-primary/5 opacity-50' : 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10'
                  }`}>
                  {/* Timeline dot */}
                  <div className={`absolute -left-[1.65rem] top-5 w-3 h-3 rounded-full ${isCurrent ? 'bg-gold-primary shadow-[0_0_8px_rgba(212,168,83,0.5)]' : isPast ? 'bg-text-secondary/30' : 'bg-gold-primary/30'}`} />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GrahaIconById id={PLANET_ID[d.planet] ?? 0} size={24} />
                      <div>
                        <span className={`font-bold text-sm ${isCurrent ? 'text-gold-light' : 'text-text-secondary'}`} style={bf}>{d.planetName[lk as keyof typeof d.planetName]}</span>
                        {isCurrent && <span className="ml-2 text-xs px-2 py-0.5 bg-gold-primary/20 text-gold-primary rounded-full font-bold">{locale === 'en' ? 'NOW' : 'अभी'}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-text-secondary/70 text-xs font-mono">{d.startDate.slice(0, 4)}—{d.endDate.slice(0, 4)} ({yearsDiff(d.startDate, d.endDate)}y)</span>
                      {d.subPeriods && d.subPeriods.length > 0 && <ChevronDown className={`w-4 h-4 text-gold-primary/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                    </div>
                  </div>
                </button>

                {/* Antardasha sub-periods */}
                {isExpanded && d.subPeriods && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ml-16 mt-1 space-y-1">
                    {d.subPeriods.map((s, j) => {
                      const isCurrentAntar = currentAntar?.planet === s.planet && currentMaha?.planet === d.planet;
                      return (
                        <div key={j} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${isCurrentAntar ? 'bg-gold-primary/10 border border-gold-primary/20' : ''}`}>
                          <GrahaIconById id={PLANET_ID[s.planet] ?? 0} size={14} />
                          <span className={isCurrentAntar ? 'text-gold-light font-bold' : 'text-text-secondary'} style={bf}>{s.planetName[lk as keyof typeof s.planetName]}</span>
                          <span className="text-text-secondary/65 font-mono ml-auto">{s.startDate} — {s.endDate}</span>
                          {isCurrentAntar && <span className="text-gold-primary text-xs font-bold">{locale === 'en' ? 'NOW' : 'अभी'}</span>}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

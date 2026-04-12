'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Heart, Briefcase, Plane, GraduationCap, Home, Stethoscope, Car, Sun, DollarSign, Scale, Check, X, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { computePersonalMuhurta, type PersonalMuhurta } from '@/lib/personalization/personal-muhurta';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  marriage: <Heart className="w-5 h-5" />,
  business: <Briefcase className="w-5 h-5" />,
  travel: <Plane className="w-5 h-5" />,
  education: <GraduationCap className="w-5 h-5" />,
  property: <Home className="w-5 h-5" />,
  medical: <Stethoscope className="w-5 h-5" />,
  vehicle: <Car className="w-5 h-5" />,
  spiritual: <Sun className="w-5 h-5" />,
  financial: <DollarSign className="w-5 h-5" />,
  court_case: <Scale className="w-5 h-5" />,
};

const REC_STYLES: Record<string, { bg: string; text: string; label: { en: string; hi: string } }> = {
  excellent: { bg: 'bg-emerald-500/15 border-emerald-500/25', text: 'text-emerald-400', label: { en: 'Excellent', hi: 'उत्कृष्ट' } },
  good: { bg: 'bg-gold-primary/15 border-gold-primary/25', text: 'text-gold-light', label: { en: 'Good', hi: 'अच्छा' } },
  neutral: { bg: 'bg-bg-tertiary/30 border-gold-primary/10', text: 'text-text-secondary', label: { en: 'Neutral', hi: 'सामान्य' } },
  avoid: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', label: { en: 'Avoid', hi: 'बचें' } },
};

export default function MuhurtaPage() {
  const locale = useLocale() as Locale;
  const lk = (isDevanagariLocale(locale)) ? 'hi' as const : 'en' as const;
  const hf = (isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = (isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const user = useAuthStore(s => s.user);
  const [muhurtas, setMuhurtas] = useState<PersonalMuhurta[]>([]);
  const [loading, setLoading] = useState(true);
  const [birthNak, setBirthNak] = useState(0);
  const [todayNak, setTodayNak] = useState(0);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }

    Promise.all([
      supabase.from('kundali_snapshots').select('moon_sign, moon_nakshatra').eq('user_id', user.id).maybeSingle(),
      fetch(`/api/panchang?year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}&day=${new Date().getDate()}&lat=0&lng=0`).then(r => r.json()),
    ]).then(([{ data: snap }, panchang]) => {
      if (!snap) { setLoading(false); return; }
      const tNak = panchang?.nakshatra?.id || 1;
      const tMoon = panchang?.moonSign || 1;
      setBirthNak(snap.moon_nakshatra);
      setTodayNak(tNak);
      setMuhurtas(computePersonalMuhurta(snap.moon_nakshatra, snap.moon_sign, tNak, tMoon));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary">{!isDevanagariLocale(locale) ? 'Sign in to see personal muhurta' : 'व्यक्तिगत मुहूर्त देखने के लिए साइन इन करें'}</p>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-primary border-t-transparent" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a href={`/${locale}/dashboard`} className="text-gold-primary text-sm hover:text-gold-light mb-6 inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" />{!isDevanagariLocale(locale) ? 'Dashboard' : 'डैशबोर्ड'}</a>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold mb-3" style={hf}><span className="text-gold-gradient">{!isDevanagariLocale(locale) ? 'Personal Muhurta' : 'व्यक्तिगत मुहूर्त'}</span></h1>
        <p className="text-text-secondary text-sm" style={bf}>
          {!isDevanagariLocale(locale)
            ? `Based on your birth nakshatra (${birthNak}) and today's nakshatra (${todayNak})`
            : `आपके जन्म नक्षत्र (${birthNak}) और आज के नक्षत्र (${todayNak}) के आधार पर`}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {muhurtas.map((m, i) => {
          const style = REC_STYLES[m.recommendation];
          return (
            <motion.div key={m.activityKey} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`rounded-xl p-5 border ${style.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={style.text}>{ACTIVITY_ICONS[m.activityKey] || <Sun className="w-5 h-5" />}</span>
                  <span className={`font-bold text-sm ${style.text}`} style={bf}>{m.activity[lk as keyof typeof m.activity]}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${style.text} ${style.bg}`}>{style.label[lk as keyof typeof style.label]}</span>
              </div>
              <div className="flex items-center gap-4 mb-2 text-xs">
                <span className="flex items-center gap-1">
                  {!isDevanagariLocale(locale) ? 'Tara' : 'तारा'}: {m.taraBala.favorable ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-red-400" />}
                  <span className="text-text-secondary">{m.taraBala.taraName}</span>
                </span>
                <span className="flex items-center gap-1">
                  {!isDevanagariLocale(locale) ? 'Chandra' : 'चन्द्र'}: {m.chandraBala.favorable ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-red-400" />}
                  <span className="text-text-secondary">H{m.chandraBala.houseFromMoon}</span>
                </span>
              </div>
              <p className="text-text-secondary/70 text-xs" style={bf}>{m.reason[lk as keyof typeof m.reason]}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 text-xs text-text-secondary" style={bf}>
        <p className="text-gold-dark font-bold uppercase tracking-wider mb-2">{!isDevanagariLocale(locale) ? 'How this works' : 'यह कैसे काम करता है'}</p>
        <p>{!isDevanagariLocale(locale)
          ? 'Tara Bala compares your birth nakshatra with today\'s nakshatra (9-cycle). Chandra Bala checks today\'s Moon position relative to your birth Moon sign. Both favorable = Excellent. Both unfavorable = Avoid.'
          : 'तारा बल आपके जन्म नक्षत्र की तुलना आज के नक्षत्र से करता है (9 चक्र)। चन्द्र बल आज के चन्द्रमा की स्थिति की जाँच करता है। दोनों अनुकूल = उत्कृष्ट। दोनों प्रतिकूल = बचें।'}</p>
      </div>
    </div>
  );
}

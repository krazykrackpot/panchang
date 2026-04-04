'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Eye, Star, X, Loader2 } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { Locale } from '@/types/panchang';

interface SavedChart {
  id: string;
  label: string;
  birth_data: { name?: string; date: string; time: string; place: string; lat: number; lng: number };
  is_primary: boolean;
  created_at: string;
}

export default function SavedChartsPage() {
  const locale = useLocale() as Locale;
  const lk = locale === 'sa' ? 'hi' : locale;
  const hf = locale !== 'en' ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = locale !== 'en' ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const user = useAuthStore(s => s.user);

  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [label, setLabel] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('12:00');
  const [placeName, setPlaceName] = useState('');
  const [placeLat, setPlaceLat] = useState<number | null>(null);
  const [placeLng, setPlaceLng] = useState<number | null>(null);

  const fetchCharts = () => {
    if (!user) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.from('saved_charts')
      .select('id, label, birth_data, is_primary, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setCharts(data as SavedChart[]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCharts();
  }, [user]);

  const handleSave = async () => {
    if (!user || !label || !dob || !placeLat || !placeLng) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setSaving(true);
    await supabase.from('saved_charts').insert({
      user_id: user.id,
      label,
      birth_data: { name: label, date: dob, time: tob, place: placeName, lat: placeLat, lng: placeLng },
      is_primary: false,
    });
    setLabel(''); setDob(''); setTob('12:00'); setPlaceName(''); setPlaceLat(null); setPlaceLng(null);
    setShowForm(false);
    setSaving(false);
    fetchCharts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === 'en' ? 'Delete this chart?' : 'यह चार्ट हटाएँ?')) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setDeleting(id);
    await supabase.from('saved_charts').delete().eq('id', id);
    setDeleting(null);
    fetchCharts();
  };

  if (!user) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-text-secondary">{locale === 'en' ? 'Sign in to manage saved charts' : 'सहेजे गए चार्ट देखने के लिए साइन इन करें'}</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a href={`/${locale}/dashboard`} className="text-gold-primary text-sm hover:text-gold-light mb-6 inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" />{locale === 'en' ? 'Dashboard' : 'डैशबोर्ड'}</a>

      <div className="flex items-center justify-between mb-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold" style={hf}>
          <span className="text-gold-gradient">{locale === 'en' ? 'Saved Charts' : 'सहेजे गए चार्ट'}</span>
        </motion.h1>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-gold-primary/20 border border-gold-primary/30 text-gold-light text-sm font-bold hover:bg-gold-primary/30 transition-all flex items-center gap-2">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? (locale === 'en' ? 'Cancel' : 'रद्द') : (locale === 'en' ? 'Add New' : 'नया जोड़ें')}
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1">{locale === 'en' ? 'Label' : 'नाम'}</label>
                <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder={locale === 'en' ? 'e.g., My Mother' : 'उदा., मेरी माता'}
                  className="w-full bg-bg-tertiary/40 border border-gold-primary/10 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/40 outline-none" />
              </div>
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1">{locale === 'en' ? 'Date of Birth' : 'जन्म तिथि'}</label>
                <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                  className="w-full bg-bg-tertiary/40 border border-gold-primary/10 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/40 outline-none" />
              </div>
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1">{locale === 'en' ? 'Time of Birth' : 'जन्म समय'}</label>
                <input type="time" value={tob} onChange={e => setTob(e.target.value)}
                  className="w-full bg-bg-tertiary/40 border border-gold-primary/10 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/40 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1">{locale === 'en' ? 'Place of Birth' : 'जन्म स्थान'}</label>
                <LocationSearch value={placeName} onSelect={loc => { setPlaceName(loc.name); setPlaceLat(loc.lat); setPlaceLng(loc.lng); }}
                  placeholder={locale === 'en' ? 'Search city...' : 'शहर खोजें...'} />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving || !label || !dob || !placeLat}
              className="w-full py-2.5 rounded-lg bg-gold-primary/20 border border-gold-primary/30 text-gold-light text-sm font-bold hover:bg-gold-primary/30 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {locale === 'en' ? 'Save Chart' : 'चार्ट सहेजें'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts list */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-primary border-t-transparent" /></div>
      ) : charts.length === 0 ? (
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-12 text-center">
          <Star className="w-12 h-12 text-gold-primary/30 mx-auto mb-4" />
          <p className="text-text-secondary text-lg mb-2" style={bf}>{locale === 'en' ? 'No saved charts yet' : 'अभी तक कोई सहेजा गया चार्ट नहीं'}</p>
          <p className="text-text-secondary/50 text-sm mb-4">{locale === 'en' ? 'Save birth charts for family members, friends, or clients' : 'परिवार, मित्रों या ग्राहकों की जन्म कुण्डली सहेजें'}</p>
          <button onClick={() => setShowForm(true)} className="px-6 py-2 rounded-lg bg-gold-primary/20 border border-gold-primary/30 text-gold-light text-sm font-bold">
            {locale === 'en' ? 'Add Your First Chart' : 'अपना पहला चार्ट जोड़ें'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {charts.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-gold-light font-bold text-sm" style={bf}>{c.label}</h3>
                  {c.is_primary && <span className="text-xs px-1.5 py-0.5 rounded-full bg-gold-primary/20 text-gold-primary font-bold">{locale === 'en' ? 'Primary' : 'प्राथमिक'}</span>}
                </div>
                <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                  className="text-text-secondary/40 hover:text-red-400 transition-colors p-1">
                  {deleting === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-text-secondary text-xs mb-1">{c.birth_data.date} | {c.birth_data.time}</p>
              <p className="text-text-secondary/50 text-xs mb-3">{c.birth_data.place}</p>
              <a href={`/${locale}/kundali?n=${encodeURIComponent(c.birth_data.name || c.label)}&d=${c.birth_data.date}&t=${c.birth_data.time}&la=${c.birth_data.lat}&lo=${c.birth_data.lng}&p=${encodeURIComponent(c.birth_data.place)}`}
                className="flex items-center gap-1.5 text-gold-primary text-xs font-bold hover:text-gold-light transition-colors">
                <Eye className="w-3.5 h-3.5" />{locale === 'en' ? 'View Chart' : 'चार्ट देखें'}
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

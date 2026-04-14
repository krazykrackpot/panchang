'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Eye, Star, X, Loader2 } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';

interface SavedChart {
  id: string;
  label: string;
  birth_data: { name?: string; date: string; time: string; place: string; lat: number; lng: number };
  is_primary: boolean;
  created_at: string;
}

export default function SavedChartsPage() {
  const locale = useLocale() as Locale;
  const hf = (isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = (isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-body)' } : {};
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
    if (!confirm(tl({ en: 'Delete this chart?', hi: 'यह चार्ट हटाएँ?', sa: 'एतत् कुण्डलीं मार्जयतु?', ta: 'இந்த ஜாதகத்தை நீக்கவா?', te: 'ఈ జాతకాన్ని తొలగించాలా?', bn: 'এই জাতক মুছবেন?', kn: 'ಈ ಜಾತಕವನ್ನು ಅಳಿಸಬೇಕೇ?', gu: 'આ જાતક કાઢી નાખવું?', mai: 'ई चार्ट हटाउ?', mr: 'हा चार्ट हटवायचा?' }, locale))) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setDeleting(id);
    await supabase.from('saved_charts').delete().eq('id', id);
    setDeleting(null);
    fetchCharts();
  };

  if (!user) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-text-secondary">{tl({ en: 'Sign in to manage saved charts', hi: 'सहेजे गए चार्ट देखने के लिए साइन इन करें', sa: 'सुरक्षिताः कुण्डल्यः द्रष्टुं साइन इन कुर्वन्तु', ta: 'சேமிக்கப்பட்ட ஜாதகங்களை நிர்வகிக்க உள்நுழையவும்', te: 'సేవ్ చేసిన జాతకాలను నిర్వహించడానికి సైన్ ఇన్ చేయండి', bn: 'সংরক্ষিত জাতক পরিচালনা করতে সাইন ইন করুন', kn: 'ಉಳಿಸಿದ ಜಾತಕಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ', gu: 'સાચવેલા જાતક મેનેજ કરવા સાઇન ઇન કરો', mai: 'सहेजल चार्ट देखबाक लेल साइन इन करू', mr: 'जतन केलेल्या कुंडल्या पाहण्यासाठी साइन इन करा' }, locale)}</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a href={`/${locale}/dashboard`} className="text-gold-primary text-sm hover:text-gold-light mb-6 inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" />{tl({ en: 'Dashboard', hi: 'डैशबोर्ड', sa: 'पटलम्', ta: 'டாஷ்போர்டு', te: 'డాష్‌బోర్డ్', bn: 'ড্যাশবোর্ড', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', gu: 'ડેશબોર્ડ', mai: 'डैशबोर्ड', mr: 'डॅशबोर्ड' }, locale)}</a>

      <div className="flex items-center justify-between mb-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold" style={hf}>
          <span className="text-gold-gradient">{tl({ en: 'Saved Charts', hi: 'सहेजे गए चार्ट', sa: 'सुरक्षिताः कुण्डल्यः', ta: 'சேமிக்கப்பட்ட ஜாதகங்கள்', te: 'సేవ్ చేసిన జాతకాలు', bn: 'সংরক্ষিত জাতক', kn: 'ಉಳಿಸಿದ ಜಾತಕಗಳು', gu: 'સાચવેલા જાતક', mai: 'सहेजल चार्ट', mr: 'जतन केलेल्या कुंडल्या' }, locale)}</span>
        </motion.h1>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-gold-primary/20 border border-gold-primary/30 text-gold-light text-sm font-bold hover:bg-gold-primary/30 transition-all flex items-center gap-2">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? tl({ en: 'Cancel', hi: 'रद्द', sa: 'रद्दम्', ta: 'ரத்து', te: 'రద్దు', bn: 'বাতিল', kn: 'ರದ್ದು', gu: 'રદ', mai: 'रद्द', mr: 'रद्द' }, locale) : tl({ en: 'Add New', hi: 'नया जोड़ें', sa: 'नवं योजयतु', ta: 'புதியது சேர்', te: 'కొత్తది జోడించు', bn: 'নতুন যোগ করুন', kn: 'ಹೊಸದನ್ನು ಸೇರಿಸಿ', gu: 'નવું ઉમેરો', mai: 'नव जोड़ू', mr: 'नवीन जोडा' }, locale)}
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1">{tl({ en: 'Label', hi: 'नाम', sa: 'नाम', ta: 'பெயர்', te: 'పేరు', bn: 'নাম', kn: 'ಹೆಸರು', gu: 'નામ', mai: 'नाम', mr: 'नाव' }, locale)}</label>
                <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder={tl({ en: 'e.g., My Mother', hi: 'उदा., मेरी माता', sa: 'यथा, मम माता', ta: 'எ.கா., என் தாய்', te: 'ఉదా., నా తల్లి', bn: 'যেমন, আমার মা', kn: 'ಉದಾ., ನನ್ನ ತಾಯಿ', gu: 'દા.ત., મારી માતા', mai: 'जेना, हमर माय', mr: 'उदा., माझी आई' }, locale)}
                  className="w-full bg-bg-tertiary/40 border border-gold-primary/10 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/40 outline-none" />
              </div>
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1">{tl({ en: 'Date of Birth', hi: 'जन्म तिथि', sa: 'जन्मदिनाङ्कः', ta: 'பிறந்த தேதி', te: 'పుట్టిన తేదీ', bn: 'জন্ম তারিখ', kn: 'ಹುಟ್ಟಿದ ದಿನಾಂಕ', gu: 'જન્મ તારીખ', mai: 'जन्म तिथि', mr: 'जन्मतारीख' }, locale)}</label>
                <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                  className="w-full bg-bg-tertiary/40 border border-gold-primary/10 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/40 outline-none" />
              </div>
              <div>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1">{tl({ en: 'Time of Birth', hi: 'जन्म समय', sa: 'जन्मसमयः', ta: 'பிறந்த நேரம்', te: 'పుట్టిన సమయం', bn: 'জন্ম সময়', kn: 'ಹುಟ್ಟಿದ ಸಮಯ', gu: 'જન્મ સમય', mai: 'जन्म समय', mr: 'जन्मवेळ' }, locale)}</label>
                <input type="time" value={tob} onChange={e => setTob(e.target.value)}
                  className="w-full bg-bg-tertiary/40 border border-gold-primary/10 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/40 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1">{tl({ en: 'Place of Birth', hi: 'जन्म स्थान', sa: 'जन्मस्थानम्', ta: 'பிறந்த இடம்', te: 'పుట్టిన ప్రదేశం', bn: 'জন্মস্থান', kn: 'ಹುಟ್ಟಿದ ಸ್ಥಳ', gu: 'જન્મ સ્થળ', mai: 'जन्म स्थान', mr: 'जन्मस्थान' }, locale)}</label>
                <LocationSearch value={placeName} onSelect={loc => { setPlaceName(loc.name); setPlaceLat(loc.lat); setPlaceLng(loc.lng); }}
                  placeholder={tl({ en: 'Search city...', hi: 'शहर खोजें...', sa: 'नगरं अन्विष्यतु...', ta: 'நகரம் தேடு...', te: 'నగరం శోధించండి...', bn: 'শহর খুঁজুন...', kn: 'ನಗರ ಹುಡುಕಿ...', gu: 'શહેર શોધો...', mai: 'शहर खोजू...', mr: 'शहर शोधा...' }, locale)} />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving || !label || !dob || !placeLat}
              className="w-full py-2.5 rounded-lg bg-gold-primary/20 border border-gold-primary/30 text-gold-light text-sm font-bold hover:bg-gold-primary/30 disabled:opacity-40 transition-all flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {tl({ en: 'Save Chart', hi: 'चार्ट सहेजें', sa: 'कुण्डलीं रक्षतु', ta: 'ஜாதகம் சேமி', te: 'జాతకం సేవ్ చేయండి', bn: 'জাতক সংরক্ষণ করুন', kn: 'ಜಾತಕ ಉಳಿಸಿ', gu: 'જાતક સાચવો', mai: 'चार्ट सहेजू', mr: 'चार्ट जतन करा' }, locale)}
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
          <p className="text-text-secondary text-lg mb-2" style={bf}>{tl({ en: 'No saved charts yet', hi: 'अभी तक कोई सहेजा गया चार्ट नहीं', sa: 'अधुना सुरक्षिता कुण्डली नास्ति', ta: 'இன்னும் சேமிக்கப்பட்ட ஜாதகங்கள் இல்லை', te: 'ఇంకా సేవ్ చేసిన జాతకాలు లేవు', bn: 'এখনও কোনো সংরক্ষিত জাতক নেই', kn: 'ಇನ್ನೂ ಉಳಿಸಿದ ಜಾತಕಗಳಿಲ್ಲ', gu: 'હજુ સુધી કોઈ સાચવેલા જાતક નથી', mai: 'अखन तक कोनो सहेजल चार्ट नहि', mr: 'अजून कोणतेही जतन केलेले चार्ट नाहीत' }, locale)}</p>
          <p className="text-text-secondary/70 text-sm mb-4">{tl({ en: 'Save birth charts for family members, friends, or clients', hi: 'परिवार, मित्रों या ग्राहकों की जन्म कुण्डली सहेजें', sa: 'परिवारमित्रग्राहकानां जन्मकुण्डल्यः रक्षतु', ta: 'குடும்பத்தினர், நண்பர்கள் அல்லது வாடிக்கையாளர்களின் ஜாதகங்களைச் சேமிக்கவும்', te: 'కుటుంబ సభ్యులు, స్నేహితులు లేదా కస్టమర్ల జాతకాలను సేవ్ చేయండి', bn: 'পরিবার, বন্ধু বা ক্লায়েন্টদের জন্ম কুণ্ডলী সংরক্ষণ করুন', kn: 'ಕುಟುಂಬ ಸದಸ್ಯರು, ಸ್ನೇಹಿತರು ಅಥವಾ ಗ್ರಾಹಕರ ಜಾತಕಗಳನ್ನು ಉಳಿಸಿ', gu: 'કુટુંબ, મિત્રો અથવા ગ્રાહકોના જન્મ જાતક સાચવો', mai: 'परिवार, मित्र या ग्राहकक जन्म कुण्डली सहेजू', mr: 'कुटुंबीय, मित्र किंवा ग्राहकांच्या जन्म कुंडल्या जतन करा' }, locale)}</p>
          <button onClick={() => setShowForm(true)} className="px-6 py-2 rounded-lg bg-gold-primary/20 border border-gold-primary/30 text-gold-light text-sm font-bold">
            {tl({ en: 'Add Your First Chart', hi: 'अपना पहला चार्ट जोड़ें', sa: 'स्वप्रथमं कुण्डलीं योजयतु', ta: 'உங்கள் முதல் ஜாதகத்தைச் சேர்க்கவும்', te: 'మీ మొదటి జాతకాన్ని జోడించండి', bn: 'আপনার প্রথম জাতক যোগ করুন', kn: 'ನಿಮ್ಮ ಮೊದಲ ಜಾತಕವನ್ನು ಸೇರಿಸಿ', gu: 'તમારું પહેલું જાતક ઉમેરો', mai: 'अपन पहिल चार्ट जोड़ू', mr: 'तुमचा पहिला चार्ट जोडा' }, locale)}
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
                  {c.is_primary && <span className="text-xs px-1.5 py-0.5 rounded-full bg-gold-primary/20 text-gold-primary font-bold">{tl({ en: 'Primary', hi: 'प्राथमिक', sa: 'प्राथमिकम्', ta: 'முதன்மை', te: 'ప్రాథమిక', bn: 'প্রাথমিক', kn: 'ಪ್ರಾಥಮಿಕ', gu: 'પ્રાથમિક', mai: 'प्राथमिक', mr: 'प्राथमिक' }, locale)}</span>}
                </div>
                <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                  className="text-text-secondary/65 hover:text-red-400 transition-colors p-1">
                  {deleting === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-text-secondary text-xs mb-1">{c.birth_data.date} | {c.birth_data.time}</p>
              <p className="text-text-secondary/70 text-xs mb-3">{c.birth_data.place}</p>
              <a href={`/${locale}/kundali?n=${encodeURIComponent(c.birth_data.name || c.label)}&d=${c.birth_data.date}&t=${c.birth_data.time}&la=${c.birth_data.lat}&lo=${c.birth_data.lng}&p=${encodeURIComponent(c.birth_data.place)}`}
                className="flex items-center gap-1.5 text-gold-primary text-xs font-bold hover:text-gold-light transition-colors">
                <Eye className="w-3.5 h-3.5" />{tl({ en: 'View Chart', hi: 'चार्ट देखें', sa: 'कुण्डलीं पश्यतु', ta: 'ஜாதகம் காண்க', te: 'జాతకం చూడండి', bn: 'জাতক দেখুন', kn: 'ಜಾತಕ ನೋಡಿ', gu: 'જાતક જુઓ', mai: 'चार्ट देखू', mr: 'चार्ट पहा' }, locale)}
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

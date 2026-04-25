'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Heart, Briefcase, Plane, GraduationCap, Home, Stethoscope, Car, Sun, DollarSign, Scale, Check, X, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useLocationStore } from '@/stores/location-store';
import { getSupabase } from '@/lib/supabase/client';
import { computePersonalMuhurta, type PersonalMuhurta } from '@/lib/personalization/personal-muhurta';
import type { Locale , LocaleText} from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';

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

const REC_STYLES: Record<string, { bg: string; text: string; label: LocaleText }> = {
  excellent: { bg: 'bg-emerald-500/15 border-emerald-500/25', text: 'text-emerald-400', label: { en: 'Excellent', hi: 'उत्कृष्ट', sa: 'उत्कृष्टम्', mai: 'उत्कृष्ट', mr: 'उत्कृष्ट', ta: 'சிறப்பு', te: 'అద్భుతం', bn: 'চমৎকার', kn: 'ಅತ್ಯುತ್ತಮ', gu: 'ઉત્તમ' } },
  good: { bg: 'bg-gold-primary/15 border-gold-primary/25', text: 'text-gold-light', label: { en: 'Good', hi: 'अच्छा', sa: 'शुभम्', mai: 'नीक', mr: 'चांगले', ta: 'நல்லது', te: 'మంచిది', bn: 'ভালো', kn: 'ಒಳ್ಳೆಯದು', gu: 'સારું' } },
  neutral: { bg: 'bg-bg-tertiary/30 border-gold-primary/10', text: 'text-text-secondary', label: { en: 'Neutral', hi: 'सामान्य', sa: 'सामान्यम्', mai: 'सामान्य', mr: 'सामान्य', ta: 'நடுநிலை', te: 'సాధారణం', bn: 'সাধারণ', kn: 'ಸಾಮಾನ್ಯ', gu: 'સામાન્ય' } },
  avoid: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', label: { en: 'Avoid', hi: 'बचें', sa: 'वर्जयतु', mai: 'बचू', mr: 'टाळा', ta: 'தவிர்க்கவும்', te: 'నివారించండి', bn: 'এড়িয়ে চলুন', kn: 'ತಪ್ಪಿಸಿ', gu: 'ટાળો' } },
};

export default function MuhurtaPage() {
  const locale = useLocale() as Locale;
  const hf = (isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = (isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const user = useAuthStore(s => s.user);
  // Panchang data depends on WHERE the user is NOW — use current location, not birth location
  const locationStore = useLocationStore();
  const [muhurtas, setMuhurtas] = useState<PersonalMuhurta[]>([]);
  const [loading, setLoading] = useState(true);
  const [birthNak, setBirthNak] = useState(0);
  const [todayNak, setTodayNak] = useState(0);

  useEffect(() => { locationStore.detect(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }

    // Wait for location detection before fetching panchang
    const lat = locationStore.lat;
    const lng = locationStore.lng;
    if (lat === null || lng === null) {
      // Location not yet detected — don't fetch with bogus coords
      if (!locationStore.detecting) setLoading(false);
      return;
    }

    const tz = locationStore.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    Promise.all([
      supabase.from('kundali_snapshots').select('moon_sign, moon_nakshatra').eq('user_id', user.id).maybeSingle(),
      fetch(`/api/panchang?year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}&day=${new Date().getDate()}&lat=${lat}&lng=${lng}&timezone=${encodeURIComponent(tz)}`).then(r => r.json()),
    ]).then(([{ data: snap }, panchang]) => {
      if (!snap) { setLoading(false); return; }
      const tNak = panchang?.nakshatra?.id || 1;
      const tMoon = panchang?.moonSign || 1;
      setBirthNak(snap.moon_nakshatra);
      setTodayNak(tNak);
      setMuhurtas(computePersonalMuhurta(snap.moon_nakshatra, snap.moon_sign, tNak, tMoon));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, locationStore.lat, locationStore.lng, locationStore.timezone, locationStore.detecting]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary">{tl({ en: 'Sign in to see personal muhurta', hi: 'व्यक्तिगत मुहूर्त देखने के लिए साइन इन करें', sa: 'व्यक्तिगतं मुहूर्तं द्रष्टुं प्रवेशं करोतु', ta: 'தனிப்பட்ட முஹூர்த்தம் பார்க்க உள்நுழையவும்', te: 'వ్యక్తిగత ముహూర్తం చూడటానికి సైన్ ఇన్ చేయండి', bn: 'ব্যক্তিগত মুহূর্ত দেখতে সাইন ইন করুন', kn: 'ವ್ಯಕ್ತಿಗತ ಮುಹೂರ್ತ ನೋಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ', gu: 'વ્યક્તિગત મુહૂર્ત જોવા સાઇન ઇન કરો', mai: 'व्यक्तिगत मुहूर्त देखबाक लेल साइन इन करू', mr: 'वैयक्तिक मुहूर्त पाहण्यासाठी साइन इन करा' }, locale)}</p>
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-primary border-t-transparent" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a href={`/${locale}/dashboard`} className="text-gold-primary text-sm hover:text-gold-light mb-6 inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" />{tl({ en: 'Dashboard', hi: 'डैशबोर्ड', sa: 'नियन्त्रण-पटलम्', ta: 'டாஷ்போர்டு', te: 'డాష్‌బోర్డ్', bn: 'ড্যাশবোর্ড', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', gu: 'ડેશબોર્ડ', mai: 'डैशबोर्ड', mr: 'डॅशबोर्ड' }, locale)}</a>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold mb-3" style={hf}><span className="text-gold-gradient">{tl({ en: 'Personal Muhurta', hi: 'व्यक्तिगत मुहूर्त', sa: 'व्यक्तिगतः मुहूर्तः', ta: 'தனிப்பட்ட முஹூர்த்தம்', te: 'వ్యక్తిగత ముహూర్తం', bn: 'ব্যক্তিগত মুহূর্ত', kn: 'ವ್ಯಕ್ತಿಗತ ಮುಹೂರ್ತ', gu: 'વ્યક્તિગત મુહૂર્ત', mai: 'व्यक्तिगत मुहूर्त', mr: 'वैयक्तिक मुहूर्त' }, locale)}</span></h1>
        <p className="text-text-secondary text-sm" style={bf}>
          {tl({ en: `Based on your birth nakshatra (${birthNak}) and today's nakshatra (${todayNak})`, hi: `आपके जन्म नक्षत्र (${birthNak}) और आज के नक्षत्र (${todayNak}) के आधार पर`, sa: `भवतः जन्मनक्षत्रस्य (${birthNak}) अद्यतननक्षत्रस्य (${todayNak}) च आधारेण`, ta: `உங்கள் ஜென்ம நட்சத்திரம் (${birthNak}) மற்றும் இன்றைய நட்சத்திரம் (${todayNak}) அடிப்படையில்`, te: `మీ జన్మ నక్షత్రం (${birthNak}) మరియు నేటి నక్షత్రం (${todayNak}) ఆధారంగా`, bn: `আপনার জন্ম নক্ষত্র (${birthNak}) এবং আজকের নক্ষত্র (${todayNak}) এর ভিত্তিতে`, kn: `ನಿಮ್ಮ ಜನ್ಮ ನಕ್ಷತ್ರ (${birthNak}) ಮತ್ತು ಇಂದಿನ ನಕ್ಷತ್ರ (${todayNak}) ಆಧಾರದ ಮೇಲೆ`, gu: `તમારા જન્મ નક્ષત્ર (${birthNak}) અને આજના નક્ષત્ર (${todayNak}) ના આધારે`, mai: `अहाँक जन्म नक्षत्र (${birthNak}) आ आइक नक्षत्र (${todayNak}) क आधार पर`, mr: `तुमच्या जन्म नक्षत्र (${birthNak}) आणि आजच्या नक्षत्र (${todayNak}) वर आधारित` }, locale)}
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
                  <span className={`font-bold text-sm ${style.text}`} style={bf}>{tl(m.activity, locale)}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${style.text} ${style.bg}`}>{tl(style.label, locale)}</span>
              </div>
              <div className="flex items-center gap-4 mb-2 text-xs">
                <span className="flex items-center gap-1">
                  {tl({ en: 'Tara', hi: 'तारा', sa: 'ताराः', ta: 'தாரா', te: 'తార', bn: 'তারা', kn: 'ತಾರಾ', gu: 'તારા', mai: 'तारा', mr: 'तारा' }, locale)}: {m.taraBala.favorable ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-red-400" />}
                  <span className="text-text-secondary">{m.taraBala.taraName}</span>
                </span>
                <span className="flex items-center gap-1">
                  {tl({ en: 'Chandra', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર', mai: 'चन्द्र', mr: 'चंद्र' }, locale)}: {m.chandraBala.favorable ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-red-400" />}
                  <span className="text-text-secondary">H{m.chandraBala.houseFromMoon}</span>
                </span>
              </div>
              <p className="text-text-secondary/70 text-xs" style={bf}>{tl(m.reason, locale)}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 text-xs text-text-secondary" style={bf}>
        <p className="text-gold-dark font-bold uppercase tracking-wider mb-2">{tl({ en: 'How this works', hi: 'यह कैसे काम करता है', sa: 'एतत् कथं कार्यते', ta: 'இது எப்படி வேலை செய்கிறது', te: 'ఇది ఎలా పని చేస్తుంది', bn: 'এটি কীভাবে কাজ করে', kn: 'ಇದು ಹೇಗೆ ಕಾರ್ಯ ನಿರ್ವಹಿಸುತ್ತದೆ', gu: 'આ કેવી રીતે કામ કરે છે', mai: 'ई कोना काज करैत अछि', mr: 'हे कसे कार्य करते' }, locale)}</p>
        <p>{tl({ en: 'Tara Bala compares your birth nakshatra with today\'s nakshatra (9-cycle). Chandra Bala checks today\'s Moon position relative to your birth Moon sign. Both favorable = Excellent. Both unfavorable = Avoid.', hi: 'तारा बल आपके जन्म नक्षत्र की तुलना आज के नक्षत्र से करता है (9 चक्र)। चन्द्र बल आज के चन्द्रमा की स्थिति की जाँच करता है। दोनों अनुकूल = उत्कृष्ट। दोनों प्रतिकूल = बचें।', sa: 'तारा बलं भवतः जन्मनक्षत्रस्य अद्यतननक्षत्रेण तुलनां करोति (9 चक्रम्)। चन्द्र बलम् अद्यतनचन्द्रस्थितिं परीक्षते। द्वयमपि शुभम् = उत्कृष्टम्। द्वयमपि अशुभम् = वर्जयतु।', ta: 'தாரா பலம் உங்கள் ஜென்ம நட்சத்திரத்தை இன்றைய நட்சத்திரத்துடன் ஒப்பிடுகிறது (9 சுழற்சி). சந்திர பலம் இன்றைய சந்திர நிலையை உங்கள் ஜென்ம ராசியுடன் ஒப்பிடுகிறது. இரண்டும் சாதகம் = சிறப்பு. இரண்டும் பாதகம் = தவிர்க்கவும்.', te: 'తారా బలం మీ జన్మ నక్షత్రాన్ని నేటి నక్షత్రంతో పోలుస్తుంది (9 చక్రం). చంద్ర బలం నేటి చంద్ర స్థానాన్ని మీ జన్మ రాశితో తనిఖీ చేస్తుంది. రెండూ అనుకూలం = అద్భుతం. రెండూ ప్రతికూలం = నివారించండి.', bn: 'তারা বল আপনার জন্ম নক্ষত্রকে আজকের নক্ষত্রের সাথে তুলনা করে (9 চক্র)। চন্দ্র বল আজকের চাঁদের অবস্থান পরীক্ষা করে। উভয় শুভ = চমৎকার। উভয় অশুভ = এড়িয়ে চলুন।', kn: 'ತಾರಾ ಬಲ ನಿಮ್ಮ ಜನ್ಮ ನಕ್ಷತ್ರವನ್ನು ಇಂದಿನ ನಕ್ಷತ್ರದೊಂದಿಗೆ ಹೋಲಿಸುತ್ತದೆ (9 ಚಕ್ರ). ಚಂದ್ರ ಬಲ ಇಂದಿನ ಚಂದ್ರನ ಸ್ಥಾನವನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ. ಎರಡೂ ಶುಭ = ಅತ್ಯುತ್ತಮ. ಎರಡೂ ಅಶುಭ = ತಪ್ಪಿಸಿ.', gu: 'તારા બળ તમારા જન્મ નક્ષત્રની આજના નક્ષત્ર સાથે તુલના કરે છે (9 ચક્ર). ચંદ્ર બળ આજની ચંદ્ર સ્થિતિ ચકાસે છે. બંને અનુકૂળ = ઉત્તમ. બંને પ્રતિકૂળ = ટાળો.', mai: 'तारा बल अहाँक जन्म नक्षत्रक आइक नक्षत्र सँ तुलना करैत अछि (9 चक्र)। चन्द्र बल आइक चन्द्रमाक स्थिति जाँच करैत अछि। दूनू अनुकूल = उत्कृष्ट। दूनू प्रतिकूल = बचू।', mr: 'तारा बल तुमच्या जन्म नक्षत्राची आजच्या नक्षत्राशी तुलना करते (9 चक्र). चंद्र बल आजच्या चंद्राची स्थिती तपासते. दोन्ही अनुकूल = उत्कृष्ट. दोन्ही प्रतिकूल = टाळा.' }, locale)}</p>
      </div>
    </div>
  );
}

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
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';

export default function ChartPage() {
  const locale = useLocale() as Locale;
  const hf = (isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = (isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-body)' } : {};
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
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-text-secondary">{tl({ en: 'Sign in to view your chart', hi: 'चार्ट देखने के लिए साइन इन करें', sa: 'चक्रं द्रष्टुं प्रवेशं करोतु', ta: 'உங்கள் விளக்கப்படத்தை பார்க்க உள்நுழையவும்', te: 'మీ చార్ట్ చూడటానికి సైన్ ఇన్ చేయండి', bn: 'আপনার চার্ট দেখতে সাইন ইন করুন', kn: 'ನಿಮ್ಮ ಚಾರ್ಟ್ ನೋಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ', gu: 'તમારો ચાર્ટ જોવા માટે સાઇન ઇન કરો', mai: 'चार्ट देखबाक लेल साइन इन करू', mr: 'चार्ट पाहण्यासाठी साइन इन करा' }, locale)}</p></div>;
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-primary border-t-transparent" /></div>;
  }

  if (!kundali) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><p className="text-text-secondary">{tl({ en: 'Complete your profile to see your birth chart', hi: 'जन्म कुण्डली देखने के लिए प्रोफ़ाइल पूरा करें', sa: 'जन्म-कुण्डलीं द्रष्टुं स्वप्रोफ़ाइलं पूरयतु', ta: 'உங்கள் ஜன்ம ஜாதகம் பார்க்க உங்கள் சுயவிவரத்தை பூர்த்தி செய்யுங்கள்', te: 'మీ జన్మ కుండలి చూడటానికి మీ ప్రొఫైల్ పూర్తి చేయండి', bn: 'আপনার জন্ম কুণ্ডলী দেখতে প্রোফাইল সম্পূর্ণ করুন', kn: 'ನಿಮ್ಮ ಜನ್ಮ ಕುಂಡಲಿ ನೋಡಲು ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ', gu: 'તમારી જન્મ કુંડળી જોવા માટે પ્રોફાઇલ પૂર્ણ કરો', mai: 'जन्म-कुण्डली देखबाक लेल अपन प्रोफ़ाइल पूरा करू', mr: 'जन्मकुंडली पाहण्यासाठी प्रोफाइल पूर्ण करा' }, locale)}</p><a href={`/${locale}/settings`} className="text-gold-primary text-sm mt-2 inline-block">{tl({ en: 'Go to Settings', hi: 'सेटिंग्स पर जाएँ', sa: 'सेटिंग्-पृष्ठं गच्छतु', ta: 'அமைப்புகளுக்கு செல்லுங்கள்', te: 'సెట్టింగ్‌లకు వెళ్ళండి', bn: 'সেটিংসে যান', kn: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳಿಗೆ ಹೋಗಿ', gu: 'સેટિંગ્સ પર જાઓ', mai: 'सेटिंग्स पर जाउ', mr: 'सेटिंग्जवर जा' }, locale)}</a></div>;
  }

  const ChartComponent = chartStyle === 'north' ? ChartNorth : ChartSouth;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <a href={`/${locale}/dashboard`} className="text-gold-primary text-sm hover:text-gold-light mb-6 inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" />{tl({ en: 'Dashboard', hi: 'डैशबोर्ड', sa: 'नियन्त्रण-पटलम्', ta: 'டாஷ்போர்டு', te: 'డాష్‌బోర్డ్', bn: 'ড্যাশবোর্ড', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', gu: 'ડેશબોર્ડ', mai: 'डैशबोर्ड', mr: 'डॅशबोर्ड' }, locale)}</a>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold mb-3" style={hf}><span className="text-gold-gradient">{tl({ en: 'Your Birth Chart', hi: 'आपकी जन्म कुण्डली', sa: 'तव जन्म-कुण्डली', ta: 'உங்கள் ஜன்ம ஜாதகம்', te: 'మీ జన్మ కుండలి', bn: 'আপনার জন্ম কুণ্ডলী', kn: 'ನಿಮ್ಮ ಜನ್ಮ ಕುಂಡಲಿ', gu: 'તમારી જન્મ કુંડળી', mai: 'अहाँक जन्म-कुण्डली', mr: 'तुमची जन्मकुंडली' }, locale)}</span></h1>
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
          <h3 className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-4">{tl({ en: 'Rashi (D1)', hi: 'राशि (D1)', sa: 'राशिः (D1)', ta: 'ராசி (D1)', te: 'రాశి (D1)', bn: 'রাশি (D1)', kn: 'ರಾಶಿ (D1)', gu: 'રાશિ (D1)', mai: 'राशि (D1)', mr: 'राशी (D1)' }, locale)}</h3>
          <ChartComponent data={kundali.chart} title="" />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6">
          <h3 className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-4">{tl({ en: 'Navamsha (D9)', hi: 'नवांश (D9)', sa: 'नवांशः (D9)', ta: 'நவாம்சம் (D9)', te: 'నవాంశ (D9)', bn: 'নবাংশ (D9)', kn: 'ನವಾಂಶ (D9)', gu: 'નવાંશ (D9)', mai: 'नवांश (D9)', mr: 'नवांश (D9)' }, locale)}</h3>
          <ChartComponent data={kundali.navamshaChart} title="" />
        </motion.div>
      </div>

      {/* Ascendant */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 mb-6 flex items-center gap-4">
        <RashiIconById id={kundali.ascendant.sign} size={40} />
        <div>
          <p className="text-gold-dark text-xs uppercase tracking-wider font-bold">{tl({ en: 'Ascendant (Lagna)', hi: 'लग्न', sa: 'लग्नम्', ta: 'லக்னம்', te: 'లగ్నం', bn: 'লগ্ন', kn: 'ಲಗ್ನ', gu: 'લગ્ન', mai: 'लग्न', mr: 'लग्न' }, locale)}</p>
          <p className="text-gold-light text-lg font-bold" style={hf}>{kundali.ascendant.signName[locale]} ({kundali.ascendant.degree.toFixed(2)}°)</p>
        </div>
      </div>

      {/* Planet table */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 overflow-x-auto">
        <h3 className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-4">{tl({ en: 'Planet Positions', hi: 'ग्रह स्थिति', sa: 'ग्रह-स्थितयः', ta: 'கிரக நிலைகள்', te: 'గ్రహ స్థానాలు', bn: 'গ্রহ অবস্থান', kn: 'ಗ್ರಹ ಸ್ಥಾನಗಳು', gu: 'ગ્રહ સ્થિતિ', mai: 'ग्रह स्थिति', mr: 'ग्रहांची स्थिती' }, locale)}</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-secondary border-b border-gold-primary/10 text-xs">
              <th className="text-left py-2 px-2">{tl({ en: 'Planet', hi: 'ग्रह', sa: 'ग्रहः', ta: 'கிரகம்', te: 'గ్రహం', bn: 'গ্রহ', kn: 'ಗ್ರಹ', gu: 'ગ્રહ', mai: 'ग्रह', mr: 'ग्रह' }, locale)}</th>
              <th className="text-left py-2 px-2">{tl({ en: 'Sign', hi: 'राशि', sa: 'राशिः', ta: 'ராசி', te: 'రాశి', bn: 'রাশি', kn: 'ರಾಶಿ', gu: 'રાશિ', mai: 'राशि', mr: 'राशी' }, locale)}</th>
              <th className="text-left py-2 px-2">{tl({ en: 'Degree', hi: 'अंश', sa: 'अंशः', ta: 'பாகை', te: 'అంశం', bn: 'ডিগ্রি', kn: 'ಅಂಶ', gu: 'અંશ', mai: 'अंश', mr: 'अंश' }, locale)}</th>
              <th className="text-left py-2 px-2">{tl({ en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्', ta: 'நட்சத்திரம்', te: 'నక్షత్రం', bn: 'নক্ষত্র', kn: 'ನಕ್ಷತ್ರ', gu: 'નક્ષત્ર', mai: 'नक्षत्र', mr: 'नक्षत्र' }, locale)}</th>
              <th className="text-center py-2 px-2">{tl({ en: 'House', hi: 'भाव', sa: 'भावः', ta: 'பாவம்', te: 'భావం', bn: 'ভাব', kn: 'ಭಾವ', gu: 'ભાવ', mai: 'भाव', mr: 'भाव' }, locale)}</th>
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
          {tl({ en: 'Generate detailed analysis with all tabs \u2192', hi: 'सभी टैब के साथ विस्तृत विश्लेषण \u2192', sa: 'सर्वैः टैबैः सह विस्तृतविश्लेषणम् \u2192', ta: 'அனைத்து தாவல்களுடன் விரிவான பகுப்பாய்வு \u2192', te: 'అన్ని ట్యాబ్‌లతో వివరణాత్మక విశ్లేషణ \u2192', bn: 'সমস্ত ট্যাবসহ বিস্তারিত বিশ্লেষণ \u2192', kn: 'ಎಲ್ಲಾ ಟ್ಯಾಬ್‌ಗಳೊಂದಿಗೆ ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆ \u2192', gu: 'બધા ટેબ સાથે વિગતવાર વિશ્લેષણ \u2192', mai: 'सभी टैब सँग विस्तृत विश्लेषण \u2192', mr: 'सर्व टॅबसह तपशीलवार विश्लेषण \u2192' }, locale)}
        </a>
      </div>
    </div>
  );
}

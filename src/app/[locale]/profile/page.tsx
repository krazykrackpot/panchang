'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Star, Moon, Sun, Sparkles, Shield, Settings, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import type { Locale } from '@/types/panchang';
import type { ChartData } from '@/types/kundali';

interface Trilingual { en: string; hi: string; sa: string }

interface SnapshotData {
  ascendant_sign: number;
  moon_sign: number;
  moon_nakshatra: number;
  moon_nakshatra_pada: number;
  sun_sign: number;
  chart_data: ChartData | null;
  sade_sati: {
    isActive: boolean;
    currentPhase: 'rising' | 'peak' | 'setting' | null;
    overallIntensity: number;
    cycleStart: string;
    cycleEnd: string;
    interpretation?: { summary?: Trilingual };
  } | null;
  moonRashiName: Trilingual | null;
  sunRashiName: Trilingual | null;
  lagnaRashiName: Trilingual | null;
  moonNakshatraName: Trilingual | null;
  moonNakshatraRuler: Trilingual | null;
  currentDasha: {
    maha: { planet: string; planetName: Trilingual; startDate: string; endDate: string };
    antar: { planet: string; planetName: Trilingual; startDate: string; endDate: string } | null;
  } | null;
  computed_at: string;
}

interface BirthPanchang {
  tithi: { number: number; name: Trilingual; paksha: string };
  yoga: { number: number; name: Trilingual; meaning: Trilingual };
  masa: { index: number; name: Trilingual };
}

interface ProfileInfo {
  display_name: string;
  date_of_birth: string;
  time_of_birth: string;
  birth_time_known: boolean;
  birth_place: string;
  chart_style: string;
}

const L = {
  en: {
    title: 'My Vedic Profile',
    backHome: 'Back to Home',
    lagna: 'Lagna (Ascendant)',
    chandraRashi: 'Chandra Rashi',
    suryaRashi: 'Surya Rashi',
    nakshatra: 'Birth Nakshatra',
    pada: 'Pada',
    tithi: 'Birth Tithi',
    paksha: 'Paksha',
    shukla: 'Shukla Paksha',
    krishna: 'Krishna Paksha',
    yoga: 'Birth Yoga',
    masa: 'Birth Masa (Hindu Month)',
    birthChart: 'Birth Chart (Rashi Kundali)',
    currentDasha: 'Current Dasha Period',
    mahaDasha: 'Maha Dasha',
    antarDasha: 'Antar Dasha',
    sadeSati: 'Sade Sati',
    sadeSatiActive: 'Currently Active',
    sadeSatiInactive: 'Not active currently',
    phase: 'Phase',
    rising: 'Rising (12th from Moon)',
    peak: 'Peak (Over Moon)',
    setting: 'Setting (2nd from Moon)',
    intensity: 'Intensity',
    dashaEnds: 'ends',
    birthDetails: 'Birth Details',
    born: 'Born',
    at: 'at',
    in: 'in',
    editProfile: 'Edit Profile & Settings',
    noBirthData: 'Your Vedic birth profile will appear here once you add your birth details.',
    addBirthData: 'Add Birth Details',
    notSignedIn: 'Sign in to view your Vedic profile.',
    signIn: 'Sign In',
  },
  hi: {
    title: 'मेरी वैदिक कुंडली',
    backHome: 'मुख्य पृष्ठ',
    lagna: 'लग्न',
    chandraRashi: 'चन्द्र राशि',
    suryaRashi: 'सूर्य राशि',
    nakshatra: 'जन्म नक्षत्र',
    pada: 'पाद',
    tithi: 'जन्म तिथि',
    paksha: 'पक्ष',
    shukla: 'शुक्ल पक्ष',
    krishna: 'कृष्ण पक्ष',
    yoga: 'जन्म योग',
    masa: 'जन्म मास (हिन्दू मास)',
    birthChart: 'जन्म कुंडली (राशि कुंडली)',
    currentDasha: 'वर्तमान दशा काल',
    mahaDasha: 'महा दशा',
    antarDasha: 'अन्तर दशा',
    sadeSati: 'साढ़े साती',
    sadeSatiActive: 'वर्तमान में सक्रिय',
    sadeSatiInactive: 'वर्तमान में सक्रिय नहीं',
    phase: 'चरण',
    rising: 'उदय (चन्द्र से 12वाँ)',
    peak: 'शिखर (चन्द्र पर)',
    setting: 'अस्त (चन्द्र से 2रा)',
    intensity: 'तीव्रता',
    dashaEnds: 'समाप्ति',
    birthDetails: 'जन्म विवरण',
    born: 'जन्म',
    at: 'समय',
    in: 'स्थान',
    editProfile: 'प्रोफ़ाइल और सेटिंग्स',
    noBirthData: 'जन्म विवरण जोड़ने पर आपकी वैदिक कुंडली यहाँ दिखेगी।',
    addBirthData: 'जन्म विवरण जोड़ें',
    notSignedIn: 'वैदिक प्रोफ़ाइल देखने के लिए साइन इन करें।',
    signIn: 'साइन इन',
  },
  sa: {
    title: 'मम वैदिककुण्डली',
    backHome: 'मुख्यपृष्ठम्',
    lagna: 'लग्नम्',
    chandraRashi: 'चन्द्रराशिः',
    suryaRashi: 'सूर्यराशिः',
    nakshatra: 'जन्मनक्षत्रम्',
    pada: 'पादः',
    tithi: 'जन्मतिथिः',
    paksha: 'पक्षः',
    shukla: 'शुक्लपक्षः',
    krishna: 'कृष्णपक्षः',
    yoga: 'जन्मयोगः',
    masa: 'जन्ममासः (हिन्दुमासः)',
    birthChart: 'जन्मकुण्डली (राशिकुण्डली)',
    currentDasha: 'वर्तमानदशाकालः',
    mahaDasha: 'महादशा',
    antarDasha: 'अन्तर्दशा',
    sadeSati: 'साढ़ेसाती',
    sadeSatiActive: 'सक्रिया अस्ति',
    sadeSatiInactive: 'सक्रिया नास्ति',
    phase: 'चरणम्',
    rising: 'उदयः',
    peak: 'शिखरम्',
    setting: 'अस्तम्',
    intensity: 'तीव्रता',
    dashaEnds: 'समाप्तिः',
    birthDetails: 'जन्मविवरणम्',
    born: 'जन्म',
    at: 'समये',
    in: 'स्थाने',
    editProfile: 'सम्पादनम् तथा सेटिंग्स',
    noBirthData: 'जन्मविवरणं योजयित्वा भवतः वैदिककुण्डली अत्र दृश्यते।',
    addBirthData: 'जन्मविवरणं योजयतु',
    notSignedIn: 'वैदिकप्रोफ़ाइलदर्शनाय प्रवेशः आवश्यकः।',
    signIn: 'प्रवेशः',
  },
};

export default function ProfilePage() {
  const locale = useLocale() as Locale;
  const T = L[locale] || L.en;
  const { user, initialized } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<SnapshotData | null>(null);
  const [birthPanchang, setBirthPanchang] = useState<BirthPanchang | null>(null);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);

  const fetchProfile = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) { setLoading(false); return; }
    try {
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.snapshot) setSnapshot(data.snapshot);
        if (data.birthPanchang) setBirthPanchang(data.birthPanchang);
        if (data.profile) setProfileInfo({
          display_name: data.profile.display_name || '',
          date_of_birth: data.profile.date_of_birth || '',
          time_of_birth: data.profile.time_of_birth || '',
          birth_time_known: data.profile.birth_time_known ?? true,
          birth_place: data.profile.birth_place || '',
          chart_style: data.profile.chart_style || 'north',
        });
      }
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!initialized || !user) { setLoading(false); return; }
    fetchProfile();
  }, [initialized, user, fetchProfile]);

  if (!initialized) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <User className="w-12 h-12 text-gold-primary mx-auto" />
          <p className="text-text-secondary text-lg">{T.notSignedIn}</p>
          <a href={`/${locale}`} className="inline-block px-6 py-2 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-xl hover:shadow-lg hover:shadow-gold-primary/20 transition-all">
            {T.signIn}
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
      </div>
    );
  }

  const formatDate = (d: string) => {
    if (!d) return '';
    return new Date(d + 'T00:00:00').toLocaleDateString(locale === 'en' ? 'en-IN' : 'hi-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const hasData = snapshot && profileInfo?.date_of_birth;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <a href={`/${locale}`} className="text-sm text-text-secondary hover:text-gold-light transition-colors">
            &larr; {T.backHome}
          </a>
          <h1 className="text-3xl font-bold mt-2 bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark bg-clip-text text-transparent">
            {T.title}
          </h1>
        </motion.div>

        <AnimatePresence>
          {hasData ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Birth Details Summary */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="px-5 py-4 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-widest text-text-secondary mb-1">{T.birthDetails}</p>
                <p className="text-text-primary text-sm">
                  <span className="text-gold-light font-semibold">{profileInfo?.display_name}</span>
                  {profileInfo?.date_of_birth && <> &mdash; {T.born} {formatDate(profileInfo.date_of_birth)}</>}
                  {profileInfo?.time_of_birth && profileInfo?.birth_time_known && <>, {T.at} {profileInfo.time_of_birth}</>}
                  {profileInfo?.birth_place && <>, {T.in} {profileInfo.birth_place}</>}
                </p>
              </motion.div>

              {/* Sade Sati Banner */}
              {snapshot.sade_sati?.isActive && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-500/12 via-orange-500/8 to-red-500/12 border border-amber-500/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-amber-300">{T.sadeSati} &mdash; {T.sadeSatiActive}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                        <span>{T.phase}: <span className="text-amber-400 font-medium">
                          {snapshot.sade_sati.currentPhase === 'rising' ? T.rising :
                           snapshot.sade_sati.currentPhase === 'peak' ? T.peak : T.setting}
                        </span></span>
                        <span>{T.intensity}: <span className="text-amber-400 font-medium">
                          {Math.round(snapshot.sade_sati.overallIntensity * 10) / 10}/10
                        </span></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Rashi Grid — 3 columns */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="grid grid-cols-3 gap-3"
              >
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 backdrop-blur-sm">
                  <div className="flex justify-center mb-2"><RashiIconById id={snapshot.ascendant_sign} size={40} /></div>
                  <p className="text-xs uppercase tracking-widest text-text-secondary mb-0.5">{T.lagna}</p>
                  <p className="text-base font-bold text-gold-light">{snapshot.lagnaRashiName?.[locale] || snapshot.lagnaRashiName?.en}</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 backdrop-blur-sm">
                  <div className="flex justify-center mb-2"><RashiIconById id={snapshot.moon_sign} size={40} /></div>
                  <p className="text-xs uppercase tracking-widest text-text-secondary mb-0.5">{T.chandraRashi}</p>
                  <p className="text-base font-bold text-gold-light">{snapshot.moonRashiName?.[locale] || snapshot.moonRashiName?.en}</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 backdrop-blur-sm">
                  <div className="flex justify-center mb-2"><RashiIconById id={snapshot.sun_sign} size={40} /></div>
                  <p className="text-xs uppercase tracking-widest text-text-secondary mb-0.5">{T.suryaRashi}</p>
                  <p className="text-base font-bold text-gold-light">{snapshot.sunRashiName?.[locale] || snapshot.sunRashiName?.en}</p>
                </div>
              </motion.div>

              {/* Birth Panchang — Tithi, Nakshatra, Yoga, Masa */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-3"
              >
                {/* Birth Nakshatra */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 flex items-center gap-3">
                  <NakshatraIconById id={snapshot.moon_nakshatra} size={36} />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-text-secondary">{T.nakshatra}</p>
                    <p className="text-base font-bold text-gold-light">{snapshot.moonNakshatraName?.[locale] || snapshot.moonNakshatraName?.en}</p>
                    <p className="text-xs text-text-secondary">{T.pada} {snapshot.moon_nakshatra_pada}</p>
                  </div>
                </div>

                {/* Birth Tithi */}
                {birthPanchang?.tithi ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 flex items-center gap-3">
                    <Moon className="w-9 h-9 text-gold-primary/60 shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-text-secondary">{T.tithi}</p>
                      <p className="text-base font-bold text-gold-light">{birthPanchang.tithi.name?.[locale] || birthPanchang.tithi.name?.en}</p>
                      <p className="text-xs text-text-secondary">{birthPanchang.tithi.paksha === 'shukla' ? T.shukla : T.krishna}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 flex items-center gap-3">
                    <Moon className="w-9 h-9 text-gold-primary/30 shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-text-secondary">{T.tithi}</p>
                      <p className="text-sm text-text-secondary/70">&mdash;</p>
                    </div>
                  </div>
                )}

                {/* Birth Yoga */}
                {birthPanchang?.yoga && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 flex items-center gap-3">
                    <Star className="w-9 h-9 text-gold-primary/60 shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-text-secondary">{T.yoga}</p>
                      <p className="text-base font-bold text-gold-light">{birthPanchang.yoga.name?.[locale] || birthPanchang.yoga.name?.en}</p>
                      <p className="text-xs text-text-secondary">{birthPanchang.yoga.meaning?.[locale] || birthPanchang.yoga.meaning?.en}</p>
                    </div>
                  </div>
                )}

                {/* Birth Masa */}
                {birthPanchang?.masa && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 flex items-center gap-3">
                    <Sun className="w-9 h-9 text-gold-primary/60 shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-widest text-text-secondary">{T.masa}</p>
                      <p className="text-base font-bold text-gold-light">{birthPanchang.masa.name?.[locale] || birthPanchang.masa.name?.en}</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Current Dasha */}
              {snapshot.currentDasha && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 backdrop-blur-sm"
                >
                  <h3 className="text-xs uppercase tracking-widest text-text-secondary mb-4">{T.currentDasha}</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wider text-text-secondary/75">{T.mahaDasha}</p>
                      <p className="text-2xl font-bold text-gold-light">{snapshot.currentDasha.maha.planetName?.[locale] || snapshot.currentDasha.maha.planet}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {T.dashaEnds} {new Date(snapshot.currentDasha.maha.endDate).toLocaleDateString(locale === 'en' ? 'en-IN' : 'hi-IN', { year: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    {snapshot.currentDasha.antar && (
                      <>
                        <div className="w-px h-14 bg-gold-primary/15" />
                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-wider text-text-secondary/75">{T.antarDasha}</p>
                          <p className="text-2xl font-bold text-gold-light">{snapshot.currentDasha.antar.planetName?.[locale] || snapshot.currentDasha.antar.planet}</p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {T.dashaEnds} {new Date(snapshot.currentDasha.antar.endDate).toLocaleDateString(locale === 'en' ? 'en-IN' : 'hi-IN', { year: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Birth Chart */}
              {snapshot.chart_data && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 backdrop-blur-sm overflow-hidden"
                >
                  <div className="px-5 pt-4">
                    <h3 className="text-xs uppercase tracking-widest text-text-secondary">{T.birthChart}</h3>
                  </div>
                  <div className="flex justify-center py-4">
                    {profileInfo?.chart_style === 'south' ? (
                      <ChartSouth data={snapshot.chart_data} title="" size={300} />
                    ) : (
                      <ChartNorth data={snapshot.chart_data} title="" size={300} />
                    )}
                  </div>
                </motion.div>
              )}

              {/* Edit Settings Link */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <a
                  href={`/${locale}/settings`}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all text-sm font-medium"
                >
                  <Settings className="w-4 h-4" />
                  {T.editProfile}
                </a>
              </motion.div>
            </motion.div>
          ) : (
            /* No birth data state */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 px-6 rounded-2xl border border-dashed border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27]"
            >
              <Sparkles className="w-12 h-12 text-gold-primary/30 mx-auto mb-4" />
              <p className="text-lg text-text-secondary mb-4">{T.noBirthData}</p>
              <a
                href={`/${locale}/settings`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-xl hover:shadow-lg hover:shadow-gold-primary/20 transition-all"
              >
                <Settings className="w-4 h-4" />
                {T.addBirthData}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

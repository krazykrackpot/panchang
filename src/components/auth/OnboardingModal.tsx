'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import LocationSearch from '@/components/ui/LocationSearch';
import { getSupabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { usePersonaMode } from '@/lib/persona/context';
import { dbToPersonaMode } from '@/lib/persona/types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  userName?: string;
  userEmail?: string;
}

const LABELS = {
  en: {
    title: 'Welcome to Dekho Panchang!',
    subtitle: 'Tell us about yourself for personalized predictions',
    helpText: 'This helps us personalize your Panchang, Kundali, and Sade Sati analysis',
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your full name',
    dobLabel: 'Date of Birth',
    tobLabel: 'Time of Birth',
    tobHint: 'Approximate time is okay',
    pobLabel: 'Place of Birth',
    pobPlaceholder: 'Search your birth city...',
    submit: 'Continue',
    saving: 'Saving...',
    skip: 'Skip for now',
    skipHint: 'You can add birth details later in Settings',
    errorName: 'Please enter your name',
    errorPlace: 'Please select a birth place from the suggestions',
    errorNameMin: 'Please enter at least your name',
    levelLabel: 'Your Astrology Experience',
    levelBeginner: 'Beginner',
    levelBeginnerDesc: 'New to Vedic astrology — show me the essentials',
    levelIntermediate: 'Intermediate',
    levelIntermediateDesc: 'I know my signs and dashas — show me more detail',
    levelAdvanced: 'Advanced',
    levelAdvancedDesc: 'I read charts — give me everything',
    accountTypeLabel: 'What brings you here?',
    accountTypeSeeker: 'For my own guidance',
    accountTypeSeekerDesc: 'I want personal panchang, kundali, and predictions',
    accountTypePandit: "I'm a practising astrologer",
    accountTypePanditDesc: 'I consult clients — give me the Pandit workspace',
  },
  hi: {
    title: 'देखो पंचांग में आपका स्वागत है!',
    subtitle: 'व्यक्तिगत भविष्यवाणियों के लिए अपने बारे में बताएं',
    helpText: 'यह आपके पंचांग, कुंडली और साढ़े साती विश्लेषण को वैयक्तिकृत करने में मदद करता है',
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'अपना पूरा नाम दर्ज करें',
    dobLabel: 'जन्म तिथि',
    tobLabel: 'जन्म समय',
    tobHint: 'अनुमानित समय भी ठीक है',
    pobLabel: 'जन्म स्थान',
    pobPlaceholder: 'अपना जन्म शहर खोजें...',
    submit: 'जारी रखें',
    saving: 'सहेज रहे हैं...',
    skip: 'अभी छोड़ें',
    skipHint: 'जन्म विवरण बाद में सेटिंग्स में जोड़ सकते हैं',
    errorName: 'कृपया अपना नाम दर्ज करें',
    errorPlace: 'कृपया सुझावों से जन्म स्थान चुनें',
    errorNameMin: 'कृपया कम से कम अपना नाम दर्ज करें',
    levelLabel: 'ज्योतिष अनुभव',
    levelBeginner: 'शुरुआती',
    levelBeginnerDesc: 'वैदिक ज्योतिष में नया — मुझे मूल बातें दिखाएं',
    levelIntermediate: 'मध्यम',
    levelIntermediateDesc: 'राशि और दशा जानता हूं — और विस्तार दिखाएं',
    levelAdvanced: 'उन्नत',
    levelAdvancedDesc: 'मैं कुंडली पढ़ता हूं — सब कुछ दिखाएं',
    accountTypeLabel: 'आप यहाँ क्यों आए हैं?',
    accountTypeSeeker: 'अपने मार्गदर्शन के लिए',
    accountTypeSeekerDesc: 'मुझे व्यक्तिगत पंचांग, कुंडली, और भविष्यवाणियाँ चाहिए',
    accountTypePandit: 'मैं एक अभ्यासी ज्योतिषी हूँ',
    accountTypePanditDesc: 'मैं ग्राहकों से परामर्श करता हूँ — पंडित वर्कस्पेस दीजिए',
  },
  sa: {
    title: 'देखो पञ्चाङ्गे स्वागतम्!',
    subtitle: 'व्यक्तिगतभविष्यवाण्यर्थं स्वविषये वदतु',
    helpText: 'एतत् भवतः पञ्चाङ्ग-कुण्डली-साढेसाती-विश्लेषणं वैयक्तिकीकर्तुं साहाय्यं करोति',
    nameLabel: 'पूर्णनाम',
    namePlaceholder: 'स्वस्य पूर्णनाम लिखतु',
    dobLabel: 'जन्मतिथिः',
    tobLabel: 'जन्मसमयः',
    tobHint: 'अनुमानितसमयः अपि स्वीकार्यः',
    pobLabel: 'जन्मस्थानम्',
    pobPlaceholder: 'स्वजन्मनगरं अन्विष्यतु...',
    submit: 'अग्रे गच्छतु',
    saving: 'सञ्चिनोति...',
    skip: 'अधुना त्यजतु',
    skipHint: 'जन्मविवरणं पश्चात् सेटिंग्स मध्ये योजयितुं शक्यते',
    errorName: 'कृपया स्वनाम लिखतु',
    errorPlace: 'कृपया सुझावों से जन्म स्थान चुनें',
    errorNameMin: 'कृपया न्यूनतम स्वनाम लिखतु',
    levelLabel: 'ज्योतिषानुभवः',
    levelBeginner: 'आरम्भकः',
    levelBeginnerDesc: 'वैदिकज्योतिषे नवः — मूलतत्त्वानि दर्शयतु',
    levelIntermediate: 'मध्यमः',
    levelIntermediateDesc: 'राशिदशाज्ञानम् अस्ति — अधिकं दर्शयतु',
    levelAdvanced: 'उन्नतः',
    levelAdvancedDesc: 'कुण्डलीं पठामि — सर्वं दर्शयतु',
    accountTypeLabel: 'भवान् किमर्थम् आगतः?',
    accountTypeSeeker: 'स्वमार्गदर्शनार्थम्',
    accountTypeSeekerDesc: 'मम पञ्चाङ्गं कुण्डली च भविष्यफलं इष्यते',
    accountTypePandit: 'अहं अभ्यासी ज्योतिषी अस्मि',
    accountTypePanditDesc: 'अहं जजमानेभ्यः परामर्शं ददामि — पण्डितकार्यस्थानं देयम्',
  },
};

export default function OnboardingModal({ isOpen, onComplete, userName, userEmail }: OnboardingModalProps) {
  const locale = useLocale();
  const labelsKey = isDevanagariLocale(locale) ? (locale === 'sa' ? 'sa' : 'hi') : 'en';
  const L = LABELS[labelsKey];
  const { user } = useAuthStore();
  const { setMode: setPersonaMode } = usePersonaMode();

  const [fullName, setFullName] = useState(userName || '');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthLocation, setBirthLocation] = useState<{ lat: number; lng: number; name: string; timezone: string } | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [accountType, setAccountType] = useState<'seeker' | 'pandit'>('seeker');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [mounted, setMounted] = useState(false);
  const portalRef = useRef<HTMLElement | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Round 2 UI-12 — keyboard close. Previously the modal could only be
  // dismissed by mouse-clicking "Skip for now"; keyboard-only users
  // (screen readers, low-vision, motor-impaired) were trapped. Escape
  // is the standard dialog dismissal key — calls onComplete (parent
  // hides the modal). The Skip button does an async save first; Escape
  // is a pure dismissal that leaves the user state untouched, which
  // matches user expectations for modal Esc semantics.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onComplete();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onComplete]);

  useEffect(() => {
    portalRef.current = document.body;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (userName && !fullName) setFullName(userName);
  }, [userName, fullName]);

  if (!isOpen || !mounted) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError(L.errorName);
      return;
    }
    // DOB and POB are optional  –  user can skip
    if (birthDate && !birthLocation) {
      setError(L.errorPlace);
      return;
    }

    setSaving(true);

    try {
      const supabase = getSupabase();
      if (!supabase || !user) {
        setError('Authentication not available. Please try again.');
        setSaving(false);
        return;
      }

      // Build profile data  –  birth fields only if provided
      const profileData: Record<string, unknown> = {
        id: user.id,
        display_name: fullName.trim(),
        experience_level: experienceLevel,
        account_type: accountType,
        onboarding_completed: true,
      };

      if (birthDate && birthLocation) {
        profileData.default_location = {
          lat: birthLocation.lat,
          lng: birthLocation.lng,
          name: birthLocation.name,
          timezone: birthLocation.timezone,
          birth_date: birthDate,
          birth_time: birthTime || null,
        };
        profileData.date_of_birth = birthDate;
        profileData.time_of_birth = birthTime || null;
        profileData.birth_time_known = !!birthTime;
        profileData.birth_place = birthLocation.name;
        profileData.birth_lat = birthLocation.lat;
        profileData.birth_lng = birthLocation.lng;
        profileData.birth_timezone = birthLocation.timezone || '';
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }

      // Compute kundali snapshot via API  –  only if birth data provided
      if (birthDate && birthLocation) {
        try {
          const session = await supabase.auth.getSession();
          const token = session.data.session?.access_token;
          if (token) {
            await fetch('/api/user/profile', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: fullName.trim(),
                dateOfBirth: birthDate,
                timeOfBirth: birthTime || '12:00',
                birthTimeKnown: !!birthTime,
                birthPlace: birthLocation.name,
                birthLat: birthLocation.lat,
                birthLng: birthLocation.lng,
                birthTimezone: birthLocation.timezone || '',
              }),
            });
          }
        } catch (snapshotErr) {
          console.error('[OnboardingModal] kundali snapshot failed (non-critical):', snapshotErr);
        }
      }

      // Also persist to localStorage for offline access
      try {
        localStorage.setItem('panchang_onboarding', JSON.stringify({
          name: fullName.trim(),
          birth_date: birthDate,
          birth_time: birthTime,
          location: birthLocation,
        }));
        // Sync kundali view mode with experience level (legacy key,
        // used by /kundali's own toggle).
        localStorage.setItem('kundali-view-mode', experienceLevel === 'advanced' ? 'expert' : 'simple');
      } catch (storageErr) {
        console.error('[OnboardingModal] localStorage persist failed:', storageErr);
      }

      // Sync the sitewide persona-mode context so tone-aware surfaces
      // (Daily Briefing, /matching verdict, /sade-sati intro) reflect
      // the user's choice immediately on the next page load. setMode()
      // writes the dp-persona-mode cookie + localStorage.
      setPersonaMode(dbToPersonaMode(experienceLevel));

      // Invalidate the shared birth-data status cache so any mounted
      // BirthDetailsBanner / SadhakaBanner re-fetches and picks up the
      // new state immediately. Without this the banner can hang around
      // for the rest of the session even after the user just filled in
      // birth details. Lazy import to avoid pulling the hook module
      // into the modal's lazy bundle until save time.
      try {
        const { invalidateBirthDataStatus } = await import('@/hooks/useBirthDataStatus');
        invalidateBirthDataStatus(user.id);
      } catch (cacheErr) {
        // Cache invalidation failure is non-critical — at worst the
        // banner reappears once and disappears on next page load.
        console.error('[OnboardingModal] birth-data cache invalidate failed (non-critical):', cacheErr);
      }

      onComplete();
    } catch (err) {
      console.error('[OnboardingModal] submit failed:', err);
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  }

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-16 sm:pt-20 overflow-y-auto">
      {/* Backdrop  –  not dismissable */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8">
        <h2
          className="text-2xl font-bold text-gold-gradient mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {L.title}
        </h2>
        <p className="text-text-secondary text-sm mb-1">{L.subtitle}</p>
        <p className="text-text-secondary/70 text-xs mb-6">{L.helpText}</p>

        {userEmail && (
          <div className="mb-5 px-3 py-2 bg-bg-secondary/30 rounded-lg border border-gold-primary/10">
            <p className="text-text-secondary text-xs truncate">{userEmail}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-text-secondary text-xs font-medium mb-1.5">{L.nameLabel}</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={L.namePlaceholder}
              required
              className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary placeholder:text-text-secondary/70 focus:border-gold-primary/40 focus:outline-none text-sm"
            />
          </div>

          {/* Account type — workspace identity (orthogonal to experience level).
              Default 'seeker' keeps the consumer dashboard; 'pandit' switches
              to the Pandit CRM workspace. Pandit CRM P1 + spec §2. */}
          <div>
            <label className="block text-text-secondary text-xs font-medium mb-2">{L.accountTypeLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              {(['seeker', 'pandit'] as const).map((type) => {
                const labels = {
                  seeker: { name: L.accountTypeSeeker, desc: L.accountTypeSeekerDesc },
                  pandit: { name: L.accountTypePandit, desc: L.accountTypePanditDesc },
                };
                const a = labels[type];
                const isSelected = accountType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type)}
                    className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all duration-200 ${
                      isSelected
                        ? type === 'pandit'
                          ? 'border-[color:var(--color-pandit-violet-light)]/60 bg-[color:var(--color-pandit-violet)]/15 text-white'
                          : 'border-gold-primary/50 bg-gold-primary/10 text-gold-light'
                        : 'border-gold-primary/10 bg-bg-secondary/30 text-text-secondary hover:border-gold-primary/25 hover:bg-gold-primary/5'
                    }`}
                  >
                    <span className="text-sm font-semibold">{a.name}</span>
                    <span className="text-[11px] leading-tight opacity-70">{a.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-text-secondary text-xs font-medium mb-2">{L.levelLabel}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
                const labels = {
                  beginner: { name: L.levelBeginner, desc: L.levelBeginnerDesc, icon: '✦' },
                  intermediate: { name: L.levelIntermediate, desc: L.levelIntermediateDesc, icon: '✦✦' },
                  advanced: { name: L.levelAdvanced, desc: L.levelAdvancedDesc, icon: '✦✦✦' },
                };
                const l = labels[level];
                const isSelected = experienceLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExperienceLevel(level)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all duration-200 ${
                      isSelected
                        ? 'border-gold-primary/50 bg-gold-primary/10 text-gold-light'
                        : 'border-gold-primary/10 bg-bg-secondary/30 text-text-secondary hover:border-gold-primary/25 hover:bg-gold-primary/5'
                    }`}
                  >
                    <span className="text-xs opacity-60">{l.icon}</span>
                    <span className="text-sm font-semibold">{l.name}</span>
                    <span className="text-[10px] leading-tight opacity-70">{l.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-text-secondary text-xs font-medium mb-1.5">{L.dobLabel}</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary focus:border-gold-primary/40 focus:outline-none text-sm [color-scheme:dark]"
            />
          </div>

          {/* Time of Birth */}
          <div>
            <label className="block text-text-secondary text-xs font-medium mb-1.5">
              {L.tobLabel}
              <span className="ml-2 text-text-secondary/70 font-normal">({L.tobHint})</span>
            </label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary focus:border-gold-primary/40 focus:outline-none text-sm [color-scheme:dark]"
            />
          </div>

          {/* Place of Birth */}
          <div>
            <label className="block text-text-secondary text-xs font-medium mb-1.5">{L.pobLabel}</label>
            <LocationSearch
              value={birthPlace}
              onSelect={(loc) => {
                setBirthPlace(loc.name);
                setBirthLocation(loc);
              }}
              placeholder={L.pobPlaceholder}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-xl hover:from-gold-primary hover:to-gold-light transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {L.saving}
              </>
            ) : (
              L.submit
            )}
          </button>

          {/* Skip button */}
          <button
            type="button"
            onClick={async () => {
              if (!fullName.trim()) {
                setError(L.errorNameMin);
                return;
              }
              setSaving(true);
              try {
                const supabase = getSupabase();
                if (supabase && user) {
                  // Skip path: persist name + level so we don't lose them, but
                  // leave onboarding_completed FALSE so the modal re-opens next
                  // session and the dashboard progress bar keeps nudging. We
                  // only mark onboarding complete when birth details are saved
                  // (submit path, line ~167).
                  await supabase.from('user_profiles').upsert({
                    id: user.id,
                    display_name: fullName.trim(),
                    experience_level: experienceLevel,
                    onboarding_completed: false,
                  }, { onConflict: 'id' });
                  try {
                    localStorage.setItem('kundali-view-mode', experienceLevel === 'advanced' ? 'expert' : 'simple');
                  } catch (lsErr) {
                    console.error('[OnboardingModal] localStorage set failed:', lsErr);
                  }
                  // Mirror the same persona-context sync as the
                  // submit path so the skip experience is consistent
                  // sitewide. setMode writes cookie + localStorage.
                  setPersonaMode(dbToPersonaMode(experienceLevel));
                }
                onComplete();
              } catch (skipErr) {
                console.error('[OnboardingModal] skip save failed:', skipErr);
                setSaving(false);
                setError('Save failed. Please try again.');
              }
            }}
            disabled={saving}
            className="w-full py-2.5 text-text-secondary/75 text-sm hover:text-text-secondary transition-colors"
          >
            {L.skip}
          </button>
          <p className="text-text-secondary/55 text-xs text-center">{L.skipHint}</p>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, portalRef.current!);
}

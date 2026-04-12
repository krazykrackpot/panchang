'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import LocationSearch from '@/components/ui/LocationSearch';
import { getSupabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

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
  },
};

export default function OnboardingModal({ isOpen, onComplete, userName, userEmail }: OnboardingModalProps) {
  const locale = useLocale();
  const labelsKey = isDevanagariLocale(locale) ? (locale === 'sa' ? 'sa' : 'hi') : 'en';
  const L = LABELS[labelsKey];
  const { user } = useAuthStore();

  const [fullName, setFullName] = useState(userName || '');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthLocation, setBirthLocation] = useState<{ lat: number; lng: number; name: string; timezone: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [mounted, setMounted] = useState(false);
  const portalRef = useRef<HTMLElement | null>(null);

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
      setError(!isDevanagariLocale(locale) ? 'Please enter your name' : 'कृपया अपना नाम दर्ज करें');
      return;
    }
    // DOB and POB are optional — user can skip
    if (birthDate && !birthLocation) {
      setError(!isDevanagariLocale(locale) ? 'Please select a birth place from the suggestions' : 'कृपया सुझावों से जन्म स्थान चुनें');
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

      // Build profile data — birth fields only if provided
      const profileData: Record<string, unknown> = {
        id: user.id,
        display_name: fullName.trim(),
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

      // Compute kundali snapshot via API — only if birth data provided
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
        } catch { /* snapshot is best-effort; profile already saved */ }
      }

      // Also persist to localStorage for offline access
      try {
        localStorage.setItem('panchang_onboarding', JSON.stringify({
          name: fullName.trim(),
          birth_date: birthDate,
          birth_time: birthTime,
          location: birthLocation,
        }));
      } catch { /* ignore */ }

      onComplete();
    } catch {
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  }

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-16 sm:pt-20 overflow-y-auto">
      {/* Backdrop — not dismissable */}
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
                setError(!isDevanagariLocale(locale) ? 'Please enter at least your name' : 'कृपया कम से कम अपना नाम दर्ज करें');
                return;
              }
              setSaving(true);
              try {
                const supabase = getSupabase();
                if (supabase && user) {
                  await supabase.from('user_profiles').upsert({
                    id: user.id,
                    display_name: fullName.trim(),
                  }, { onConflict: 'id' });
                }
                onComplete();
              } catch {
                onComplete();
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

'use client';

/**
 * In-app NPS modal. Mounted globally in /dashboard/layout.tsx.
 *
 * Why this exists: Resend reports 96% delivery of NPS emails but our
 * audit log shows ~1.3% click-through — Gmail dumps the message in
 * Promotions and nobody scrolls there. This modal catches signed-in
 * users who have been past the 7-day email window and still haven't
 * scored us.
 *
 * Eligibility is decided server-side at /api/feedback/nps-inapp (GET).
 * The client only triggers the visible UI; it never asserts eligibility
 * itself. A separate POST records `submit` (with a score) or `dismiss`
 * (no score) — both flip `user_profiles.nps_modal_shown_at` so the
 * modal cannot recur for the same user.
 *
 * UX rules:
 *   - Don't pop instantly — wait 4s after dashboard mount so a casual
 *     "open dashboard → look at my chart" interaction isn't interrupted.
 *   - Optimistic dismiss: hide the UI immediately, mark shown in the
 *     background. The user shouldn't see the modal twice if the network
 *     is slow.
 *   - sessionStorage cooldown: even if the user reloads before the
 *     server-side `nps_modal_shown_at` write lands, the modal won't
 *     reappear this session.
 */

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';

type Phase = 'hidden' | 'asking_score' | 'asking_reason' | 'submitting' | 'thanks';

const MOUNT_DELAY_MS = 4000;
const COOLDOWN_KEY = 'dekho-nps-inapp-cooldown';

interface Labels {
  title: string;
  question: string;
  notLikely: string;
  veryLikely: string;
  reasonPrompt: string;
  reasonPlaceholder: string;
  skipReason: string;
  submit: string;
  notNow: string;
  thanks: string;
  // Surfaced via alert() when the submit POST fails. Kept as a native
  // alert because the modal is dismissing / mid-transition at that
  // point and a real UI banner would disappear before the user reads
  // it. PR #732 Gemini review.
  submitError: string;
}

const LABELS: Record<string, Labels> = {
  en: {
    title: 'Quick favour?',
    question: 'How likely are you to recommend Dekho Panchang to a friend?',
    notLikely: 'Not at all',
    veryLikely: 'Extremely',
    reasonPrompt: "Anything you'd like to share about why?",
    reasonPlaceholder: 'Optional — but I read every reply.',
    skipReason: 'Skip',
    submit: 'Send',
    notNow: 'Not now',
    thanks: 'Thank you  –  this really helps.',
    submitError: 'Sorry, sending your feedback failed. Please try again.',
  },
  hi: {
    title: 'एक छोटा निवेदन?',
    question: 'देखो पंचांग को किसी मित्र को सुझाने की कितनी संभावना है?',
    notLikely: 'बिल्कुल नहीं',
    veryLikely: 'अवश्य',
    reasonPrompt: 'क्या आप कुछ कारण साझा करना चाहेंगे?',
    reasonPlaceholder: 'वैकल्पिक — पर मैं हर उत्तर पढ़ता हूँ।',
    skipReason: 'छोड़ें',
    submit: 'भेजें',
    notNow: 'अभी नहीं',
    thanks: 'धन्यवाद  –  यह बहुत सहायक है।',
    submitError: 'माफ करें, आपका उत्तर भेजने में समस्या हुई। कृपया फिर से प्रयास करें।',
  },
  ta: {
    title: 'ஒரு சிறு உதவி?',
    question: 'நண்பர்களுக்கு தேகோ பஞ்சாங் பரிந்துரைக்கும் வாய்ப்பு எவ்வளவு?',
    notLikely: 'இல்லவே இல்லை',
    veryLikely: 'நிச்சயமாக',
    reasonPrompt: 'ஏன் என்பதைப் பற்றி பகிர விரும்புகிறீர்களா?',
    reasonPlaceholder: 'விருப்பமானது — ஆனால் ஒவ்வொரு பதிலையும் நான் படிக்கிறேன்.',
    skipReason: 'தவிர்',
    submit: 'அனுப்பு',
    notNow: 'இப்போது வேண்டாம்',
    thanks: 'நன்றி  –  இது மிகவும் உதவுகிறது.',
    submitError: 'மன்னிக்கவும், உங்கள் பதிலை அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  },
  te: {
    title: 'ఒక చిన్న అభ్యర్థన?',
    question: 'దేఖో పంచాంగ్‌ను స్నేహితులకు సిఫారసు చేసే అవకాశం ఎంత?',
    notLikely: 'అస్సలు కాదు',
    veryLikely: 'తప్పకుండా',
    reasonPrompt: 'ఎందుకో పంచుకోవాలనుకుంటున్నారా?',
    reasonPlaceholder: 'ఐచ్ఛికం — కానీ ప్రతి సమాధానం నేను చదువుతాను.',
    skipReason: 'దాటవేయి',
    submit: 'పంపు',
    notNow: 'ఇప్పుడు కాదు',
    thanks: 'ధన్యవాదాలు  –  ఇది చాలా సహాయపడుతుంది.',
    submitError: 'క్షమించండి, మీ అభిప్రాయాన్ని పంపడంలో సమస్య వచ్చింది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
  },
  bn: {
    title: 'একটি ছোট অনুরোধ?',
    question: 'বন্ধুদের কাছে দেখো পঞ্চাঙ্গ সুপারিশ করার সম্ভাবনা কতটা?',
    notLikely: 'একদমই নয়',
    veryLikely: 'অবশ্যই',
    reasonPrompt: 'কেন সেই সম্পর্কে কিছু ভাগ করতে চান?',
    reasonPlaceholder: 'ঐচ্ছিক — কিন্তু আমি প্রতিটি উত্তর পড়ি।',
    skipReason: 'এড়িয়ে যান',
    submit: 'পাঠান',
    notNow: 'এখন নয়',
    thanks: 'ধন্যবাদ  –  এটি সত্যিই সাহায্য করে।',
    submitError: 'দুঃখিত, আপনার মতামত পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
  },
  gu: {
    title: 'એક નાની વિનંતી?',
    question: 'મિત્રોને દેખો પંચાંગ સૂચવવાની કેટલી શક્યતા છે?',
    notLikely: 'બિલકુલ નહીં',
    veryLikely: 'અવશ્ય',
    reasonPrompt: 'કારણ વિશે કંઈક વહેંચવા માંગો છો?',
    reasonPlaceholder: 'વૈકલ્પિક — પણ હું દરેક જવાબ વાંચું છું.',
    skipReason: 'છોડો',
    submit: 'મોકલો',
    notNow: 'અત્યારે નહીં',
    thanks: 'આભાર  –  આ ખૂબ મદદરૂપ છે.',
    submitError: 'માફ કરશો, તમારો પ્રતિભાવ મોકલવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.',
  },
  kn: {
    title: 'ಒಂದು ಸಣ್ಣ ವಿನಂತಿ?',
    question: 'ಸ್ನೇಹಿತರಿಗೆ ದೇಖೊ ಪಂಚಾಂಗವನ್ನು ಶಿಫಾರಸು ಮಾಡುವ ಸಾಧ್ಯತೆ ಎಷ್ಟು?',
    notLikely: 'ಬಿಲ್‌ಕುಲ್ ಇಲ್ಲ',
    veryLikely: 'ಖಚಿತವಾಗಿ',
    reasonPrompt: 'ಏಕೆ ಎಂಬುದನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರಾ?',
    reasonPlaceholder: 'ಐಚ್ಛಿಕ — ಆದರೆ ನಾನು ಪ್ರತಿ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಓದುತ್ತೇನೆ.',
    skipReason: 'ಬಿಟ್ಟುಬಿಡಿ',
    submit: 'ಕಳುಹಿಸಿ',
    notNow: 'ಈಗ ಬೇಡ',
    thanks: 'ಧನ್ಯವಾದಗಳು  –  ಇದು ತುಂಬಾ ಸಹಾಯಕವಾಗಿದೆ.',
    submitError: 'ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಕಳುಹಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  },
  mai: {
    title: 'एक छोट निवेदन?',
    question: 'दोस्त कें देखो पंचांग सुझाबय कऽ कतेक संभावना अछि?',
    notLikely: 'बिल्कुल नै',
    veryLikely: 'अवश्य',
    reasonPrompt: 'कोनो कारण बांटय चाहबै?',
    reasonPlaceholder: 'वैकल्पिक — मुदा हम हर जवाब पढ़ैत छी।',
    skipReason: 'छोड़ू',
    submit: 'पठाबू',
    notNow: 'आब नै',
    thanks: 'धन्यवाद  –  ई बहुत मदद करैत अछि।',
    submitError: 'क्षमा करू, अहाँक जवाब पठाबय मे समस्या भेल। कृपया फेर सँ प्रयास करू।',
  },
  mr: {
    title: 'एक छोटी विनंती?',
    question: 'मित्रांना देखो पंचांग सुचवण्याची शक्यता किती?',
    notLikely: 'अजिबात नाही',
    veryLikely: 'नक्कीच',
    reasonPrompt: 'का ते सांगायला आवडेल?',
    reasonPlaceholder: 'ऐच्छिक — पण मी प्रत्येक उत्तर वाचतो.',
    skipReason: 'सोडा',
    submit: 'पाठवा',
    notNow: 'आत्ता नको',
    thanks: 'धन्यवाद  –  हे खरोखर मदत करते.',
    submitError: 'क्षमस्व, तुमचा प्रतिसाद पाठवण्यात अपयश आले. कृपया पुन्हा प्रयत्न करा.',
  },
};

function getLabels(locale: string): Labels {
  return LABELS[locale] ?? LABELS.en;
}

function colourFor(score: number, selected: number | null): string {
  const isSelected = selected === score;
  const base =
    score <= 6
      ? 'bg-red-500/15 text-red-200 border-red-500/30 hover:bg-red-500/30'
      : score <= 8
      ? 'bg-gold-primary/10 text-gold-light border-gold-primary/30 hover:bg-gold-primary/25'
      : 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30 hover:bg-emerald-500/30';
  const ring = isSelected ? 'ring-2 ring-gold-light scale-110' : '';
  return `${base} ${ring}`;
}

// `locale` is passed in from the DashboardLayout (Server Component)
// where it's already resolved from route params. Reading it via
// useLocale() would still work but the general rule is: components
// that render localised content should receive `locale` explicitly so
// they render deterministically regardless of context provider timing.
// PR #732 Gemini review.
export function NpsModal({ locale }: { locale: string }) {
  const L = getLabels(locale);
  const [phase, setPhase] = useState<Phase>('hidden');
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    // Cooldown — if we already showed this session, don't re-check the
    // server. Even if the user navigates across dashboard sub-routes the
    // modal won't reappear until next session at the earliest.
    if (typeof window !== 'undefined' && sessionStorage.getItem(COOLDOWN_KEY)) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const sb = getSupabase();
        if (!sb) return;
        const { data: { session } } = await sb.auth.getSession();
        const token = session?.access_token;
        if (!token) return;

        const res = await fetch('/api/feedback/nps-inapp', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json: { eligible?: boolean } = await res.json();
        if (cancelled) return;
        if (json.eligible) setPhase('asking_score');
      } catch (err) {
        // Eligibility check is best-effort. A network blip just means
        // "don't show this load" — definitely surface to console so
        // failures are debuggable, but don't bug the user.
        console.error('[NpsModal] eligibility check failed:', err);
      }
    }, MOUNT_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Auto-hide the "thanks" screen after 2.5s. Kept as a phase-driven
  // useEffect (rather than a naked setTimeout inside handleSubmit) so
  // the timer is cleared on unmount and can't set state on a torn-down
  // component — matters because the user may navigate away between the
  // submit and the auto-hide. PR #732 Gemini review.
  useEffect(() => {
    if (phase !== 'thanks') return;
    const timer = setTimeout(() => setPhase('hidden'), 2500);
    return () => clearTimeout(timer);
  }, [phase]);

  async function postAction(
    body: { action: 'submit'; score: number; reason?: string } | { action: 'dismiss' },
  ): Promise<boolean> {
    try {
      const sb = getSupabase();
      if (!sb) return false;
      const { data: { session } } = await sb.auth.getSession();
      const token = session?.access_token;
      if (!token) return false;
      const res = await fetch('/api/feedback/nps-inapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      return res.ok;
    } catch (err) {
      console.error('[NpsModal] postAction failed:', err);
      return false;
    }
  }

  function markCooldown() {
    try {
      sessionStorage.setItem(COOLDOWN_KEY, '1');
    } catch {
      // sessionStorage blocked in private mode on some browsers — we
      // tolerate the reappearance; server-side write is the real guard.
    }
  }

  function handleDismiss() {
    setPhase('hidden');
    markCooldown();
    // Fire-and-forget — the server-side mark-shown will arrive shortly;
    // if it doesn't, sessionStorage covers this session and the modal
    // won't reappear until a new session at the earliest. The next
    // mount cycle's GET will still no-op once the server write lands.
    void postAction({ action: 'dismiss' });
  }

  function handlePickScore(n: number) {
    setScore(n);
    setPhase('asking_reason');
  }

  async function handleSubmit() {
    if (score === null) return;
    setPhase('submitting');
    const trimmed = reason.trim();
    const ok = await postAction({
      action: 'submit',
      score,
      ...(trimmed.length > 0 ? { reason: trimmed } : {}),
    });
    markCooldown();
    if (ok) {
      // Auto-hide is handled by the phase-driven useEffect above; no
      // naked setTimeout here.
      setPhase('thanks');
    } else {
      // Surface the failure — user spent time on this, silent dismiss
      // would feel like the response went into a black hole. Reset to
      // 'asking_reason' so they can retry without re-picking the score.
      setPhase('asking_reason');
      alert(L.submitError);
    }
  }

  if (phase === 'hidden') return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/70 via-[#1a1040]/80 to-[#0a0e27] p-6 shadow-2xl shadow-black/40">
        {(phase === 'asking_score' || phase === 'asking_reason' || phase === 'submitting') && (
          <>
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-lg font-semibold text-gold-light">{L.title}</h2>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-text-secondary hover:text-gold-light text-sm transition-colors px-2 py-1 -mr-2 -mt-1"
                aria-label={L.notNow}
              >
                ×
              </button>
            </div>
            <p className="text-text-primary text-sm mb-5 leading-relaxed">{L.question}</p>
            <div className="grid grid-cols-11 gap-1 mb-2">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePickScore(i)}
                  disabled={phase === 'submitting'}
                  className={`aspect-square rounded-lg border font-semibold text-sm transition-all disabled:opacity-50 ${colourFor(i, score)}`}
                  aria-label={`Score ${i}`}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-text-secondary mb-5 px-1">
              <span>{L.notLikely}</span>
              <span>{L.veryLikely}</span>
            </div>

            {phase === 'asking_reason' || phase === 'submitting' ? (
              <>
                <label htmlFor="nps-inapp-reason" className="block text-sm text-gold-light mb-2">
                  {L.reasonPrompt}
                </label>
                <textarea
                  id="nps-inapp-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={L.reasonPlaceholder}
                  maxLength={2000}
                  rows={3}
                  disabled={phase === 'submitting'}
                  className="w-full rounded-lg border border-gold-primary/20 bg-[#0a0e27]/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/70 focus:border-gold-primary/60 focus:outline-none disabled:opacity-50 resize-none"
                />
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleDismiss}
                    disabled={phase === 'submitting'}
                    className="px-4 py-2 text-sm text-text-secondary hover:text-gold-light disabled:opacity-50 transition-colors"
                  >
                    {L.notNow}
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={phase === 'submitting'}
                    className="px-5 py-2 text-sm font-semibold rounded-lg bg-gold-primary/90 text-[#0a0e27] hover:bg-gold-light disabled:opacity-50 transition-colors"
                  >
                    {phase === 'submitting' ? '…' : L.submit}
                  </button>
                </div>
              </>
            ) : null}
          </>
        )}

        {phase === 'thanks' && (
          <p className="text-center py-4 text-gold-light font-medium">{L.thanks}</p>
        )}
      </div>
    </div>
  );
}

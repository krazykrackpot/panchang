'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import BirthForm from '@/components/kundali/BirthForm';
import { useAuthStore } from '@/stores/auth-store';
import { authedFetch } from '@/lib/api/authed-fetch';
import type { BirthData } from '@/types/kundali';
import type { AnnualFinancialReport } from '@/lib/financial/annual-financial';
import type { MonthlyWindow } from '@/lib/financial/financial-windows';
import type { DhanaActivation } from '@/lib/financial/dhana-activation';
import type { FinancialHora } from '@/lib/financial/hora-finance';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';

// ─── Inline labels ───────────────────────────────────────────────────────────
const LABELS = {
  en: {
    title: 'Financial Astrology',
    subtitle: 'Wealth Yogas · Monthly Outlook · Hora Guide',
    desc: 'Discover your financial windows, Dhana Yoga activations, and hora-based trading guide from your Vedic birth chart.',
    disclaimer: 'This is traditional Vedic knowledge for self-awareness only. It is NOT financial advice. Always consult qualified financial professionals before making investment decisions.',
    generate: 'Analyse Financial Chart',
    generating: 'Analysing...',
    yearRating: 'Year Financial Rating',
    monthlyTitle: 'Monthly Financial Outlook',
    dhanaTitle: 'Dhana Yoga Activations',
    horaTitle: "Today's Hora Financial Guide",
    topSectors: 'Favoured Sectors',
    activities: 'Activities',
    cautions: 'Cautions',
    score: 'Score',
    strength: 'Strength',
    noActivations: 'No Dhana Yoga activations found in the next 10 years.',
    noHora: 'Hora guide unavailable for today.',
    error: 'Analysis failed. Please try again.',
    retroTitle: 'Retrograde Cautions',
  },
  hi: {
    title: 'वित्तीय ज्योतिष',
    subtitle: 'धन योग · मासिक दृष्टिकोण · होरा मार्गदर्शन',
    desc: 'अपनी जन्म कुण्डली से वित्तीय अवसर, धन योग सक्रियण और होरा-आधारित व्यापार मार्गदर्शन जानें।',
    disclaimer: 'यह पारम्परिक वैदिक ज्ञान केवल आत्म-जागरूकता के लिए है। यह वित्तीय परामर्श नहीं है।',
    generate: 'वित्तीय कुण्डली विश्लेषण',
    generating: 'विश्लेषण...',
    yearRating: 'वार्षिक वित्तीय रेटिंग',
    monthlyTitle: 'मासिक वित्तीय दृष्टिकोण',
    dhanaTitle: 'धन योग सक्रियण',
    horaTitle: 'आज का होरा वित्तीय मार्गदर्शन',
    topSectors: 'अनुकूल क्षेत्र',
    activities: 'गतिविधियाँ',
    cautions: 'सावधानियाँ',
    score: 'अंक',
    strength: 'शक्ति',
    noActivations: 'अगले 10 वर्षों में कोई धन योग सक्रियण नहीं।',
    noHora: 'आज के लिए होरा मार्गदर्शन उपलब्ध नहीं।',
    error: 'विश्लेषण विफल। कृपया पुनः प्रयास करें।',
    retroTitle: 'वक्री ग्रह सावधानियाँ',
  },
  ta: {
    title: 'நிதி ஜோதிடம்',
    subtitle: 'தன யோகம் · மாத கணிப்பு · ஹோரா வழிகாட்டி',
    desc: 'உங்கள் ஜாதகத்திலிருந்து நிதி வாய்ப்புகள், தன யோக செயல்பாடுகள் மற்றும் ஹோரா வழிகாட்டியை அறியுங்கள்.',
    disclaimer: 'இது பாரம்பரிய வேத அறிவு — சுய விழிப்புணர்வுக்காக மட்டுமே. நிதி ஆலோசனை அல்ல.',
    generate: 'நிதி ஜாதக பகுப்பாய்வு',
    generating: 'பகுப்பாய்வு...',
    yearRating: 'ஆண்டு நிதி மதிப்பீடு',
    monthlyTitle: 'மாதாந்திர நிதி கணிப்பு',
    dhanaTitle: 'தன யோக செயல்பாடுகள்',
    horaTitle: 'இன்றைய ஹோரா நிதி வழிகாட்டி',
    topSectors: 'சாதகமான துறைகள்',
    activities: 'செயல்பாடுகள்',
    cautions: 'எச்சரிக்கைகள்',
    score: 'மதிப்பெண்',
    strength: 'வலிமை',
    noActivations: 'அடுத்த 10 ஆண்டுகளில் தன யோக செயல்பாடுகள் இல்லை.',
    noHora: 'இன்றைக்கான ஹோரா வழிகாட்டி கிடைக்கவில்லை.',
    error: 'பகுப்பாய்வு தோல்வி. மீண்டும் முயற்சிக்கவும்.',
    retroTitle: 'வக்ர கிரக எச்சரிக்கைகள்',
  },
  bn: {
    title: 'আর্থিক জ্যোতিষ',
    subtitle: 'ধন যোগ · মাসিক দৃষ্টিভঙ্গি · হোরা গাইড',
    desc: 'আপনার জাতক থেকে আর্থিক সুযোগ, ধন যোগ সক্রিয়করণ এবং হোরা-ভিত্তিক ব্যবসায়িক নির্দেশিকা জানুন।',
    disclaimer: 'এটি ঐতিহ্যবাহী বৈদিক জ্ঞান — শুধুমাত্র আত্ম-সচেতনতার জন্য। আর্থিক পরামর্শ নয়।',
    generate: 'আর্থিক জাতক বিশ্লেষণ',
    generating: 'বিশ্লেষণ...',
    yearRating: 'বার্ষিক আর্থিক রেটিং',
    monthlyTitle: 'মাসিক আর্থিক দৃষ্টিভঙ্গি',
    dhanaTitle: 'ধন যোগ সক্রিয়করণ',
    horaTitle: 'আজকের হোরা আর্থিক গাইড',
    topSectors: 'অনুকূল খাত',
    activities: 'কার্যক্রম',
    cautions: 'সতর্কতা',
    score: 'স্কোর',
    strength: 'শক্তি',
    noActivations: 'পরবর্তী ১০ বছরে কোনো ধন যোগ সক্রিয়করণ নেই।',
    noHora: 'আজকের জন্য হোরা গাইড উপলব্ধ নয়।',
    error: 'বিশ্লেষণ ব্যর্থ। আবার চেষ্টা করুন।',
    retroTitle: 'বক্র গ্রহ সতর্কতা',
  },
} as const;

type LabelLocale = keyof typeof LABELS;
function L(locale: string, key: keyof typeof LABELS.en): string {
  const loc = (LABELS[locale as LabelLocale] ? locale : 'en') as LabelLocale;
  return LABELS[loc][key] ?? LABELS.en[key];
}

interface FinancialResponse {
  annualReport: AnnualFinancialReport;
  financialHoras: FinancialHora[] | null;
  disclaimer: string;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function DisclaimerBanner({ text }: { text: string }) {
  return (
    <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
      <span className="text-amber-400 text-lg leading-none mt-0.5">$</span>
      <p className="text-amber-300/90 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-400' : 'bg-red-500';
  return (
    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
    </div>
  );
}

export default function FinancialAstrologyPage() {
  const locale = useLocale();
  const { session } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FinancialResponse | null>(null);

  async function handleSubmit(birthData: BirthData) {
    setLoading(true);
    setError(null);
    try {
      const res = await authedFetch('/api/financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthData),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const data: FinancialResponse = await res.json();
      setResult(data);
    } catch (err) {
      console.error('[financial-page] Analysis failed:', err);
      setError(L(locale, 'error'));
    } finally {
      setLoading(false);
    }
  }

  const report = result?.annualReport;
  const horas = result?.financialHoras;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient">{L(locale, 'title')}</h1>
        <p className="text-text-secondary text-sm">{L(locale, 'subtitle')}</p>
        <p className="text-text-secondary/70 text-xs max-w-2xl mx-auto">{L(locale, 'desc')}</p>
      </div>

      {/* Disclaimer */}
      <DisclaimerBanner text={L(locale, 'disclaimer')} />

      {/* Birth Form */}
      <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-5">
        <BirthForm
          onSubmit={(data) => handleSubmit(data)}
          loading={loading}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {report && (
        <div className="space-y-8">
          {/* Year Rating */}
          <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-6 text-center">
            <h2 className="text-xl font-bold text-gold-light mb-2">{L(locale, 'yearRating')}</h2>
            <div className="text-4xl font-bold text-gold-primary mb-2">{report.yearRating}</div>
            <div className="text-text-secondary text-sm mb-4">{report.yearScore}/100</div>
            <p className="text-text-secondary text-xs max-w-xl mx-auto">{report.yearSummary}</p>
            {report.topSectors.length > 0 && (
              <div className="mt-4">
                <p className="text-text-secondary text-xs mb-2">{L(locale, 'topSectors')}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {report.topSectors.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/25 text-gold-light text-xs">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Monthly Outlook */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-4 text-center">{L(locale, 'monthlyTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.monthlyOutlook.map((m: MonthlyWindow) => (
                <div key={`${m.year}-${m.month}`} className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#1a1040]/30 to-[#0a0e27] p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gold-light font-semibold text-sm">{MONTH_NAMES[m.month - 1]} {m.year}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      m.grade === 'excellent' ? 'bg-emerald-500/15 text-emerald-400' :
                      m.grade === 'good' ? 'bg-lime-500/15 text-lime-400' :
                      m.grade === 'average' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-red-500/15 text-red-400'
                    }`}>{m.grade}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScoreBar score={m.score} />
                    <span className="text-text-secondary text-xs w-8 text-right">{m.score}</span>
                  </div>
                  {m.activities.length > 0 && (
                    <div>
                      <p className="text-text-secondary/70 text-[10px] uppercase tracking-wider mb-1">{L(locale, 'activities')}</p>
                      <p className="text-text-secondary text-xs">{m.activities.join(', ')}</p>
                    </div>
                  )}
                  {m.cautions.length > 0 && (
                    <div>
                      <p className="text-red-400/70 text-[10px] uppercase tracking-wider mb-1">{L(locale, 'cautions')}</p>
                      <p className="text-red-400/80 text-xs">{m.cautions.join(', ')}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dhana Yoga Activations */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-4 text-center">{L(locale, 'dhanaTitle')}</h2>
            {report.dhanaActivations.length === 0 ? (
              <p className="text-text-secondary text-sm text-center">{L(locale, 'noActivations')}</p>
            ) : (
              <div className="space-y-3">
                {report.dhanaActivations.map((da: DhanaActivation, i: number) => (
                  <div key={i} className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#1a1040]/30 to-[#0a0e27] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gold-light font-semibold text-sm">{da.yogaName}</span>
                      <span className="text-text-secondary text-xs">Planets: {da.planets.join(', ')}</span>
                    </div>
                    <div className="space-y-1">
                      {da.activationWindows.map((w, j) => (
                        <div key={j} className="flex items-center gap-3 text-xs">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                            w.strength === 'strong' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                          }`}>{w.strength}</span>
                          <span className="text-text-secondary">{w.startDate} — {w.endDate}</span>
                          <span className="text-text-secondary/60">{w.dashaDescription}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Retrograde Cautions */}
          {report.retrogradeCautions.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gold-light mb-4 text-center">{L(locale, 'retroTitle')}</h2>
              <div className="space-y-2">
                {report.retrogradeCautions.map((rc, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-red-500/5 border border-red-500/15 rounded-xl text-xs">
                    <span className="text-red-400 font-semibold whitespace-nowrap">{rc.planet} — {rc.period}</span>
                    <span className="text-text-secondary">{rc.caution}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Hora Guide */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-4 text-center">{L(locale, 'horaTitle')}</h2>
            {!horas || horas.length === 0 ? (
              <p className="text-text-secondary text-sm text-center">{L(locale, 'noHora')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {horas.map((h: FinancialHora, i: number) => (
                  <div key={i} className={`rounded-lg border p-3 text-xs ${
                    h.favorability === 'excellent' ? 'border-emerald-500/25 bg-emerald-500/5' :
                    h.favorability === 'good' ? 'border-lime-500/20 bg-lime-500/5' :
                    h.favorability === 'neutral' ? 'border-gold-primary/15 bg-gold-primary/5' :
                    'border-red-500/15 bg-red-500/5'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gold-light font-semibold">{h.startTime} – {h.endTime}</span>
                      <span className="text-text-secondary">{h.planetName} Hora</span>
                    </div>
                    <p className="text-text-secondary">{h.activities.join(', ')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Disclaimer */}
          <DisclaimerBanner text={result?.disclaimer || L(locale, 'disclaimer')} />
        </div>
      )}
    </div>
  );
}

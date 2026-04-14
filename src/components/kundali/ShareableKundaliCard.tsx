'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X } from 'lucide-react';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import ShareButton from '@/components/ui/ShareButton';
import type { KundaliData } from '@/types/kundali';
import type { Locale , LocaleText} from '@/types/panchang';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';

/* ════════════════════════════════════════════════════════════════
   Labels
   ════════════════════════════════════════════════════════════════ */
const LABELS = {
  shareMyChart: { en: 'Share My Chart', hi: 'मेरा चार्ट शेयर करें', sa: 'मम कुण्डलीं प्रसारयतु' },
  close:        { en: 'Close', hi: 'बंद', sa: 'पिदधातु' },
  ascendant:    { en: 'Ascendant', hi: 'लग्न', sa: 'लग्नम्' },
  moonSign:     { en: 'Moon Sign', hi: 'चन्द्र राशि', sa: 'चन्द्रराशिः' },
  sunSign:      { en: 'Sun Sign', hi: 'सूर्य राशि', sa: 'सूर्यराशिः' },
  nakshatra:    { en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्' },
  mahadasha:    { en: 'Mahadasha', hi: 'महादशा', sa: 'महादशा' },
  keyYogas:     { en: 'Key Yogas', hi: 'प्रमुख योग', sa: 'मुख्ययोगाः' },
  vedic:        { en: 'Vedic Birth Chart', hi: 'वैदिक जन्म कुण्डली', sa: 'वैदिकजन्मकुण्डली' },
  generated:    { en: 'Generated at', hi: 'निर्मित', sa: 'निर्मितम्' },
  pada:         { en: 'Pada', hi: 'पाद', sa: 'पादः' },
};

/* ════════════════════════════════════════════════════════════════
   Helper: find current Mahadasha
   ════════════════════════════════════════════════════════════════ */
function getCurrentMahadasha(kundali: KundaliData, locale: Locale) {
  const now = new Date();
  const current = kundali.dashas.find(d => {
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    return now >= start && now <= end;
  });
  if (!current) return null;
  const startYear = new Date(current.startDate).getFullYear();
  const endYear = new Date(current.endDate).getFullYear();
  return {
    planetName: current.planetName[locale] || current.planetName.en,
    period: `${startYear}–${endYear}`,
    planetId: parseInt(current.planet) || 0,
  };
}

/* ════════════════════════════════════════════════════════════════
   Helper: get top auspicious yogas
   ════════════════════════════════════════════════════════════════ */
function getTopYogas(kundali: KundaliData, locale: Locale): string[] {
  if (!kundali.yogasComplete) return [];
  return kundali.yogasComplete
    .filter(y => y.present && y.isAuspicious)
    .sort((a, b) => {
      const strengthOrder = { Strong: 0, Moderate: 1, Weak: 2 };
      return strengthOrder[a.strength] - strengthOrder[b.strength];
    })
    .slice(0, 3)
    .map(y => y.name[locale] || y.name.en);
}

/* ════════════════════════════════════════════════════════════════
   ShareableKundaliCard
   ════════════════════════════════════════════════════════════════ */
interface Props {
  kundali: KundaliData;
  locale: Locale;
}

export default function ShareableKundaliCard({ kundali, locale }: Props) {
  const [open, setOpen] = useState(false);
  const l = (obj: LocaleText) => obj[locale] || obj.en;

  const moonP = kundali.planets.find(p => p.planet.id === 1);
  const sunP = kundali.planets.find(p => p.planet.id === 0);
  const mahadasha = getCurrentMahadasha(kundali, locale);
  const topYogas = getTopYogas(kundali, locale);
  const name = kundali.birthData.name || tl({ en: 'Chart', hi: 'कुण्डली', sa: 'कुण्डली' }, locale);

  // Build share text
  const ascName = kundali.ascendant.signName.en;
  const moonSignEn = moonP?.signName?.en || '';
  const nakEn = moonP?.nakshatra?.name?.en || '';
  const dashaEn = mahadasha ? `${mahadasha.planetName}` : '';
  const shareText = `${kundali.birthData.name ? kundali.birthData.name + "'s " : ''}Vedic Chart: ${ascName} Ascendant, ${moonSignEn} Moon, ${nakEn} Nakshatra${dashaEn ? `, ${dashaEn} Mahadasha` : ''}. Generate yours`;
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/${locale}/kundali` : 'https://dekhopanchang.com/kundali';

  const isDevanagari = isDevanagariLocale(locale);
  const bodyFont = getBodyFont(locale);
  const headingFont = getHeadingFont(locale);

  async function handleShare() {
    // Try Web Share API first (great on mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${name} — ${l(LABELS.vedic)}`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or API failed — fall through to modal
      }
    }
    // Fallback: open the modal with share options
    setOpen(true);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-purple-500/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
      >
        <Share2 className="w-4 h-4" />
        {l(LABELS.shareMyChart)}
      </button>

      {/* Modal overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' as const }}
              className="relative w-full max-w-[420px]"
            >
              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-bg-secondary border border-gold-primary/20 flex items-center justify-center text-text-secondary hover:text-gold-light hover:border-gold-primary/50 transition-all"
                aria-label={l(LABELS.close)}
              >
                <X className="w-4 h-4" />
              </button>

              {/* ═══ The Card ═══ */}
              <div className="rounded-2xl overflow-hidden border-2 border-gold-primary/40 shadow-2xl shadow-black/50">
                {/* Background + gradient */}
                <div className="bg-[#0a0e27] relative">
                  {/* Top accent bar */}
                  <div className="h-1.5 bg-gradient-to-r from-purple-600 via-gold-primary to-purple-600" />

                  <div className="px-6 pt-5 pb-6">
                    {/* Header */}
                    <div className="text-center mb-5">
                      <p className="text-purple-400/70 text-[10px] uppercase tracking-[0.2em] font-semibold mb-1">
                        {l(LABELS.vedic)}
                      </p>
                      <h3
                        className="text-gold-light text-xl font-bold tracking-tight"
                        style={headingFont}
                      >
                        {name}
                      </h3>
                      <p className="text-text-secondary text-xs mt-1">
                        {kundali.birthData.date} &middot; {kundali.birthData.time} &middot; {kundali.birthData.place}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent mb-5" />

                    {/* Grid of key details */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Ascendant */}
                      <CardRow
                        icon={<RashiIconById id={kundali.ascendant.sign} size={28} />}
                        label={l(LABELS.ascendant)}
                        value={kundali.ascendant.signName[locale] || kundali.ascendant.signName.en}
                        bodyFont={bodyFont}
                      />

                      {/* Moon Sign */}
                      {moonP && (
                        <CardRow
                          icon={<RashiIconById id={moonP.sign} size={28} />}
                          label={l(LABELS.moonSign)}
                          value={moonP.signName[locale] || moonP.signName.en}
                          bodyFont={bodyFont}
                        />
                      )}

                      {/* Sun Sign */}
                      {sunP && (
                        <CardRow
                          icon={<RashiIconById id={sunP.sign} size={28} />}
                          label={l(LABELS.sunSign)}
                          value={sunP.signName[locale] || sunP.signName.en}
                          bodyFont={bodyFont}
                        />
                      )}

                      {/* Nakshatra */}
                      {moonP?.nakshatra && (
                        <CardRow
                          icon={<NakshatraIconById id={moonP.nakshatra.id} size={28} />}
                          label={l(LABELS.nakshatra)}
                          value={`${moonP.nakshatra.name[locale] || moonP.nakshatra.name.en} (${l(LABELS.pada)} ${moonP.pada})`}
                          bodyFont={bodyFont}
                        />
                      )}
                    </div>

                    {/* Mahadasha */}
                    {mahadasha && (
                      <div className="mt-4 rounded-xl bg-purple-500/8 border border-purple-500/15 p-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-500/15 flex items-center justify-center shrink-0">
                          <GrahaIconById id={mahadasha.planetId} size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-purple-400/70 text-[10px] uppercase tracking-wider font-semibold">
                            {l(LABELS.mahadasha)}
                          </p>
                          <p className="text-purple-200 text-sm font-semibold truncate" style={bodyFont}>
                            {mahadasha.planetName} &middot; {mahadasha.period}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Key Yogas */}
                    {topYogas.length > 0 && (
                      <div className="mt-3 rounded-xl bg-gold-primary/5 border border-gold-primary/12 p-3">
                        <p className="text-gold-dark text-[10px] uppercase tracking-wider font-semibold mb-1.5">
                          {l(LABELS.keyYogas)}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {topYogas.map((yoga, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-xs font-medium"
                              style={bodyFont}
                            >
                              {yoga}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Branding footer */}
                    <div className="mt-5 pt-4 border-t border-gold-primary/10 flex items-center justify-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gold-light to-gold-dark flex items-center justify-center">
                        <span className="text-[#0a0e27] text-[9px] font-black">DP</span>
                      </div>
                      <p className="text-text-secondary/50 text-[10px]">
                        {l(LABELS.generated)} <span className="text-gold-primary/60 font-semibold">dekhopanchang.com</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share buttons below card */}
              <div className="mt-4 flex justify-center">
                <ShareButton
                  title={`${name} — ${l(LABELS.vedic)}`}
                  text={shareText}
                  url={shareUrl}
                  locale={locale}
                  variant="inline"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════
   CardRow — a single row in the summary grid
   ════════════════════════════════════════════════════════════════ */
function CardRow({
  icon,
  label,
  value,
  bodyFont,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bodyFont?: React.CSSProperties;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] p-2.5">
      <div className="w-8 h-8 rounded-lg bg-gold-primary/8 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-secondary/60 text-[10px] uppercase tracking-wider font-semibold leading-none mb-0.5">
          {label}
        </p>
        <p className="text-gold-light text-xs font-semibold truncate" style={bodyFont}>
          {value}
        </p>
      </div>
    </div>
  );
}

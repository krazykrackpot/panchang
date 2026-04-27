'use client';

import { motion } from 'framer-motion';
import type { TajikaYoga, TajikaYogaType } from '@/types/varshaphal';
import type { Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ─── Yoga category styling ──────────────────────────────────────────────────
// Each yoga type maps to a visual category for badge + border color
type YogaCategory = 'positive' | 'negative' | 'neutral' | 'rescue';

const YOGA_CATEGORY: Record<TajikaYogaType, YogaCategory> = {
  ithasala: 'positive',
  muthashila: 'positive',
  nakta: 'positive',
  dutthottha: 'positive',
  ikkabal: 'positive',
  kamboola: 'positive',
  tambira: 'positive',
  'gairi-kamboola': 'neutral',
  induvara: 'neutral',
  durupha: 'neutral',
  conjunction: 'neutral',
  yamaya: 'negative',
  ishrafa: 'negative',
  manau: 'negative',
  kuttha: 'negative',
  khallasara: 'neutral',
  radda: 'rescue',
  easarapha: 'negative',
  manahoo: 'negative',
};

const CATEGORY_STYLES: Record<YogaCategory, { border: string; bg: string; badge: string; badgeText: string }> = {
  positive: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', badge: 'bg-emerald-500/20', badgeText: 'text-emerald-400' },
  negative: { border: 'border-red-500/20', bg: 'bg-red-500/5', badge: 'bg-red-500/20', badgeText: 'text-red-400' },
  neutral:  { border: 'border-amber-500/20', bg: 'bg-amber-500/5', badge: 'bg-amber-500/20', badgeText: 'text-amber-400' },
  rescue:   { border: 'border-blue-500/20', bg: 'bg-blue-500/5', badge: 'bg-blue-500/20', badgeText: 'text-blue-400' },
};

const CATEGORY_LABEL: Record<YogaCategory, { en: string; hi: string; sa: string }> = {
  positive: { en: 'Favorable', hi: 'अनुकूल', sa: 'अनुकूलः' },
  negative: { en: 'Unfavorable', hi: 'प्रतिकूल', sa: 'प्रतिकूलः' },
  neutral:  { en: 'Mixed', hi: 'मिश्रित', sa: 'मिश्रितः' },
  rescue:   { en: 'Rescue', hi: 'उद्धार', sa: 'उद्धारः' },
};

const STRENGTH_LABELS = {
  strong:   { en: 'Strong', hi: 'शक्तिशाली', sa: 'बलवान्' },
  moderate: { en: 'Moderate', hi: 'मध्यम', sa: 'मध्यमः' },
  weak:     { en: 'Weak', hi: 'दुर्बल', sa: 'दुर्बलः' },
};

// ─── Advice per yoga type ───────────────────────────────────────────────────
const YOGA_ADVICE: Record<TajikaYogaType, { en: string; hi: string; sa: string }> = {
  ithasala:         { en: 'Pursue your goals actively this year.', hi: 'इस वर्ष सक्रिय रूप से लक्ष्य प्राप्त करें।', sa: 'अस्मिन् वर्षे सक्रियतया लक्ष्यं प्राप्नुहि।' },
  muthashila:       { en: 'Highly auspicious — take bold action with confidence.', hi: 'अत्यंत शुभ — आत्मविश्वास से साहसिक कदम उठाएं।', sa: 'अत्यन्तशुभम् — आत्मविश्वासेन साहसिकं कुरु।' },
  ishrafa:          { en: 'The window is closing — act on residual momentum.', hi: 'अवसर बीत रहा है — शेष गति का लाभ उठाएं।', sa: 'अवसरः गच्छति — शेषगतिं उपयुज्य।' },
  nakta:            { en: 'Seek an intermediary or mediator for best results.', hi: 'सर्वोत्तम परिणाम के लिए मध्यस्थ खोजें।', sa: 'उत्तमफलाय मध्यस्थं अन्विष्य।' },
  yamaya:           { en: 'Expect opposition — prepare for negotiations.', hi: 'विरोध की अपेक्षा करें — वार्ता के लिए तैयार रहें।', sa: 'विरोधं प्रतीक्षस्व — वार्तायै सज्जो भव।' },
  manau:            { en: 'Avoid overcommitting — promises may not materialize.', hi: 'अत्यधिक प्रतिबद्धता से बचें — वादे पूरे नहीं हो सकते।', sa: 'अतिप्रतिज्ञां त्यज — प्रतिज्ञाः न सिध्यन्ति।' },
  khallasara:       { en: 'Results arrive through a chain of events — be patient.', hi: 'परिणाम घटनाओं की श्रृंखला से आएगा — धैर्य रखें।', sa: 'घटनाश्रृंखलया फलं आगच्छति — धैर्यं धर।' },
  dutthottha:       { en: 'Leverage recently concluded matters.', hi: 'हाल ही में समाप्त हुए मामलों का लाभ उठाएं।', sa: 'अद्यतनसमाप्तविषयान् उपयुज्य।' },
  ikkabal:          { en: 'This planet delivers results on its own — trust its placement.', hi: 'यह ग्रह अकेले परिणाम देता है — इसकी स्थिति पर भरोसा रखें।', sa: 'एषः ग्रहः स्वतन्त्रं फलं ददाति — स्थानं विश्वसिहि।' },
  induvara:         { en: 'A gentle influence — subtle improvements come naturally.', hi: 'सौम्य प्रभाव — सूक्ष्म सुधार स्वाभाविक रूप से आएगा।', sa: 'सौम्यप्रभावः — सूक्ष्मसुधारः स्वाभाविकम् आगच्छति।' },
  tambira:          { en: 'One ending leads to a new beginning — embrace transition.', hi: 'एक अंत नई शुरुआत की ओर ले जाता है — संक्रमण स्वीकारें।', sa: 'एकस्य अन्तः नवारम्भस्य प्रति नयति।' },
  kuttha:           { en: 'Delay action on promises made — they lack backing.', hi: 'किए गए वादों पर कार्रवाई टालें — इनमें समर्थन नहीं है।', sa: 'प्रतिज्ञासु क्रियां विलम्बय — ताः बलहीनाः।' },
  durupha:          { en: 'Be persistent — results will come, though slowly.', hi: 'दृढ़ रहें — परिणाम धीरे-धीरे आएगा।', sa: 'दृढो भव — फलं मन्दं किन्तु अवश्यम् आगच्छति।' },
  radda:            { en: 'A rescue is underway — the negative outcome is being mitigated.', hi: 'उद्धार चल रहा है — नकारात्मक परिणाम कम हो रहा है।', sa: 'उद्धारः प्रचलति — नकारात्मकफलं न्यूनीक्रियते।' },
  kamboola:         { en: 'Take personal initiative — success comes through self-effort.', hi: 'व्यक्तिगत पहल करें — स्वप्रयास से सफलता मिलेगी।', sa: 'स्वयं प्रयत्नं कुरु — स्वप्रयत्नेन सिद्धिः।' },
  'gairi-kamboola': { en: 'Collaborate with others — help comes from external sources.', hi: 'दूसरों के साथ सहयोग करें — बाहरी स्रोतों से सहायता मिलेगी।', sa: 'अन्यैः सह सहयोगं कुरु — बाह्यस्रोतेभ्यः साहाय्यम्।' },
  conjunction:      { en: 'Powerful planetary union — channel this energy wisely.', hi: 'शक्तिशाली ग्रह मिलन — इस ऊर्जा को बुद्धिमानी से निर्देशित करें।', sa: 'शक्तिशालग्रहसंयोगः — ऊर्जां बुद्ध्या निर्दिश।' },
  easarapha:        { en: 'The faster planet has passed — the opportunity window is closing rapidly.', hi: 'तीव्र ग्रह आगे निकल गया — अवसर तेजी से बीत रहा है।', sa: 'शीघ्रग्रहः अतीतः — अवसरः शीघ्रं गच्छति।' },
  manahoo:          { en: 'Retrograde motion cancels the promise — reconsider commitments.', hi: 'वक्री गति ने वादा रद्द किया — प्रतिबद्धताओं पर पुनर्विचार करें।', sa: 'वक्रगतिः प्रतिज्ञां निरस्यति — प्रतिबद्धतासु पुनर्विचारं कुरु।' },
};

interface TajikaYogaCardProps {
  yoga: TajikaYoga;
  locale: Locale;
  index: number;
}

export default function TajikaYogaCard({ yoga, locale, index }: TajikaYogaCardProps) {
  const isDevanagari = isDevanagariLocale(locale);
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const category = YOGA_CATEGORY[yoga.type] || 'neutral';
  const styles = CATEGORY_STYLES[category];
  const categoryLabel = CATEGORY_LABEL[category];
  const strengthLabel = yoga.strengthLabel ? STRENGTH_LABELS[yoga.strengthLabel] : null;
  const advice = YOGA_ADVICE[yoga.type];
  const strength = yoga.strength ?? 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, ease: 'easeOut' as const }}
      className={`p-4 rounded-xl border ${styles.border} ${styles.bg} transition-all hover:border-gold-primary/25`}
    >
      {/* Header: name + badges */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-gold-light font-bold text-sm" style={bodyFont}>
          {tl(yoga.name, locale)}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${styles.badge} ${styles.badgeText}`}>
          {tl(categoryLabel, locale)}
        </span>
        {strengthLabel && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-primary">
            {tl(strengthLabel, locale)}
          </span>
        )}
        {yoga.cancels && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400">
            {tl({ en: `Cancels ${yoga.cancels}`, hi: `${yoga.cancels} रद्द करता है`, sa: `${yoga.cancels} निरस्यति` }, locale)}
          </span>
        )}
      </div>

      {/* Planets + orb info */}
      <div className="flex flex-wrap items-center gap-3 mb-2 text-xs text-text-secondary">
        {yoga.planet1.en !== yoga.planet2.en ? (
          <span style={bodyFont}>
            {tl(yoga.planet1, locale)} + {tl(yoga.planet2, locale)}
          </span>
        ) : (
          <span style={bodyFont}>{tl(yoga.planet1, locale)}</span>
        )}
        {yoga.orb !== undefined && (
          <span className="font-mono text-gold-dark">
            {yoga.orb.toFixed(1)}&deg; orb
          </span>
        )}
      </div>

      {/* Strength bar */}
      {yoga.strength !== undefined && (
        <div className="mb-3">
          <div className="h-1.5 w-full rounded-full bg-gold-primary/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold-primary to-gold-light transition-all"
              style={{ width: `${strength}%` }}
            />
          </div>
          <span className="text-xs text-text-secondary mt-0.5 inline-block">{strength}/100</span>
        </div>
      )}

      {/* Description */}
      <p className="text-text-secondary text-xs leading-relaxed mb-2" style={bodyFont}>
        {tl(yoga.description, locale)}
      </p>

      {/* Advice */}
      {advice && (
        <p className="text-gold-dark text-xs italic" style={bodyFont}>
          {tl(advice, locale)}
        </p>
      )}
    </motion.div>
  );
}

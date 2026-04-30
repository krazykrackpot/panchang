'use client';

import { motion } from 'framer-motion';
import { Eye, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { ECLIPSE_TABLE } from '@/lib/calendar/eclipse-data';
import type { Locale } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Labels (10 locales)
// ---------------------------------------------------------------------------

const LABELS = {
  en: { title: 'Eclipse Watch', nextEclipse: 'Next Eclipse', daysAway: 'days away', house: 'House', intensity: 'Impact', high: 'High', moderate: 'Moderate', low: 'Low', solar: 'Solar Eclipse', lunar: 'Lunar Eclipse', noUpcoming: 'No upcoming eclipses in the near future', viewAll: 'View All Eclipses' },
  hi: { title: 'ग्रहण प्रहरी', nextEclipse: 'अगला ग्रहण', daysAway: 'दिन शेष', house: 'भाव', intensity: 'प्रभाव', high: 'तीव्र', moderate: 'मध्यम', low: 'न्यून', solar: 'सूर्य ग्रहण', lunar: 'चन्द्र ग्रहण', noUpcoming: 'निकट भविष्य में कोई ग्रहण नहीं', viewAll: 'सभी ग्रहण देखें' },
  sa: { title: 'ग्रहणप्रहरी', nextEclipse: 'आगामिग्रहणम्', daysAway: 'दिनानि शेषाणि', house: 'भावः', intensity: 'प्रभावः', high: 'तीव्रः', moderate: 'मध्यमः', low: 'न्यूनः', solar: 'सूर्यग्रहणम्', lunar: 'चन्द्रग्रहणम्', noUpcoming: 'निकटभविष्ये ग्रहणं नास्ति', viewAll: 'सर्वाणि ग्रहणानि पश्यतु' },
  ta: { title: 'கிரகண காவலர்', nextEclipse: 'அடுத்த கிரகணம்', daysAway: 'நாட்கள் உள்ளன', house: 'பாவம்', intensity: 'தாக்கம்', high: 'அதிகம்', moderate: 'நடுத்தரம்', low: 'குறைவு', solar: 'சூரிய கிரகணம்', lunar: 'சந்திர கிரகணம்', noUpcoming: 'அருகிலுள்ள எதிர்காலத்தில் கிரகணம் இல்லை', viewAll: 'அனைத்து கிரகணங்களையும் காண்க' },
  te: { title: 'గ్రహణ పరిశీలన', nextEclipse: 'తదుపరి గ్రహణం', daysAway: 'రోజులు మిగిలి ఉన్నాయి', house: 'భావం', intensity: 'ప్రభావం', high: 'తీవ్రం', moderate: 'మధ్యస్థం', low: 'తక్కువ', solar: 'సూర్య గ్రహణం', lunar: 'చంద్ర గ్రహణం', noUpcoming: 'సమీప భవిష్యత్తులో గ్రహణాలు లేవు', viewAll: 'అన్ని గ్రహణాలను చూడండి' },
  bn: { title: 'গ্রহণ প্রহরী', nextEclipse: 'পরবর্তী গ্রহণ', daysAway: 'দিন বাকি', house: 'ভাব', intensity: 'প্রভাব', high: 'তীব্র', moderate: 'মধ্যম', low: 'কম', solar: 'সূর্যগ্রহণ', lunar: 'চন্দ্রগ্রহণ', noUpcoming: 'নিকট ভবিষ্যতে কোনো গ্রহণ নেই', viewAll: 'সব গ্রহণ দেখুন' },
  kn: { title: 'ಗ್ರಹಣ ಕಾವಲು', nextEclipse: 'ಮುಂದಿನ ಗ್ರಹಣ', daysAway: 'ದಿನಗಳು ಉಳಿದಿವೆ', house: 'ಭಾವ', intensity: 'ಪ್ರಭಾವ', high: 'ತೀವ್ರ', moderate: 'ಮಧ್ಯಮ', low: 'ಕಡಿಮೆ', solar: 'ಸೂರ್ಯ ಗ್ರಹಣ', lunar: 'ಚಂದ್ರ ಗ್ರಹಣ', noUpcoming: 'ಸಮೀಪ ಭವಿಷ್ಯದಲ್ಲಿ ಗ್ರಹಣಗಳಿಲ್ಲ', viewAll: 'ಎಲ್ಲಾ ಗ್ರಹಣಗಳನ್ನು ನೋಡಿ' },
  mr: { title: 'ग्रहण प्रहरी', nextEclipse: 'पुढचे ग्रहण', daysAway: 'दिवस शिल्लक', house: 'भाव', intensity: 'प्रभाव', high: 'तीव्र', moderate: 'मध्यम', low: 'कमी', solar: 'सूर्यग्रहण', lunar: 'चंद्रग्रहण', noUpcoming: 'जवळच्या भविष्यात ग्रहण नाही', viewAll: 'सर्व ग्रहण पहा' },
  gu: { title: 'ગ્રહણ ચોકીદાર', nextEclipse: 'આગામી ગ્રહણ', daysAway: 'દિવસ બાકી', house: 'ભાવ', intensity: 'પ્રભાવ', high: 'તીવ્ર', moderate: 'મધ્યમ', low: 'ઓછો', solar: 'સૂર્યગ્રહણ', lunar: 'ચંદ્રગ્રહણ', noUpcoming: 'નજીકના ભવિષ્યમાં ગ્રહણ નથી', viewAll: 'બધા ગ્રહણ જુઓ' },
  mai: { title: 'ग्रहण प्रहरी', nextEclipse: 'अगिला ग्रहण', daysAway: 'दिन बाँकी', house: 'भाव', intensity: 'प्रभाव', high: 'तीव्र', moderate: 'मध्यम', low: 'न्यून', solar: 'सूर्य ग्रहण', lunar: 'चन्द्र ग्रहण', noUpcoming: 'निकट भविष्यमे ग्रहण नहि', viewAll: 'सब ग्रहण देखू' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface NextEclipseInfo {
  date: string;
  kind: 'solar' | 'lunar';
  type: string; // total, partial, etc.
  daysUntil: number;
  houseActivated: number;
  intensity: 'high' | 'moderate' | 'low';
}

function findNextEclipse(ascSign: number): NextEclipseInfo | null {
  const today = new Date().toISOString().slice(0, 10);
  const now = Date.now();

  for (const ecl of ECLIPSE_TABLE) {
    if (ecl.date <= today) continue;

    const eclDate = new Date(ecl.date + 'T00:00:00');
    const daysUntil = Math.ceil((eclDate.getTime() - now) / 86400000);

    // Only show eclipses within next 12 months
    if (daysUntil > 365) break;

    // Approximate eclipse longitude from the date:
    // Solar eclipses happen at New Moon = Sun's longitude
    // Lunar eclipses happen at Full Moon = opposite of Sun's longitude
    // Rough Sun longitude: (dayOfYear / 365.25) * 360 - 80 (Lahiri offset ~24deg from tropical)
    const dayOfYear = Math.floor((eclDate.getTime() - new Date(eclDate.getFullYear(), 0, 0).getTime()) / 86400000);
    const tropicalSunLong = (dayOfYear / 365.25) * 360;
    // Approximate sidereal longitude (subtract ~24 degrees for Lahiri ayanamsha in 2026)
    const siderealSunLong = ((tropicalSunLong - 24.2) + 360) % 360;
    const eclipseLong = ecl.kind === 'lunar'
      ? (siderealSunLong + 180) % 360  // Moon opposite Sun
      : siderealSunLong;

    const eclipseSign = Math.floor(eclipseLong / 30) + 1;
    const house = ((eclipseSign - ascSign + 12) % 12) + 1;

    // Determine intensity based on magnitude and house
    let intensity: 'high' | 'moderate' | 'low' = 'low';
    const criticalHouses = [1, 4, 7, 8, 10, 12];
    const isCriticalHouse = criticalHouses.includes(house);

    if (ecl.kind === 'solar') {
      if (ecl.type === 'total' || ecl.type === 'annular') {
        intensity = isCriticalHouse ? 'high' : 'moderate';
      } else {
        intensity = isCriticalHouse ? 'moderate' : 'low';
      }
    } else {
      // Lunar
      if (ecl.type === 'total') {
        intensity = isCriticalHouse ? 'high' : 'moderate';
      } else if (ecl.type === 'partial') {
        intensity = isCriticalHouse ? 'moderate' : 'low';
      }
    }

    return {
      date: ecl.date,
      kind: ecl.kind,
      type: ecl.type,
      daysUntil,
      houseActivated: house,
      intensity,
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

interface Props {
  ascendantSign: number;
  locale: string;
}

export default function EclipseWatchCard({ ascendantSign, locale }: Props) {
  const loc = (locale as Locale) || 'en';
  const L = LABELS[loc] || LABELS.en;
  const isHi = isDevanagariLocale(loc);

  const eclipseInfo = findNextEclipse(ascendantSign);

  if (!eclipseInfo) return null;

  const intensityColor = {
    high: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
    moderate: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
    low: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  }[eclipseInfo.intensity];

  const intensityLabel = L[eclipseInfo.intensity];
  const eclipseTypeLabel = eclipseInfo.kind === 'solar' ? L.solar : L.lunar;

  const formattedDate = new Date(eclipseInfo.date + 'T00:00:00').toLocaleDateString(
    loc === 'en' ? 'en-US' : loc === 'hi' ? 'hi-IN' : loc,
    { month: 'short', day: 'numeric', year: 'numeric' },
  );

  return (
    <motion.div {...fadeUp} transition={{ delay: 0.38, ease: 'easeOut' as const }}>
      <div className="p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-gold-light font-semibold text-lg"
            style={isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
          >
            {L.title}
          </h3>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${intensityColor.bg} ${intensityColor.text} ${intensityColor.border} border`}>
            {intensityLabel}
          </span>
        </div>

        <div className="space-y-3">
          {/* Eclipse Type & Date */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-gold-primary" />
            </div>
            <div>
              <p className="text-text-primary font-medium text-sm" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {eclipseTypeLabel} ({eclipseInfo.type})
              </p>
              <p className="text-text-secondary text-xs">
                {formattedDate} — <span className="text-gold-primary font-bold">{eclipseInfo.daysUntil} {L.daysAway}</span>
              </p>
            </div>
          </div>

          {/* House Activation */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-text-secondary text-xs">{L.house}:</span>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gold-primary/15 text-gold-light text-xs font-bold border border-gold-primary/20">
                {eclipseInfo.houseActivated}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary text-xs">{L.intensity}:</span>
              <span className={`text-xs font-bold ${intensityColor.text}`}>{intensityLabel}</span>
            </div>
          </div>
        </div>

        {/* Link to /eclipses */}
        <Link
          href={'/eclipses' as '/eclipses'}
          className="mt-4 inline-flex items-center gap-1.5 text-gold-primary text-sm font-bold hover:text-gold-light transition-colors"
        >
          {L.viewAll}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

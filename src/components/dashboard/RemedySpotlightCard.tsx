'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale, getHeadingFont } from '@/lib/utils/locale-fonts';
import { GRAHAS } from '@/lib/constants/grahas';
import type { Locale } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Labels (10 locales)
// ---------------------------------------------------------------------------

const LABELS = {
  en: { title: 'Your Top Remedy', weakestPlanet: 'Weakest Planet', gemstone: 'Gemstone', mantra: 'Beej Mantra', viewRemedies: 'View All Remedies', noWeak: 'All planets are strong in your chart', wearOn: 'Wear on', donate: 'Donate' },
  hi: { title: 'आपका शीर्ष उपाय', weakestPlanet: 'सबसे दुर्बल ग्रह', gemstone: 'रत्न', mantra: 'बीज मन्त्र', viewRemedies: 'सभी उपाय देखें', noWeak: 'आपकी कुण्डली में सभी ग्रह बलवान हैं', wearOn: 'पहनें', donate: 'दान करें' },
  sa: { title: 'भवतः श्रेष्ठः उपायः', weakestPlanet: 'दुर्बलतमः ग्रहः', gemstone: 'रत्नम्', mantra: 'बीजमन्त्रः', viewRemedies: 'सर्वान् उपायान् पश्यतु', noWeak: 'भवतः कुण्डल्यां सर्वे ग्रहाः बलवन्तः', wearOn: 'धारयतु', donate: 'दानं कुर्यात्' },
  ta: { title: 'உங்கள் முதன்மை பரிகாரம்', weakestPlanet: 'பலவீனமான கிரகம்', gemstone: 'ரத்தினம்', mantra: 'பீஜ மந்திரம்', viewRemedies: 'அனைத்து பரிகாரங்களையும் காண்க', noWeak: 'உங்கள் ஜாதகத்தில் அனைத்து கிரகங்களும் வலிமையானவை', wearOn: 'அணியுங்கள்', donate: 'தானம்' },
  te: { title: 'మీ ప్రధాన పరిహారం', weakestPlanet: 'బలహీన గ్రహం', gemstone: 'రత్నం', mantra: 'బీజ మంత్రం', viewRemedies: 'అన్ని పరిహారాలు చూడండి', noWeak: 'మీ చార్ట్‌లో అన్ని గ్రహాలు బలంగా ఉన్నాయి', wearOn: 'ధరించండి', donate: 'దానం' },
  bn: { title: 'আপনার শীর্ষ প্রতিকার', weakestPlanet: 'দুর্বলতম গ্রহ', gemstone: 'রত্ন', mantra: 'বীজ মন্ত্র', viewRemedies: 'সব প্রতিকার দেখুন', noWeak: 'আপনার কুণ্ডলীতে সব গ্রহ শক্তিশালী', wearOn: 'পরুন', donate: 'দান করুন' },
  kn: { title: 'ನಿಮ್ಮ ಪ್ರಮುಖ ಪರಿಹಾರ', weakestPlanet: 'ದುರ್ಬಲ ಗ್ರಹ', gemstone: 'ರತ್ನ', mantra: 'ಬೀಜ ಮಂತ್ರ', viewRemedies: 'ಎಲ್ಲಾ ಪರಿಹಾರಗಳನ್ನು ನೋಡಿ', noWeak: 'ನಿಮ್ಮ ಚಾರ್ಟ್‌ನಲ್ಲಿ ಎಲ್ಲಾ ಗ್ರಹಗಳು ಬಲಶಾಲಿ', wearOn: 'ಧರಿಸಿ', donate: 'ದಾನ ಮಾಡಿ' },
  mr: { title: 'आपला प्रमुख उपाय', weakestPlanet: 'सर्वात दुर्बल ग्रह', gemstone: 'रत्न', mantra: 'बीज मंत्र', viewRemedies: 'सर्व उपाय पहा', noWeak: 'आपल्या कुंडलीत सर्व ग्रह बलवान आहेत', wearOn: 'घाला', donate: 'दान करा' },
  gu: { title: 'તમારો મુખ્ય ઉપાય', weakestPlanet: 'સૌથી નબળો ગ્રહ', gemstone: 'રત્ન', mantra: 'બીજ મંત્ર', viewRemedies: 'બધા ઉપાયો જુઓ', noWeak: 'તમારી કુંડળીમાં બધા ગ્રહ બળવાન છે', wearOn: 'પહેરો', donate: 'દાન કરો' },
  mai: { title: 'अहाँक प्रमुख उपाय', weakestPlanet: 'सबसँ दुर्बल ग्रह', gemstone: 'रत्न', mantra: 'बीज मन्त्र', viewRemedies: 'सब उपाय देखू', noWeak: 'अहाँक कुण्डलीमे सब ग्रह बलवान अछि', wearOn: 'पहिरू', donate: 'दान करू' },
};

// ---------------------------------------------------------------------------
// Gemstone data per planet (planet id 0-8)
// ---------------------------------------------------------------------------

const GEMSTONE_DATA: Record<number, {
  name: { en: string; hi: string; sa: string };
  mantra: string;
  day: { en: string; hi: string; sa: string };
}> = {
  0: { name: { en: 'Ruby (Manikya)', hi: 'माणिक्य', sa: 'माणिक्यम्' }, mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', day: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः' } },
  1: { name: { en: 'Pearl (Moti)', hi: 'मोती', sa: 'मुक्ता' }, mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः', day: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः' } },
  2: { name: { en: 'Red Coral (Moonga)', hi: 'मूँगा', sa: 'प्रवालम्' }, mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' } },
  3: { name: { en: 'Emerald (Panna)', hi: 'पन्ना', sa: 'मरकतम्' }, mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', day: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' } },
  4: { name: { en: 'Yellow Sapphire (Pukhraj)', hi: 'पुखराज', sa: 'पुष्पराजम्' }, mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', day: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' } },
  5: { name: { en: 'Diamond (Heera)', hi: 'हीरा', sa: 'वज्रम्' }, mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', day: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः' } },
  6: { name: { en: 'Blue Sapphire (Neelam)', hi: 'नीलम', sa: 'नीलम्' }, mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' } },
  7: { name: { en: 'Hessonite (Gomed)', hi: 'गोमेद', sa: 'गोमेदम्' }, mantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः', day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' } },
  8: { name: { en: "Cat's Eye (Lehsunia)", hi: 'लहसुनिया', sa: 'वैदूर्यम्' }, mantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः', day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' } },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

// planetPositions from kundali_snapshots JSONB may have these fields
interface SnapshotPlanet {
  id?: number;
  planetId?: number;
  shadbala?: { total?: number; required?: number; ratio?: number };
  strengthRatio?: number;
}

interface Props {
  planetPositions: unknown[];
  locale: string;
}

export default function RemedySpotlightCard({ planetPositions, locale }: Props) {
  const loc = (locale as Locale) || 'en';
  const L = LABELS[loc] || LABELS.en;
  const isHi = isDevanagariLocale(loc);

  // Find the weakest planet by shadbala ratio from the snapshot data
  const weakestPlanet = useMemo(() => {
    if (!Array.isArray(planetPositions) || planetPositions.length === 0) return null;

    let weakest: { id: number; ratio: number } | null = null;

    for (const raw of planetPositions) {
      const p = raw as SnapshotPlanet;
      const pid = p.id ?? p.planetId;
      if (pid == null || pid > 8) continue;

      // Get strength ratio: either direct or computed from shadbala
      let ratio = p.strengthRatio;
      if (!ratio && p.shadbala) {
        ratio = p.shadbala.ratio ?? (
          p.shadbala.total && p.shadbala.required
            ? p.shadbala.total / p.shadbala.required
            : undefined
        );
      }
      // Default to 1.0 if no data — skip planet
      if (ratio == null) continue;

      if (!weakest || ratio < weakest.ratio) {
        weakest = { id: pid, ratio };
      }
    }

    return weakest;
  }, [planetPositions]);

  if (!weakestPlanet) return null;

  const gem = GEMSTONE_DATA[weakestPlanet.id];
  if (!gem) return null;

  const planetName = tl(GRAHAS[weakestPlanet.id]?.name || { en: 'Unknown', hi: 'अज्ञात', sa: 'अज्ञातम्' }, loc);
  const gemstoneName = tl(gem.name, loc);
  const dayName = tl(gem.day, loc);

  return (
    <motion.div {...fadeUp} transition={{ delay: 0.40, ease: 'easeOut' as const }}>
      <div className="p-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-gold-primary" />
          <h3
            className="text-gold-light font-semibold text-lg"
            style={isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
          >
            {L.title}
          </h3>
        </div>

        <div className="space-y-3">
          {/* Weakest Planet */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-xs" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {L.weakestPlanet}
            </span>
            <span className="text-amber-400 font-bold text-sm" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {planetName}
            </span>
          </div>

          {/* Gemstone */}
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-xs" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {L.gemstone}
            </span>
            <span className="text-gold-light font-bold text-sm" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {gemstoneName}
            </span>
          </div>

          {/* Beej Mantra */}
          <div className="mt-2 p-3 rounded-xl bg-gold-primary/5 border border-gold-primary/10">
            <p className="text-text-secondary text-[10px] uppercase tracking-wider mb-1">{L.mantra}</p>
            <p className="text-gold-light text-sm font-medium" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
              {gem.mantra}
            </p>
          </div>

          {/* Day */}
          <p className="text-text-secondary text-xs" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {L.wearOn}: <span className="text-gold-primary font-medium">{dayName}</span>
          </p>
        </div>

        {/* Link to remedies page */}
        <Link
          href={'/dashboard/remedies' as '/dashboard/remedies'}
          className="mt-4 inline-flex items-center gap-1.5 text-gold-primary text-sm font-bold hover:text-gold-light transition-colors"
        >
          {L.viewRemedies}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { authedFetch } from '@/lib/api/authed-fetch';
import BirthForm from '@/components/kundali/BirthForm';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import type { BirthData, ChartStyle } from '@/types/kundali';
import type { BNNReading, BNNPlanetReading } from '@/lib/nadi/bnn-engine';
import type { KarmicProfile } from '@/lib/nadi/karmic-profile';
import type { Locale } from '@/types/panchang';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';

// ─── Inline labels (4 active locales: en, hi, ta, bn) ─────────────────────
const LABELS = {
  en: {
    title: 'Nadi Jyotish',
    subtitle: 'Bhrigu Nandi Nadi — Planet·Sign Direct Reading',
    desc: 'BNN Nadi reads each planet directly in its sign, layering aspects and conjunctions to reveal the soul\'s encoded life map. Unlike Parashari, which emphasises house lordship, BNN emphasises the planet-in-sign as the primary karmic statement.',
    disclaimer: 'This reading is based on Bhrigu Nandi Nadi tradition and is for self-reflection and spiritual inquiry only. It does not replace the guidance of a qualified Jyotishi.',
    generate: 'Generate Nadi Reading',
    generating: 'Reading the Nadi leaves…',
    karmicTitle: 'Karmic Profile',
    karmicDesc: 'Past-life themes, Purva Punya, and this life\'s dharma path derived from Ketu, 5th lord, and 9th lord.',
    pastLife: 'Past-Life Theme',
    purvaPunya: 'Purva Punya (Past Merit)',
    dharmaPath: 'Dharma Path (Rahu)',
    karmicSummary: 'Summary',
    planetsTitle: 'Planet-in-Sign Readings',
    planetsDesc: 'BNN base prediction for each planet + aspect, conjunction, and retrograde modifiers.',
    lifeThemesTitle: 'Convergent Life Themes',
    lifeThemesDesc: 'Patterns that emerge from the combined planetary configuration.',
    retroLabel: 'Retrograde',
    aspectLabel: 'Aspect',
    conjLabel: 'Conjunction',
    houseLabel: 'House',
    modifiersLabel: 'Modifiers Active',
    bnnNote: 'BNN vs Parashari: BNN reads planet-in-sign directly as the primary karmic statement. Parashari emphasises house lordship and the running dasha period. Both are complementary views of the same chart.',
    error: 'Failed to generate reading. Please try again.',
  },
  hi: {
    title: 'नाड़ी ज्योतिष',
    subtitle: 'भृगु नंदी नाड़ी — ग्रह·राशि प्रत्यक्ष पठन',
    desc: 'BNN नाड़ी प्रत्येक ग्रह को उसकी राशि में सीधे पढ़ती है, दृष्टि और युति को जोड़कर आत्मा का जीवन मानचित्र प्रकट करती है। पाराशरी के विपरीत, जो भाव स्वामित्व पर जोर देती है, BNN ग्रह-राशि को प्राथमिक कार्मिक वक्तव्य मानती है।',
    disclaimer: 'यह पठन भृगु नंदी नाड़ी परंपरा पर आधारित है और केवल आत्म-चिंतन के लिए है। यह किसी योग्य ज्योतिषी के मार्गदर्शन का विकल्प नहीं है।',
    generate: 'नाड़ी पठन करें',
    generating: 'नाड़ी पत्रों को पढ़ा जा रहा है…',
    karmicTitle: 'कार्मिक प्रोफ़ाइल',
    karmicDesc: 'केतु, पंचम स्वामी और नवम स्वामी से इस जन्म के पूर्व जीवन विषय, पूर्व पुण्य और धर्म मार्ग।',
    pastLife: 'पूर्व जीवन विषय',
    purvaPunya: 'पूर्व पुण्य',
    dharmaPath: 'धर्म मार्ग (राहु)',
    karmicSummary: 'सारांश',
    planetsTitle: 'ग्रह-राशि पठन',
    planetsDesc: 'प्रत्येक ग्रह के लिए BNN आधार भविष्यवाणी + दृष्टि, युति और वक्री संशोधक।',
    lifeThemesTitle: 'अभिसारी जीवन विषय',
    lifeThemesDesc: 'संयुक्त ग्रह विन्यास से उभरने वाले पैटर्न।',
    retroLabel: 'वक्री',
    aspectLabel: 'दृष्टि',
    conjLabel: 'युति',
    houseLabel: 'भाव',
    modifiersLabel: 'सक्रिय संशोधक',
    bnnNote: 'BNN बनाम पाराशरी: BNN ग्रह-राशि को प्राथमिक कार्मिक वक्तव्य के रूप में सीधे पढ़ती है। पाराशरी भाव स्वामित्व और चल रही दशा पर जोर देती है। दोनों एक ही कुण्डली के पूरक दृष्टिकोण हैं।',
    error: 'पठन उत्पन्न करने में विफल। कृपया पुनः प्रयास करें।',
  },
  ta: {
    title: 'நாடி ஜோதிடம்',
    subtitle: 'பிருகு நந்தி நாடி — கிரக·ராசி நேரடி வாசிப்பு',
    desc: 'BNN நாடி ஒவ்வொரு கிரகத்தையும் அதன் ராசியில் நேரடியாக வாசிக்கிறது, தோற்றங்கள் மற்றும் இணைவுகளை அடுக்கி ஆத்மாவின் வாழ்க்கை வரைபடத்தை வெளிப்படுத்துகிறது.',
    disclaimer: 'இந்த வாசிப்பு பிருகு நந்தி நாடி மரபின் அடிப்படையிலானது மற்றும் சுய-ஆராய்ச்சிக்காக மட்டுமே.',
    generate: 'நாடி வாசிப்பு உருவாக்கு',
    generating: 'நாடி இலைகளை வாசிக்கிறோம்…',
    karmicTitle: 'கர்ம சுயவிவரம்',
    karmicDesc: 'கேது, 5-ம் இடம் ஆண்டவர், 9-ம் இடம் ஆண்டவர் ஆகியோரிடமிருந்து இந்த வாழ்வின் கர்ம கோட்பாடுகள்.',
    pastLife: 'முந்தைய வாழ்க்கை கோட்பாடு',
    purvaPunya: 'பூர்வ புண்யம்',
    dharmaPath: 'தர்ம பாதை (ராகு)',
    karmicSummary: 'சுருக்கம்',
    planetsTitle: 'கிரக-ராசி வாசிப்புகள்',
    planetsDesc: 'ஒவ்வொரு கிரகத்திற்கும் BNN அடிப்படை கணிப்பு + தோற்றம், இணைவு மற்றும் வக்கிர மாற்றிகள்.',
    lifeThemesTitle: 'ஒன்றிணைந்த வாழ்க்கை கோட்பாடுகள்',
    lifeThemesDesc: 'கூட்டு கோளங்களின் அமைப்பிலிருந்து வெளிப்படும் வடிவங்கள்.',
    retroLabel: 'வக்கிரம்',
    aspectLabel: 'தோற்றம்',
    conjLabel: 'இணைவு',
    houseLabel: 'இடம்',
    modifiersLabel: 'செயலில் உள்ள மாற்றிகள்',
    bnnNote: 'BNN vs பாராஷரி: BNN கிரக-ராசியை நேரடியாக படிக்கிறது. பாராஷரி வீட்டு ஆட்சி மற்றும் இயங்கும் தசையை வலியுறுத்துகிறது.',
    error: 'வாசிப்பு உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  },
  bn: {
    title: 'নাড়ি জ্যোতিষ',
    subtitle: 'ভৃগু নন্দি নাড়ি — গ্রহ·রাশি সরাসরি পাঠ',
    desc: 'BNN নাড়ি প্রতিটি গ্রহকে তার রাশিতে সরাসরি পড়ে, দৃষ্টি এবং যোগ যুক্ত করে আত্মার জীবন মানচিত্র প্রকাশ করে।',
    disclaimer: 'এই পাঠটি ভৃগু নন্দি নাড়ি ঐতিহ্যের উপর ভিত্তি করে এবং শুধুমাত্র আত্ম-চিন্তনের জন্য।',
    generate: 'নাড়ি পাঠ তৈরি করুন',
    generating: 'নাড়ি পাতা পড়া হচ্ছে…',
    karmicTitle: 'কার্মিক প্রোফাইল',
    karmicDesc: 'কেতু, ৫ম ভাব প্রভু এবং ৯ম ভাব প্রভু থেকে এই জন্মের কার্মিক থিম।',
    pastLife: 'পূর্বজন্মের থিম',
    purvaPunya: 'পূর্ব পুণ্য',
    dharmaPath: 'ধর্ম পথ (রাহু)',
    karmicSummary: 'সারসংক্ষেপ',
    planetsTitle: 'গ্রহ-রাশি পাঠ',
    planetsDesc: 'প্রতিটি গ্রহের জন্য BNN বেস পূর্বাভাস + দৃষ্টি, যোগ এবং বক্রী মডিফায়ার।',
    lifeThemesTitle: 'অভিসারী জীবন থিম',
    lifeThemesDesc: 'সম্মিলিত গ্রহ বিন্যাস থেকে উদ্ভূত নিদর্শন।',
    retroLabel: 'বক্রী',
    aspectLabel: 'দৃষ্টি',
    conjLabel: 'যোগ',
    houseLabel: 'ভাব',
    modifiersLabel: 'সক্রিয় মডিফায়ার',
    bnnNote: 'BNN বনাম পারাশর: BNN গ্রহ-রাশিকে সরাসরি পড়ে। পারাশর ভাব আধিপত্য ও চলমান দশাকে গুরুত্ব দেয়।',
    error: 'পাঠ তৈরি করতে ব্যর্থ। আবার চেষ্টা করুন।',
  },
};

type L = keyof typeof LABELS;

const PLANET_ICONS: Record<number, string> = {
  0: '☀', 1: '☽', 2: '♂', 3: '☿', 4: '♃', 5: '♀', 6: '♄', 7: '☊', 8: '☋',
};

const MODIFIER_COLORS: Record<string, string> = {
  aspect: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
  conjunction: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  retrograde: 'text-purple-300 bg-purple-500/10 border-purple-500/20',
};

// ─── Sub-components ───────────────────────────────────────────────────────

function PlanetCard({ reading, labels, locale }: { reading: BNNPlanetReading; labels: typeof LABELS['en']; locale: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-[#d4a853]/20 rounded-xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left p-4 flex items-center gap-3 hover:bg-white/[0.04] transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/30 flex items-center justify-center shrink-0">
          <GrahaIconById id={reading.planetId} size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#f0d48a]">{reading.planetName}</span>
            <span className="text-[#8a8478] text-sm">in</span>
            <div className="flex items-center gap-1">
              <RashiIconById id={reading.sign} size={16} />
              <span className="text-[#e6e2d8] text-sm font-medium">{reading.signName}</span>
            </div>
            <span className="text-[#8a8478] text-xs">· {labels.houseLabel} {reading.house}</span>
            {reading.isRetrograde && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                ℞ {labels.retroLabel}
              </span>
            )}
          </div>
          {reading.modifiers.length > 0 && (
            <div className="text-xs text-[#8a8478] mt-0.5">
              {reading.modifiers.length} {labels.modifiersLabel}
            </div>
          )}
        </div>
        <span className="text-[#d4a853] text-lg shrink-0">{expanded ? '−' : '+'}</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-[#d4a853]/10 pt-4">
              {/* Base prediction */}
              <div>
                <p className="text-xs font-medium text-[#d4a853] uppercase tracking-wide mb-1">
                  Base Reading
                </p>
                <p className="text-[#e6e2d8] text-sm leading-relaxed">{reading.basePrediction}</p>
              </div>

              {/* Modifiers */}
              {reading.modifiers.length > 0 && (
                <div className="space-y-2">
                  {reading.modifiers.map((mod, i) => (
                    <div
                      key={i}
                      className={`rounded-lg border p-3 ${MODIFIER_COLORS[mod.type] ?? 'text-[#e6e2d8] bg-white/[0.06] border-white/10'}`}
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide block mb-1">
                        {mod.type === 'aspect' ? labels.aspectLabel :
                         mod.type === 'conjunction' ? labels.conjLabel :
                         labels.retroLabel}
                        {' · '}{mod.source}
                      </span>
                      <p className="text-sm leading-relaxed">{mod.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Combined reading */}
              {reading.modifiers.length > 0 && (
                <div className="bg-[#d4a853]/5 border border-[#d4a853]/15 rounded-lg p-3">
                  <p className="text-xs font-medium text-[#d4a853] uppercase tracking-wide mb-1">
                    Combined Reading
                  </p>
                  <p className="text-[#e6e2d8] text-sm leading-relaxed">{reading.combinedReading}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function KarmicCard({ profile, labels }: { profile: KarmicProfile; labels: typeof LABELS['en'] }) {
  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-[#d4a853]/30 rounded-xl p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#d4a853]/15 border border-[#d4a853]/30 flex items-center justify-center shrink-0 text-lg">
          🌀
        </div>
        <div>
          <h3 className="text-[#f0d48a] font-semibold text-lg">{labels.karmicTitle}</h3>
          <p className="text-[#8a8478] text-sm">{labels.karmicDesc}</p>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="bg-[#0a0e27] border border-white/5 rounded-lg p-3">
          <p className="text-xs font-semibold text-purple-300 uppercase tracking-wide mb-1">{labels.pastLife}</p>
          <p className="text-[#e6e2d8] text-sm leading-relaxed">{profile.pastLifeTheme}</p>
        </div>
        <div className="bg-[#0a0e27] border border-white/5 rounded-lg p-3">
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-wide mb-1">{labels.purvaPunya}</p>
          <p className="text-[#e6e2d8] text-sm leading-relaxed">{profile.purvaPunya}</p>
        </div>
        <div className="bg-[#0a0e27] border border-white/5 rounded-lg p-3">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-1">{labels.dharmaPath}</p>
          <p className="text-[#e6e2d8] text-sm leading-relaxed">{profile.dharmaPath}</p>
        </div>
        <div className="bg-[#d4a853]/8 border border-[#d4a853]/20 rounded-lg p-3">
          <p className="text-xs font-semibold text-[#d4a853] uppercase tracking-wide mb-1">{labels.karmicSummary}</p>
          <p className="text-[#e6e2d8] text-sm leading-relaxed">{profile.summary}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────

export default function NadiJyotishPage() {
  const locale = useLocale() as Locale;
  const learnLinks = getLearnLinksForTool('/nadi-jyotish');
  const lk = (LABELS[locale as L] ?? LABELS.en);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bnnReading, setBnnReading] = useState<BNNReading | null>(null);
  const [karmicProfile, setKarmicProfile] = useState<KarmicProfile | null>(null);

  // BirthForm passes (data, style) — we only need data for BNN
  async function handleSubmit(data: BirthData, _style: ChartStyle) {
    setLoading(true);
    setError(null);
    setBnnReading(null);
    setKarmicProfile(null);

    try {
      const res = await authedFetch('/api/nadi', {
        method: 'POST',
        body: JSON.stringify({ ...data, locale }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? lk.error);
      }

      const result = await res.json() as { bnnReading: BNNReading; karmicProfile: KarmicProfile };
      setBnnReading(result.bnnReading);
      setKarmicProfile(result.karmicProfile);
    } catch (err) {
      console.error('[nadi-jyotish] reading failed:', err);
      setError(err instanceof Error ? err.message : lk.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e6e2d8] pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#d4a853]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b69]/20 via-transparent to-[#0a0e27]" />
        <div className="relative max-w-4xl mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/20 text-[#d4a853] text-sm font-medium mb-4">
              <span>📜</span>
              <span>Bhrigu Nandi Nadi</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#f0d48a] mb-3">{lk.title}</h1>
            <p className="text-[#d4a853] text-lg mb-4">{lk.subtitle}</p>
            <p className="text-[#8a8478] text-sm max-w-2xl mx-auto leading-relaxed">{lk.desc}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Birth Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-[#d4a853]/20 rounded-2xl p-6"
        >
          <BirthForm
            onSubmit={handleSubmit}
            loading={loading}
          />
        </motion.div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-12 text-[#d4a853]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-[#d4a853]/30 border-t-[#d4a853] rounded-full"
            />
            <span className="text-sm">{lk.generating}</span>
          </div>
        )}

        <AnimatePresence>
          {bnnReading && karmicProfile && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Karmic Profile */}
              <KarmicCard profile={karmicProfile} labels={lk} />

              {/* Life Themes */}
              {bnnReading.lifeThemes.length > 0 && (
                <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-[#d4a853]/20 rounded-xl p-5">
                  <h3 className="text-[#f0d48a] font-semibold text-lg mb-1">{lk.lifeThemesTitle}</h3>
                  <p className="text-[#8a8478] text-sm mb-4">{lk.lifeThemesDesc}</p>
                  <ul className="space-y-2">
                    {bnnReading.lifeThemes.map((theme, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#e6e2d8] leading-relaxed">
                        <span className="text-[#d4a853] mt-0.5 shrink-0">◈</span>
                        {theme}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Planet readings */}
              <div>
                <div className="mb-4">
                  <h3 className="text-[#f0d48a] font-semibold text-lg">{lk.planetsTitle}</h3>
                  <p className="text-[#8a8478] text-sm">{lk.planetsDesc}</p>
                </div>
                <div className="space-y-3">
                  {bnnReading.planets.map(planet => (
                    <PlanetCard
                      key={planet.planetId}
                      reading={planet}
                      labels={lk}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>

              {/* BNN vs Parashari comparison note */}
              <div className="bg-[#0a0e27] border border-[#d4a853]/10 rounded-xl p-4">
                <p className="text-xs text-[#8a8478] leading-relaxed">
                  <span className="text-[#d4a853] font-medium">ℹ {lk.bnnNote.split(':')[0]}:</span>{' '}
                  {lk.bnnNote.split(':').slice(1).join(':')}
                </p>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-[#8a8478] text-center leading-relaxed px-4">{lk.disclaimer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <RelatedLinks type="learn" links={learnLinks} locale={locale} />
    </div>
  );
}

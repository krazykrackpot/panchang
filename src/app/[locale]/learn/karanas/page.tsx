'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { KARANAS } from '@/lib/constants/karanas';
import { Link } from '@/lib/i18n/navigation';
import { ChevronDown } from 'lucide-react';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/karanas.json';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';

const t_ = LJ as unknown as Record<string, LocaleText>;



/* ─── Karana detailed data (inline, not in constants file) ─── */
const KARANA_DETAILS: Record<string, {
  deity: Record<string, string>;
  nature: 'auspicious' | 'neutral' | 'inauspicious';
  meaning: Record<string, string>;
  bestFor: Record<string, string>;
}> = {
  Bava: {
    deity: { en: 'Indra', hi: 'इन्द्र' },
    nature: 'auspicious',
    meaning: { en: 'Power & authority', hi: 'शक्ति और अधिकार' },
    bestFor: { en: 'Government work, ceremonies, construction, leadership tasks', hi: 'शासकीय कार्य, संस्कार, निर्माण, नेतृत्व कार्य' },
  },
  Balava: {
    deity: { en: 'Brahma', hi: 'ब्रह्मा' },
    nature: 'auspicious',
    meaning: { en: 'Creative energy', hi: 'सृजन ऊर्जा' },
    bestFor: { en: 'Education, marriage, writing, artistic pursuits, worship', hi: 'शिक्षा, विवाह, लेखन, कलात्मक कार्य, पूजा' },
  },
  Kaulava: {
    deity: { en: 'Mitra', hi: 'मित्र' },
    nature: 'auspicious',
    meaning: { en: 'Friendship & harmony', hi: 'मित्रता और सामंजस्य' },
    bestFor: { en: 'Friendships, partnerships, social gatherings, reconciliation', hi: 'मित्रता, साझेदारी, सामाजिक सभा, मेल-मिलाप' },
  },
  Taitila: {
    deity: { en: 'Aryaman', hi: 'अर्यमन्' },
    nature: 'auspicious',
    meaning: { en: 'Wealth & prosperity', hi: 'धन और समृद्धि' },
    bestFor: { en: 'Financial matters, property, jewelry, investments', hi: 'वित्तीय कार्य, सम्पत्ति, आभूषण, निवेश' },
  },
  Garaja: {
    deity: { en: 'Prithvi (Earth)', hi: 'पृथ्वी' },
    nature: 'auspicious',
    meaning: { en: 'Stability & grounding', hi: 'स्थिरता और आधार' },
    bestFor: { en: 'Agriculture, house construction, land purchase, housewarming', hi: 'कृषि, गृह निर्माण, भूमि क्रय, गृहप्रवेश' },
  },
  Vanija: {
    deity: { en: 'Lakshmi', hi: 'लक्ष्मी' },
    nature: 'neutral',
    meaning: { en: 'Commerce & trade', hi: 'वाणिज्य और व्यापार' },
    bestFor: { en: 'Business deals, trade, sales, market activities, sowing crops', hi: 'व्यापारिक सौदे, विक्रय, बाजार गतिविधियां, बुआई' },
  },
  Vishti: {
    deity: { en: 'Yama', hi: 'यम' },
    nature: 'inauspicious',
    meaning: { en: 'Obstruction & destruction', hi: 'बाधा और विनाश' },
    bestFor: { en: 'AVOID for all auspicious work. Only suitable for demolition, confrontation, warfare, or acts of destruction', hi: 'सभी शुभ कार्यों में त्याज्य। केवल ध्वंस, संघर्ष, युद्ध या विनाश के कार्यों में उपयुक्त' },
  },
  Shakuni: {
    deity: { en: 'Garuda', hi: 'गरुड़' },
    nature: 'neutral',
    meaning: { en: 'Omen-reading, divination', hi: 'शकुन-विचार, भविष्यवाणी' },
    bestFor: { en: 'Preparing medicines, poison-related work, divination, tantric practices', hi: 'औषधि निर्माण, विष सम्बन्धी कार्य, भविष्यवाणी, तान्त्रिक साधना' },
  },
  Chatushpada: {
    deity: { en: 'Rudra', hi: 'रुद्र' },
    nature: 'neutral',
    meaning: { en: 'Four-footed, stability', hi: 'चतुष्पद, स्थिरता' },
    bestFor: { en: 'Animal husbandry, cattle purchase, veterinary work, stable foundations', hi: 'पशुपालन, पशु क्रय, पशु चिकित्सा, स्थिर आधार कार्य' },
  },
  Nagava: {
    deity: { en: 'Naga (Serpent)', hi: 'नाग' },
    nature: 'inauspicious',
    meaning: { en: 'Hidden dangers, underworld', hi: 'छिपे हुए संकट, पाताल' },
    bestFor: { en: 'Cruel acts, destructive tasks, underground work. Avoid travel and ceremonies', hi: 'क्रूर कर्म, विध्वंसक कार्य, भूमिगत कार्य। यात्रा और संस्कारों में त्याज्य' },
  },
  Kimstughna: {
    deity: { en: 'Vayu', hi: 'वायु' },
    nature: 'auspicious',
    meaning: { en: 'Destroyer of negativity', hi: 'नकारात्मकता का नाशक' },
    bestFor: { en: 'Charity, spiritual practices, Shraddha, overcoming obstacles. A surprisingly auspicious fixed karana', hi: 'दान, आध्यात्मिक साधना, श्राद्ध, बाधा निवारण। एक आश्चर्यजनक शुभ स्थिर करण' },
  },
};

/* ─── Cycle position map showing all 60 karanas ─── */
const CYCLE_POSITIONS = [
  { pos: 1, name: 'Kimstughna', type: 'sthira' as const, tithi: 'Shukla 1, 1st half' },
  ...Array.from({ length: 56 }, (_, i) => {
    const charaNames = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti'];
    const pos = i + 2;
    const tithiNum = Math.floor(pos / 2) + 1;
    const half = pos % 2 === 0 ? '2nd' : '1st';
    const paksha = tithiNum <= 15 ? 'Shukla' : 'Krishna';
    const tithiInPaksha = tithiNum <= 15 ? tithiNum : tithiNum - 15;
    return {
      pos,
      name: charaNames[i % 7],
      type: 'chara' as const,
      tithi: `${paksha} ${tithiInPaksha}, ${half} half`,
    };
  }),
  { pos: 58, name: 'Shakuni', type: 'sthira' as const, tithi: 'Krishna 14, 2nd half' },
  { pos: 59, name: 'Chatushpada', type: 'sthira' as const, tithi: 'Amavasya, 1st half' },
  { pos: 60, name: 'Naga', type: 'sthira' as const, tithi: 'Amavasya, 2nd half' },
];

const natureColor = (nature: string) => {
  if (nature === 'auspicious') return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  if (nature === 'neutral') return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
  return 'text-red-400 border-red-500/20 bg-red-500/5';
};

const natureLabel = (nature: string, locale: string) => {
  if (nature === 'auspicious') return !isIndicLocale(locale) ? 'Shubha' : 'शुभ';
  if (nature === 'neutral') return !isIndicLocale(locale) ? 'Mishra' : 'मिश्र';
  return !isIndicLocale(locale) ? 'Ashubha' : 'अशुभ';
};

export default function LearnKaranasPage() {
  const locale = useLocale();
  const t = (key: string) => lt(t_[key], locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tObj = (obj: any) => (obj as Record<string, string>)[locale] || obj?.en || '';
  const loc = isIndicLocale(locale) ? 'hi' as const : 'en' as const; // fallback sa -> hi for inline labels

  const chara = KARANAS.filter(k => k.type === 'chara');
  const sthira = KARANAS.filter(k => k.type === 'sthira');
  const [expandedKarana, setExpandedKarana] = useState<string | null>(null);
  const [showFullCycle, setShowFullCycle] = useState(false);

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      {/* ─── Section 1: What is a Karana? ─── */}
      <LessonSection number={1} title={t('whatIs')}>
        <p>{t('whatIsBody')}</p>
        <p>{t('whatIsBody2')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">1 Karana = 6{'\u00B0'} of Moon-Sun elongation = {'\u00BD'} Tithi</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">1 Tithi = 12{'\u00B0'} = 2 Karanas</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">30 Tithis x 2 = 60 Karanas per lunar month</p>
        </div>
      </LessonSection>

      {/* ─── Section 2: The 11 Types ─── */}
      <LessonSection number={2} title={t('elevenTypes')}>
        <p>{t('elevenBody')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-lg border border-gold-primary/20 bg-gold-primary/5">
            <h4 className="text-gold-light font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{t('charaLabel')}</h4>
            <p className="text-text-secondary text-sm">{t('charaDesc')}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {chara.map(k => (
                <span key={k.number} className={`text-xs px-2 py-0.5 rounded-full border ${k.name.en === 'Vishti' ? 'border-red-500/30 text-red-400' : 'border-gold-primary/20 text-gold-light'}`}>
                  {tObj(k.name)}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-lg border border-amber-500/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
            <h4 className="text-amber-300 font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{t('sthiraLabel')}</h4>
            <p className="text-text-secondary text-sm">{t('sthiraDesc')}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {sthira.map(k => (
                <span key={k.number} className="text-xs px-2 py-0.5 rounded-full border border-amber-500/20 text-amber-300">
                  {tObj(k.name)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10 text-center">
          <p className="text-gold-light font-mono text-sm">{t('totalFormula')}</p>
        </div>
      </LessonSection>

      {/* ─── Section 3: Calculation Formula ─── */}
      <LessonSection number={3} title={t('calcTitle')}>
        <p>{t('calcBody')}</p>

        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Karana Position = floor((Moon{'\u00B0'} - Sun{'\u00B0'}) / 6) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">If elongation {'<'} 0, add 360{'\u00B0'} (normalize to 0-360)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Position 1 = Kimstughna (sthira)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Positions 2-57 = Chara cycle: (pos-2) mod 7 maps to Bava(0)...Vishti(6)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Positions 58,59,60 = Shakuni, Chatushpada, Naga (sthira)</p>
        </div>

        <div className="mt-5 p-5 rounded-xl border border-gold-primary/15 bg-gold-primary/5">
          <h4 className="text-gold-light font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{t('workedExample')}</h4>
          <p className="text-text-secondary text-sm mb-3">{t('workedBody')}</p>
          <div className="space-y-2">
            {[t('step1'), t('step2'), t('step3'), t('step4')].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <p className="text-text-secondary text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* ─── Section 4: Deity & Nature (expandable cards) ─── */}
      <LessonSection number={4} title={t('deityTitle')}>
        <p>{t('deityBody')}</p>

        <div className="space-y-3 mt-4">
          {[...chara, ...sthira].map((k, i) => {
            const detail = KARANA_DETAILS[k.name.en];
            if (!detail) return null;
            const isExpanded = expandedKarana === k.name.en;
            return (
              <motion.div
                key={k.number}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl border overflow-hidden ${
                  k.name.en === 'Vishti' ? 'border-red-500/20' :
                  k.type === 'sthira' ? 'border-amber-500/15' :
                  'border-gold-primary/10'
                }`}
              >
                <button
                  onClick={() => setExpandedKarana(isExpanded ? null : k.name.en)}
                  className="w-full text-left p-4 hover:bg-gold-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-xl w-8 ${k.type === 'sthira' ? 'text-amber-400' : 'text-gold-primary'}`}>{k.number}</span>
                      <div>
                        <span className="text-gold-light font-bold">{tObj(k.name)}</span>
                        {locale !== 'en' && <span className="ml-2 text-text-secondary/70 text-xs">{k.name.en}</span>}
                        <span className="ml-2 text-text-secondary/65 text-xs">({tObj(detail.deity)})</span>
                        {k.type === 'sthira' && (
                          <span className="ml-2 px-1.5 py-0.5 bg-amber-500/15 text-amber-300 text-xs rounded-full font-bold uppercase">
                            {loc === 'en' ? 'Fixed' : 'स्थिर'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${natureColor(detail.nature)}`}>
                        {natureLabel(detail.nature, loc)}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-text-secondary/70 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  <p className="text-text-secondary/70 text-sm ml-11 mt-1">{tObj(detail.meaning)}</p>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 ml-11 border-t border-gold-primary/10 pt-3">
                        <h4 className="text-xs font-semibold text-gold-primary/70 uppercase tracking-wider mb-1">
                          {loc === 'en' ? 'Best Activities' : 'उपयुक्त कार्य'}
                        </h4>
                        <p className="text-text-secondary text-sm">{tObj(detail.bestFor)}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* ─── Section 5: Auspicious vs Inauspicious ─── */}
      <LessonSection number={5} title={t('auspTitle')}>
        <p>{t('auspBody')}</p>

        <div className="space-y-4 mt-4">
          {/* Auspicious */}
          <div className="p-4 rounded-lg border border-emerald-500/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
            <h4 className="text-emerald-400 font-bold mb-2">{t('goodLabel')}</h4>
            <p className="text-text-secondary text-sm">{t('goodKaranas')}</p>
          </div>
          {/* Neutral */}
          <div className="p-4 rounded-lg border border-amber-500/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
            <h4 className="text-amber-400 font-bold mb-2">{t('neutralLabel')}</h4>
            <p className="text-text-secondary text-sm">{t('neutralKaranas')}</p>
          </div>
          {/* Inauspicious */}
          <div className="p-4 rounded-lg border border-red-500/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
            <h4 className="text-red-400 font-bold mb-2">{t('badLabel')}</h4>
            <p className="text-text-secondary text-sm">{t('badKaranas')}</p>
          </div>
        </div>
      </LessonSection>

      {/* ─── Section 6: Fixed Karanas Deep Dive ─── */}
      <LessonSection number={6} title={t('fixedTitle')}>
        <p>{t('fixedBody')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {sthira.map((k, i) => {
            const detail = KARANA_DETAILS[k.name.en];
            if (!detail) return null;
            const positions: Record<string, { pos: string; tithi: Record<string, string> }> = {
              Kimstughna: { pos: '1', tithi: { en: 'Shukla Pratipada, 1st half', hi: 'शुक्ल प्रतिपदा, प्रथम भाग' } },
              Shakuni: { pos: '58', tithi: { en: 'Krishna Chaturdashi, 2nd half', hi: 'कृष्ण चतुर्दशी, द्वितीय भाग' } },
              Chatushpada: { pos: '59', tithi: { en: 'Amavasya, 1st half', hi: 'अमावस्या, प्रथम भाग' } },
              Nagava: { pos: '60', tithi: { en: 'Amavasya, 2nd half', hi: 'अमावस्या, द्वितीय भाग' } },
            };
            const posInfo = positions[k.name.en];
            return (
              <motion.div
                key={k.number}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-amber-400 text-2xl font-bold">#{posInfo?.pos}</span>
                  <div>
                    <div className="text-gold-light font-bold text-lg">{tObj(k.name)}</div>
                    {locale !== 'en' && <div className="text-text-secondary/70 text-xs">{k.name.en}</div>}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary/75">{loc === 'en' ? 'Deity' : 'देवता'}</span>
                    <span className="text-gold-light">{tObj(detail.deity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary/75">{loc === 'en' ? 'Nature' : 'स्वभाव'}</span>
                    <span className={natureColor(detail.nature).split(' ')[0]}>{natureLabel(detail.nature, loc)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary/75">{loc === 'en' ? 'Occurs at' : 'स्थान'}</span>
                    <span className="text-text-secondary text-xs text-right">{posInfo ? tObj(posInfo.tithi) : ''}</span>
                  </div>
                  <div className="pt-2 border-t border-gold-primary/10">
                    <p className="text-text-secondary/80 text-xs leading-relaxed">{tObj(detail.bestFor)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* ─── Section 7: Karana & Muhurta Selection ─── */}
      <LessonSection number={7} title={t('muhurtaTitle')}>
        <p>{t('muhurtaBody')}</p>

        <div className="space-y-3 mt-4">
          {[t('muhurtaRule1'), t('muhurtaRule2'), t('muhurtaRule3'), t('muhurtaRule4')].map((rule, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gold-primary/10 bg-bg-primary/30">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <p className="text-text-secondary text-sm">{rule}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ─── Section 8: Cycle Through the Lunar Month ─── */}
      <LessonSection number={8} title={t('cycleTitle')}>
        <p>{t('cycleBody')}</p>

        <div className="space-y-3 mt-4">
          {[t('cycleStep1'), t('cycleStep2'), t('cycleStep3')].map((step, i) => (
            <div key={i} className="p-3 rounded-lg border border-gold-primary/10 bg-bg-primary/30">
              <p className="text-text-secondary text-sm">{step}</p>
            </div>
          ))}
        </div>

        {/* Expandable full 60-position table */}
        <div className="mt-5">
          <button
            onClick={() => setShowFullCycle(!showFullCycle)}
            className="flex items-center gap-2 text-gold-light text-sm font-medium hover:text-gold-primary transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showFullCycle ? 'rotate-180' : ''}`} />
            {loc === 'en' ? 'View all 60 Karana positions' : 'सभी 60 करण स्थान देखें'}
          </button>
          <AnimatePresence>
            {showFullCycle && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 max-h-96 overflow-y-auto rounded-lg border border-gold-primary/10">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-bg-primary/95">
                      <tr className="border-b border-gold-primary/20">
                        <th className="text-left p-2 text-gold-primary/70 font-semibold">#</th>
                        <th className="text-left p-2 text-gold-primary/70 font-semibold">{loc === 'en' ? 'Karana' : 'करण'}</th>
                        <th className="text-left p-2 text-gold-primary/70 font-semibold">{loc === 'en' ? 'Type' : 'प्रकार'}</th>
                        <th className="text-left p-2 text-gold-primary/70 font-semibold">{loc === 'en' ? 'Tithi Position' : 'तिथि स्थान'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CYCLE_POSITIONS.map(cp => (
                        <tr
                          key={cp.pos}
                          className={`border-b border-gold-primary/5 ${
                            cp.name === 'Vishti' ? 'bg-red-500/5' :
                            cp.type === 'sthira' ? 'bg-amber-500/5' : ''
                          }`}
                        >
                          <td className="p-2 text-gold-primary/60 font-mono">{cp.pos}</td>
                          <td className={`p-2 font-medium ${cp.name === 'Vishti' ? 'text-red-400' : cp.type === 'sthira' ? 'text-amber-300' : 'text-gold-light'}`}>
                            {cp.name}
                          </td>
                          <td className="p-2 text-text-secondary/70">{cp.type}</td>
                          <td className="p-2 text-text-secondary/75">{cp.tithi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LessonSection>

      {/* ─── Section 9: Cross-References ─── */}
      <LessonSection number={9} title={t('crossRefTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: '/learn/tithis' as const, label: t('crossRefTithi') },
            { href: '/learn/yogas' as const, label: t('crossRefYoga') },
            { href: '/learn/muhurtas' as const, label: t('crossRefMuhurta') },
            { href: '/learn/nakshatras' as const, label: t('crossRefNakshatra') },
          ].map((ref, i) => (
            <Link
              key={i}
              href={ref.href}
              className="flex items-center gap-2 p-3 rounded-lg border border-gold-primary/10 bg-bg-primary/30 hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-all text-sm text-text-secondary hover:text-gold-light"
            >
              <span className="text-gold-primary">{'>'}</span>
              {ref.label}
            </Link>
          ))}
        </div>
      </LessonSection>

      {/* ─── CTA ─── */}
      <div className="mt-6 text-center">
        <Link
          href="/panchang"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('viewPanchang')}
        </Link>
      </div>
    </div>
  );
}

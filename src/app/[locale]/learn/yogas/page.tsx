'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { YOGAS } from '@/lib/constants/yogas';
import { Link } from '@/lib/i18n/navigation';
import { ChevronDown, Crown, Coins, Star, AlertTriangle, Sparkles, Shield } from 'lucide-react';
import type { Locale } from '@/types/panchang';

// ─── Kundali Yoga data (Raja, Dhana, Mahapurusha, etc.) ─────────────────────
interface KYogaDef { id: string; name: { en: string; hi: string }; category: string; planets: string; condition: { en: string; hi: string }; effect: { en: string; hi: string }; classical: string; strength: 'rare' | 'common' | 'moderate'; auspicious: boolean; }

const KY_CATEGORIES = [
  { key: 'mahapurusha', label: { en: 'Pancha Mahapurusha Yogas', hi: 'पंच महापुरुष योग' }, icon: Crown, color: 'text-amber-400', desc: { en: 'Formed when Mars, Mercury, Jupiter, Venus, or Saturn is in own sign or exaltation in a kendra (1,4,7,10). These produce extraordinary individuals.', hi: 'मंगल, बुध, गुरु, शुक्र या शनि अपनी/उच्च राशि में केंद्र में। असाधारण व्यक्तित्व बनाते हैं।' } },
  { key: 'raja', label: { en: 'Raja Yogas (Power)', hi: 'राज योग' }, icon: Crown, color: 'text-gold-light', desc: { en: 'Kendra lord + Trikona lord conjunction/aspect/exchange creates power, position, authority.', hi: 'केंद्रेश + त्रिकोणेश की युति/दृष्टि/परिवर्तन — शक्ति, पद, अधिकार।' } },
  { key: 'dhana', label: { en: 'Dhana Yogas (Wealth)', hi: 'धन योग' }, icon: Coins, color: 'text-emerald-400', desc: { en: '2nd/11th lord combinations and special wealth-indicating configurations.', hi: '2/11वें भावेश संयोग और विशेष धन-सूचक योग।' } },
  { key: 'chandra', label: { en: 'Chandra Yogas', hi: 'चंद्र योग' }, icon: Star, color: 'text-blue-300', desc: { en: 'Yogas formed relative to Moon — governing mind, emotions, public life.', hi: 'चंद्र से बनने वाले योग — मन, भावनाएं, सार्वजनिक जीवन।' } },
  { key: 'special', label: { en: 'Special Yogas', hi: 'विशेष योग' }, icon: Sparkles, color: 'text-violet-400', desc: { en: 'Neecha Bhanga, Viparita Raja, Parivartana — unique transformative combinations.', hi: 'नीच भंग, विपरीत राज, परिवर्तन — विशेष परिवर्तनकारी योग।' } },
  { key: 'inauspicious', label: { en: 'Inauspicious Yogas', hi: 'अशुभ योग' }, icon: AlertTriangle, color: 'text-red-400', desc: { en: 'Challenging combinations with remedies available.', hi: 'चुनौतीपूर्ण योग — उपाय उपलब्ध।' } },
];

const KY_DATA: KYogaDef[] = [
  { id: 'ruchaka', category: 'mahapurusha', name: { en: 'Ruchaka Yoga', hi: 'रुचक योग' }, planets: 'Mars', condition: { en: 'Mars in Aries/Scorpio/Capricorn in kendra', hi: 'मंगल मेष/वृश्चिक/मकर में केंद्र में' }, effect: { en: 'Courage, authority over army, strong physique, leadership', hi: 'साहस, सेनानायकत्व, बलशाली शरीर, नेतृत्व' }, classical: 'BPHS Ch.34', strength: 'rare', auspicious: true },
  { id: 'bhadra', category: 'mahapurusha', name: { en: 'Bhadra Yoga', hi: 'भद्र योग' }, planets: 'Mercury', condition: { en: 'Mercury in Gemini/Virgo in kendra', hi: 'बुध मिथुन/कन्या में केंद्र में' }, effect: { en: 'Intelligence, eloquence, commercial success, scholarly mind', hi: 'बुद्धिमत्ता, वाक्पटुता, व्यापारिक सफलता' }, classical: 'BPHS Ch.34', strength: 'moderate', auspicious: true },
  { id: 'hamsa', category: 'mahapurusha', name: { en: 'Hamsa Yoga', hi: 'हंस योग' }, planets: 'Jupiter', condition: { en: 'Jupiter in Sagittarius/Pisces/Cancer in kendra', hi: 'गुरु धनु/मीन/कर्क में केंद्र में' }, effect: { en: 'Wisdom, spirituality, respect, fame, virtuous conduct', hi: 'ज्ञान, आध्यात्मिकता, सम्मान, यश' }, classical: 'BPHS Ch.34', strength: 'rare', auspicious: true },
  { id: 'malavya', category: 'mahapurusha', name: { en: 'Malavya Yoga', hi: 'मालव्य योग' }, planets: 'Venus', condition: { en: 'Venus in Taurus/Libra/Pisces in kendra', hi: 'शुक्र वृषभ/तुला/मीन में केंद्र में' }, effect: { en: 'Beauty, luxury, artistic talent, marital happiness', hi: 'सौंदर्य, विलासिता, कला, वैवाहिक सुख' }, classical: 'BPHS Ch.34', strength: 'moderate', auspicious: true },
  { id: 'shasha', category: 'mahapurusha', name: { en: 'Shasha Yoga', hi: 'शश योग' }, planets: 'Saturn', condition: { en: 'Saturn in Capricorn/Aquarius/Libra in kendra', hi: 'शनि मकर/कुम्भ/तुला में केंद्र में' }, effect: { en: 'Authority, servants, wealth from masses, political power', hi: 'अधिकार, सेवक, जनता से धन, राजनीतिक शक्ति' }, classical: 'BPHS Ch.34', strength: 'moderate', auspicious: true },
  { id: 'dharma_karma', category: 'raja', name: { en: 'Dharma-Karma Adhipati', hi: 'धर्म-कर्म अधिपति' }, planets: '9th+10th lords', condition: { en: '9th and 10th lords conjunct/aspect/exchange', hi: '9वें और 10वें भावेश की युति/दृष्टि/परिवर्तन' }, effect: { en: 'Most powerful Raja Yoga — purpose meets action, extraordinary success', hi: 'सबसे शक्तिशाली राजयोग — धर्म और कर्म का मिलन' }, classical: 'BPHS Ch.34 v.15', strength: 'rare', auspicious: true },
  { id: 'adhi', category: 'raja', name: { en: 'Adhi Yoga', hi: 'अधि योग' }, planets: 'Benefics 6/7/8 from Moon', condition: { en: 'Mercury, Jupiter, Venus in 6th/7th/8th from Moon', hi: 'बुध, गुरु, शुक्र चंद्र से 6/7/8 में' }, effect: { en: 'Commander, minister, or king — power through wisdom', hi: 'सेनापति, मंत्री या राजा — बुद्धि से शक्ति' }, classical: 'Phaladeepika Ch.6 v.10', strength: 'rare', auspicious: true },
  { id: 'lakshmi', category: 'dhana', name: { en: 'Lakshmi Yoga', hi: 'लक्ष्मी योग' }, planets: '9th+Lagna lords', condition: { en: '9th lord and Lagna lord in kendras/trikonas', hi: '9वें भावेश और लग्नेश केंद्र/त्रिकोण में' }, effect: { en: 'Blessed by Lakshmi — wealth, beauty, fortune', hi: 'लक्ष्मी कृपा — धन, सौंदर्य, भाग्य' }, classical: 'BPHS Ch.36 v.4', strength: 'rare', auspicious: true },
  { id: 'gajakesari', category: 'dhana', name: { en: 'Gajakesari Yoga', hi: 'गजकेसरी योग' }, planets: 'Jupiter+Moon', condition: { en: 'Jupiter in kendra from Moon', hi: 'गुरु चंद्र से केंद्र में' }, effect: { en: 'Lion among elephants — intelligence, wealth, lasting fame', hi: 'हाथियों में शेर — बुद्धि, धन, स्थायी प्रतिष्ठा' }, classical: 'Phaladeepika Ch.6 v.1', strength: 'common', auspicious: true },
  { id: 'sunafa', category: 'chandra', name: { en: 'Sunafa Yoga', hi: 'सुनफा योग' }, planets: 'Planet 2nd from Moon', condition: { en: 'Any planet (not Sun) in 2nd from Moon', hi: 'कोई ग्रह (सूर्य छोड़कर) चंद्र से 2nd में' }, effect: { en: 'Self-made wealth, good reputation', hi: 'स्वनिर्मित धन, प्रतिष्ठा' }, classical: 'Phaladeepika Ch.6 v.3', strength: 'common', auspicious: true },
  { id: 'kemadruma', category: 'chandra', name: { en: 'Kemadruma Yoga', hi: 'केमद्रुम योग' }, planets: 'Moon isolated', condition: { en: 'No planet in 2nd/12th from Moon', hi: 'चंद्र से 2/12 में कोई ग्रह नहीं' }, effect: { en: 'Poverty, struggle, loneliness — cancellable', hi: 'गरीबी, संघर्ष, अकेलापन — रद्द हो सकता है' }, classical: 'Phaladeepika Ch.6 v.8', strength: 'common', auspicious: false },
  { id: 'neechabhanga', category: 'special', name: { en: 'Neecha Bhanga Raja', hi: 'नीच भंग राज' }, planets: 'Debilitated planet', condition: { en: 'Debilitation cancelled by lord in kendra or exaltation lord in kendra', hi: 'नीच भंग — राशि/उच्च स्वामी केंद्र में' }, effect: { en: 'Weakness becomes extraordinary strength — rise from humble beginnings', hi: 'कमजोरी असाधारण शक्ति बनती है — विनम्र शुरुआत से महानता' }, classical: 'BPHS Ch.34 v.22', strength: 'rare', auspicious: true },
  { id: 'viparita', category: 'special', name: { en: 'Viparita Raja Yoga', hi: 'विपरीत राज योग' }, planets: '6/8/12 lords', condition: { en: 'Dusthana lord in another dusthana (6→8/12, 8→6/12, 12→6/8)', hi: 'दुःस्थानेश अन्य दुःस्थान में' }, effect: { en: 'Adversity becomes advantage — unconventional success', hi: 'विपरीत परिस्थितियों में सफलता' }, classical: 'BPHS Ch.35 v.7', strength: 'moderate', auspicious: true },
  { id: 'parivartana', category: 'special', name: { en: 'Parivartana Yoga', hi: 'परिवर्तन योग' }, planets: '2 planets exchanging', condition: { en: 'Two planets in each other\'s signs (mutual exchange)', hi: 'दो ग्रह एक दूसरे की राशियों में' }, effect: { en: 'Deep house connection — both houses strengthened', hi: 'गहरा भाव संबंध — दोनों भाव सशक्त' }, classical: 'BPHS Ch.35', strength: 'moderate', auspicious: true },
  { id: 'kala_sarpa', category: 'inauspicious', name: { en: 'Kala Sarpa Yoga', hi: 'काल सर्प योग' }, planets: 'All between Rahu-Ketu', condition: { en: 'All 7 planets hemmed between Rahu and Ketu', hi: 'सभी 7 ग्रह राहु-केतु के बीच' }, effect: { en: 'Cyclical hardships, sudden reversals. Remedy: Naga puja', hi: 'चक्रीय कठिनाइयाँ। उपाय: नाग पूजा' }, classical: 'Manasagari', strength: 'moderate', auspicious: false },
  { id: 'guru_chandal', category: 'inauspicious', name: { en: 'Guru Chandal Yoga', hi: 'गुरु चांडाल योग' }, planets: 'Jupiter+Rahu', condition: { en: 'Jupiter conjunct Rahu', hi: 'गुरु-राहु युति' }, effect: { en: 'Wisdom corrupted — wrong gurus, immoral choices, betrayal by mentors', hi: 'ज्ञान दूषित — गलत गुरु, अनैतिक, गुरु द्वारा धोखा' }, classical: 'BPHS Ch.35', strength: 'common', auspicious: false },
];

function KundaliYogasSection({ locale }: { locale: Locale }) {
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedCategory, setExpandedCategory] = useState<string | null>('mahapurusha');
  const [expandedYoga, setExpandedYoga] = useState<string | null>(null);

  return (
    <div className="mt-12 space-y-8">
      <div className="border-t border-gold-primary/15 pt-8">
        <h2 className="text-2xl font-bold text-gold-gradient mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'कुण्डली योग — ग्रह संयोगों का विज्ञान' : 'Kundali Yogas — Planetary Combinations in Birth Charts'}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {isHi
            ? 'ऊपर 27 पञ्चाङ्ग योग दैनिक सूर्य+चंद्र कोण से बनते हैं। नीचे के योग जन्म कुण्डली में ग्रहों की विशिष्ट स्थितियों से बनते हैं — ये जीवन भर प्रभावी रहते हैं।'
            : 'The 27 Panchang Yogas above are daily, based on Sun+Moon angle. The yogas below form in the birth chart from specific planetary configurations — they shape the entire life trajectory.'}
        </p>
      </div>

      {/* How Yogas Form */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 border border-gold-primary/15">
        <h3 className="text-gold-light font-bold text-lg mb-3" style={headingFont}>{isHi ? 'योग कैसे बनते हैं?' : 'How Yogas Form'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: { en: 'Conjunction', hi: 'युति' }, desc: { en: 'Two+ planets in the same house', hi: 'दो+ ग्रह एक ही भाव में' }, icon: '⊕' },
            { type: { en: 'Aspect (Drishti)', hi: 'दृष्टि' }, desc: { en: 'Planets influencing through special aspects', hi: 'विशेष दृष्टि से प्रभाव' }, icon: '◈' },
            { type: { en: 'Exchange', hi: 'परिवर्तन' }, desc: { en: 'Two planets in each other\'s signs', hi: 'दो ग्रह एक दूसरे की राशियों में' }, icon: '⇄' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-bg-secondary/50 border border-gold-primary/10 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-gold-light font-bold text-sm mb-1">{isHi ? item.type.hi : item.type.en}</div>
              <div className="text-text-secondary text-xs">{isHi ? item.desc.hi : item.desc.en}</div>
            </div>
          ))}
        </div>
      </div>

      {/* House classification */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'भाव वर्गीकरण' : 'House Classification'}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15"><div className="text-emerald-400 font-bold mb-0.5">Kendras</div><div className="text-text-secondary">1, 4, 7, 10</div></div>
          <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/15"><div className="text-blue-300 font-bold mb-0.5">Trikonas</div><div className="text-text-secondary">1, 5, 9</div></div>
          <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/15"><div className="text-red-400 font-bold mb-0.5">Dusthanas</div><div className="text-text-secondary">6, 8, 12</div></div>
          <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/15"><div className="text-amber-400 font-bold mb-0.5">Upachayas</div><div className="text-text-secondary">3, 6, 10, 11</div></div>
        </div>
      </div>

      {/* Yoga categories with accordions */}
      {KY_CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const yogasInCat = KY_DATA.filter(y => y.category === cat.key);
        const isExpanded = expandedCategory === cat.key;
        return (
          <div key={cat.key} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
            <button onClick={() => setExpandedCategory(isExpanded ? null : cat.key)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
              <div className="flex items-center gap-3">
                <Icon className={`w-6 h-6 ${cat.color}`} />
                <div className="text-left">
                  <div className={`font-bold text-lg ${cat.color}`} style={headingFont}>{isHi ? cat.label.hi : cat.label.en}</div>
                  <div className="text-text-secondary text-xs">{yogasInCat.length} {isHi ? 'योग' : 'yogas'}</div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-6 pb-4 border-t border-gold-primary/10 pt-4">
                    <p className="text-text-secondary text-sm leading-relaxed">{isHi ? cat.desc.hi : cat.desc.en}</p>
                  </div>
                  <div className="px-6 pb-6 space-y-3">
                    {yogasInCat.map((yoga) => {
                      const isYE = expandedYoga === yoga.id;
                      return (
                        <div key={yoga.id} className={`rounded-xl border ${yoga.auspicious ? 'border-emerald-500/15' : 'border-red-500/15'} overflow-hidden`}>
                          <button onClick={() => setExpandedYoga(isYE ? null : yoga.id)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold-primary/3 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className={`w-2 h-2 rounded-full ${yoga.auspicious ? 'bg-emerald-400' : 'bg-red-400'}`} />
                              <span className="text-gold-light font-bold text-sm" style={headingFont}>{isHi ? yoga.name.hi : yoga.name.en}</span>
                              <span className="text-text-tertiary text-[10px]">{yoga.planets}</span>
                              {yoga.strength === 'rare' && <span className="px-1.5 py-0.5 rounded text-[9px] bg-violet-500/15 text-violet-300 border border-violet-500/20">Rare</span>}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isYE ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {isYE && (
                              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                <div className="px-4 pb-4 space-y-3">
                                  <div><div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-1">{isHi ? 'निर्माण नियम' : 'Formation Rule'}</div><div className="text-text-secondary text-xs leading-relaxed">{isHi ? yoga.condition.hi : yoga.condition.en}</div></div>
                                  <div><div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-1">{isHi ? 'फल' : 'Effects'}</div><div className="text-text-secondary text-xs leading-relaxed">{isHi ? yoga.effect.hi : yoga.effect.en}</div></div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-text-tertiary text-[10px]">{yoga.classical}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${yoga.auspicious ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-400'}`}>{yoga.auspicious ? (isHi ? 'शुभ' : 'Auspicious') : (isHi ? 'अशुभ' : 'Inauspicious')}</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* CTA */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center border border-gold-primary/20">
        <h3 className="text-gold-light font-bold text-lg mb-2" style={headingFont}>{isHi ? 'अपनी कुण्डली में योग देखें' : 'Check Yogas in Your Chart'}</h3>
        <p className="text-text-secondary text-xs mb-4">{isHi ? 'हमारा इंजन 55+ योगों का स्वचालित पता लगाता है' : 'Our engine automatically detects 55+ yogas'}</p>
        <a href={`/${locale}/kundali`} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-primary text-bg-primary font-semibold hover:bg-gold-light transition-colors text-sm">{isHi ? 'कुण्डली बनाएं →' : 'Generate Kundali →'}</a>
      </div>
    </div>
  );
}

export default function LearnYogasPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;

  const natureColor = (nature: string) => {
    if (nature === 'auspicious') return 'text-emerald-400';
    if (nature === 'inauspicious') return 'text-red-400';
    return 'text-amber-400';
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('yogasTitle')}
        </h2>
        <p className="text-text-secondary">{t('yogasSubtitle')}</p>
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('yogasWhat')}</p>
      </LessonSection>

      <LessonSection title={t('stepByStep')}>
        <p>{t('yogasAstronomy')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Yoga = floor((Sun° + Moon°) / 13.333°) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Sum increases ~14°/day → ~1 Yoga/day</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">27 Yogas × 13°20&apos; = 360°</p>
        </div>
      </LessonSection>

      <LessonSection title={t('completeList')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {YOGAS.map((y, i) => (
            <motion.div
              key={y.number}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-gold-primary/10 flex items-center gap-3"
            >
              <span className="text-gold-primary/60 text-lg font-bold w-8 text-center">{y.number}</span>
              <div className="flex-1 min-w-0">
                <div className="text-gold-light font-semibold text-sm">{y.name[locale]}</div>
                {locale !== 'en' && <div className="text-text-secondary/60 text-xs">{y.name.en}</div>}
              </div>
              <div className="text-right">
                <div className="text-text-secondary text-xs">{y.meaning[locale]}</div>
                <div className={`text-xs ${natureColor(y.nature)}`}>
                  {y.nature === 'auspicious' ? (locale === 'en' ? 'Auspicious' : 'शुभ') :
                   y.nature === 'inauspicious' ? (locale === 'en' ? 'Inauspicious' : 'अशुभ') :
                   (locale === 'en' ? 'Neutral' : 'सम')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/panchang/yoga"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PART 2: KUNDALI YOGAS — Planetary Combinations in Birth Chart
      ═══════════════════════════════════════════════════════════════ */}
      <KundaliYogasSection locale={locale} />
    </div>
  );
}

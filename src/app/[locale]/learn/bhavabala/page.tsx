'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Home, Triangle, Layers, Eye, Shield, Gem, Compass } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/bhavabala.json';

export default function LearnBhavabalaPage() {
  const locale = useLocale();
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const isHi = isDevanagariLocale(locale);
  const tl2 = (obj: Record<string, string>) => obj[locale] || obj.en || '';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedComponent, setExpandedComponent] = useState<number | null>(0);
  const [expandedClass, setExpandedClass] = useState<string | null>('kendra');

  const classificationColor = (cls: string) => {
    switch (cls) {
      case 'kendra': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'trikona': return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'dusthana': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'upachaya': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'maraka': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      default: return 'bg-gold-primary/10 text-gold-light border-gold-primary/20';
    }
  };

  const components = [
    { titleKey: 'adhipatiTitle', descKey: 'adhipatiDesc', icon: Shield, color: 'text-amber-400' },
    { titleKey: 'digBhavaTitle', descKey: 'digBhavaDesc', icon: Compass, color: 'text-emerald-400' },
    { titleKey: 'drishtiBhavaTitle', descKey: 'drishtiBhavaDesc', icon: Eye, color: 'text-cyan-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* ═══ Header ═══ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>{t('title')}</h1>
        <p className="text-text-secondary leading-relaxed max-w-3xl">{t('subtitle')}</p>
      </motion.div>

      {/* ═══ What is Bhavabala ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('whatTitle')}</h2>
        <p className="text-text-secondary leading-relaxed">{t('whatP1')}</p>
        <p className="text-text-secondary leading-relaxed">{t('whatP2')}</p>
        <div className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Bhavabala = Bhavadhipati Bala + Bhava Dig Bala + Bhava Drishti Bala</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Unit: Shashtiamshas | Computed for each of the 12 houses</p>
        </div>
      </motion.section>

      {/* ═══ 3 Components ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>{t('threeTitle')}</h2>
        {components.map((comp, i) => {
          const Icon = comp.icon;
          const isExpanded = expandedComponent === i;
          return (
            <div key={i} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedComponent(isExpanded ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${comp.color}`} />
                  <span className={`font-bold text-lg ${comp.color}`} style={headingFont}>{t(comp.titleKey)}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className="px-6 pb-6 border-t border-gold-primary/10 pt-4">
                      <p className="text-text-secondary leading-relaxed">{t(comp.descKey)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ 12 Houses Table ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('houseTitle')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-dark text-xs uppercase tracking-widest border-b border-gold-primary/15">
                <th className="text-left py-3 px-3">#</th>
                <th className="text-left py-3 px-3">{isHi ? 'भाव' : 'House'}</th>
                <th className="text-left py-3 px-3">{isHi ? 'कारकत्व' : 'Significations'}</th>
                <th className="text-center py-3 px-3">{isHi ? 'वर्ग' : 'Type'}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { num: 1, nameKey: 'house1Name', sigKey: 'house1Sig', classification: 'kendra' },
                { num: 2, nameKey: 'house2Name', sigKey: 'house2Sig', classification: 'maraka' },
                { num: 3, nameKey: 'house3Name', sigKey: 'house3Sig', classification: 'upachaya' },
                { num: 4, nameKey: 'house4Name', sigKey: 'house4Sig', classification: 'kendra' },
                { num: 5, nameKey: 'house5Name', sigKey: 'house5Sig', classification: 'trikona' },
                { num: 6, nameKey: 'house6Name', sigKey: 'house6Sig', classification: 'dusthana' },
                { num: 7, nameKey: 'house7Name', sigKey: 'house7Sig', classification: 'kendra' },
                { num: 8, nameKey: 'house8Name', sigKey: 'house8Sig', classification: 'dusthana' },
                { num: 9, nameKey: 'house9Name', sigKey: 'house9Sig', classification: 'trikona' },
                { num: 10, nameKey: 'house10Name', sigKey: 'house10Sig', classification: 'kendra' },
                { num: 11, nameKey: 'house11Name', sigKey: 'house11Sig', classification: 'upachaya' },
                { num: 12, nameKey: 'house12Name', sigKey: 'house12Sig', classification: 'dusthana' },
              ].map((h) => (
                <motion.tr key={h.num} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  className="border-t border-gold-primary/8">
                  <td className="py-2.5 px-3 text-gold-primary font-bold">{h.num}</td>
                  <td className="py-2.5 px-3 text-gold-light font-medium whitespace-nowrap">{t(h.nameKey)}</td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs leading-relaxed">{t(h.sigKey)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded border ${classificationColor(h.classification)}`}>
                      {h.classification === 'kendra' ? (isHi ? 'केन्द्र' : 'Kendra') :
                       h.classification === 'trikona' ? (isHi ? 'त्रिकोण' : 'Trikona') :
                       h.classification === 'dusthana' ? (isHi ? 'दुःस्थान' : 'Dusthana') :
                       h.classification === 'upachaya' ? (isHi ? 'उपचय' : 'Upachaya') :
                       (isHi ? 'मारक' : 'Maraka')}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ═══ House Classifications ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
        <h2 className="text-2xl font-bold text-gold-gradient" style={headingFont}>{t('classTitle')}</h2>
        {[
          { key: 'kendra', labelKey: 'labelKendra', descKey: 'descKendra', houses: '1, 4, 7, 10', color: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
          { key: 'trikona', labelKey: 'labelTrikona', descKey: 'descTrikona', houses: '1, 5, 9', color: 'text-blue-300', borderColor: 'border-blue-500/20' },
          { key: 'dusthana', labelKey: 'labelDusthana', descKey: 'descDusthana', houses: '6, 8, 12', color: 'text-red-400', borderColor: 'border-red-500/20' },
          { key: 'upachaya', labelKey: 'labelUpachaya', descKey: 'descUpachaya', houses: '3, 6, 10, 11', color: 'text-amber-400', borderColor: 'border-amber-500/20' },
          { key: 'maraka', labelKey: 'labelMaraka', descKey: 'descMaraka', houses: '2, 7', color: 'text-violet-400', borderColor: 'border-violet-500/20' },
        ].map((cls) => {
          const isExp = expandedClass === cls.key;
          return (
            <div key={cls.key} className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden border ${cls.borderColor}`}>
              <button onClick={() => setExpandedClass(isExp ? null : cls.key)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gold-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-lg ${cls.color}`} style={headingFont}>{t(cls.labelKey)}</span>
                  <span className="text-text-tertiary text-xs">{isHi ? 'भाव' : 'Houses'}: {cls.houses}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${isExp ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExp && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' as const }} className="overflow-hidden">
                    <div className={`px-6 pb-5 border-t ${cls.borderColor} pt-4`}>
                      <p className="text-text-secondary leading-relaxed text-sm">{t(cls.descKey)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.section>

      {/* ═══ Reading Your Bhavabala ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('readingTitle')}</h2>
        <p className="text-text-secondary leading-relaxed">{t('readingP1')}</p>
        <p className="text-text-secondary leading-relaxed">{t('readingP2')}</p>
      </motion.section>

      {/* ═══ Remedies per House ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('remedyTitle')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-dark text-xs uppercase tracking-widest border-b border-gold-primary/15">
                <th className="text-left py-3 px-3">{isHi ? 'भाव' : 'House'}</th>
                <th className="text-left py-3 px-3">{isHi ? 'उपचार' : 'Remedies'}</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <tr key={num} className="border-t border-gold-primary/8">
                  <td className="py-2 px-3 text-gold-primary font-bold">{num}</td>
                  <td className="py-2 px-3 text-text-secondary text-xs leading-relaxed">{t(`remedy${num}`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ═══ Links ═══ */}
      <motion.section initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center space-y-4">
        <h3 className="text-gold-light font-bold text-lg" style={headingFont}>{t('linksTitle')}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { href: '/kundali', label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएं' } },
            { href: '/learn/modules/18-2', label: { en: 'Module 18-2: Bhavabala Deep Dive', hi: 'मॉड्यूल 18-2: भावबल विस्तार' } },
            { href: '/learn/shadbala', label: { en: 'Shadbala (Planet Strength)', hi: 'षड्बल (ग्रह शक्ति)' } },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium">
              {tl2(link.label)} &rarr;
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

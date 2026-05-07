'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, BookOpen } from 'lucide-react';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/types/panchang';
import MSG from '@/messages/pages/caesarean-muhurta.json';

const msg = (key: string, locale: string) =>
  lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

interface TipItem {
  titleKey: string;
  bodyKey: string;
  sourceKey: string;
}

interface TipGroup {
  titleKey: string;
  items: TipItem[];
}

const TIP_GROUPS: TipGroup[] = [
  {
    titleKey: 'tipGroupLagna',
    items: [
      { titleKey: 'tipLagnaLordDignity', bodyKey: 'tipLagnaLordDignityBody', sourceKey: 'tipLagnaLordDignitySource' },
      { titleKey: 'tipLagnaLordHouse', bodyKey: 'tipLagnaLordHouseBody', sourceKey: 'tipLagnaLordHouseSource' },
      { titleKey: 'tipBeneficInLagna', bodyKey: 'tipBeneficInLagnaBody', sourceKey: 'tipBeneficInLagnaSource' },
      { titleKey: 'tipPushkarNavamsha', bodyKey: 'tipPushkarNavamshaBody', sourceKey: 'tipPushkarNavamshaSource' },
      { titleKey: 'tipSandhiBuffer', bodyKey: 'tipSandhiBufferBody', sourceKey: 'tipSandhiBufferSource' },
    ],
  },
  {
    titleKey: 'tipGroupMoon',
    items: [
      { titleKey: 'tipMoonHouse', bodyKey: 'tipMoonHouseBody', sourceKey: 'tipMoonHouseSource' },
      { titleKey: 'tipPakshaBala', bodyKey: 'tipPakshaBalaBody', sourceKey: 'tipPakshaBalaSource' },
      { titleKey: 'tipNakshatraGana', bodyKey: 'tipNakshatraGanaBody', sourceKey: 'tipNakshatraGanaSource' },
      { titleKey: 'tipJupiterAspectMoon', bodyKey: 'tipJupiterAspectMoonBody', sourceKey: 'tipJupiterAspectMoonSource' },
    ],
  },
  {
    titleKey: 'tipGroupDist',
    items: [
      { titleKey: 'tipBeneficsInKendra', bodyKey: 'tipBeneficsInKendraBody', sourceKey: 'tipBeneficsInKendraSource' },
      { titleKey: 'tipMaleficsUpachaya', bodyKey: 'tipMaleficsUpachayaBody', sourceKey: 'tipMaleficsUpachayaSource' },
      { titleKey: 'tipClean8th', bodyKey: 'tipClean8thBody', sourceKey: 'tipClean8thSource' },
    ],
  },
  {
    titleKey: 'tipGroupDasha',
    items: [
      { titleKey: 'tipDashaBirth', bodyKey: 'tipDashaBirthBody', sourceKey: 'tipDashaBirthSource' },
      { titleKey: 'tipDashaBalance', bodyKey: 'tipDashaBalanceBody', sourceKey: 'tipDashaBalanceSource' },
    ],
  },
  {
    titleKey: 'tipGroupDefects',
    items: [
      { titleKey: 'tipCombustLagna', bodyKey: 'tipCombustLagnaBody', sourceKey: 'tipCombustLagnaSource' },
      { titleKey: 'tipRahuKetuLagna', bodyKey: 'tipRahuKetuLagnaBody', sourceKey: 'tipRahuKetuLagnaSource' },
      { titleKey: 'tipSaturnLagna', bodyKey: 'tipSaturnLagnaBody', sourceKey: 'tipSaturnLagnaSource' },
      { titleKey: 'tipVishtiKarana', bodyKey: 'tipVishtiKaranaBody', sourceKey: 'tipVishtiKaranaSource' },
    ],
  },
  {
    titleKey: 'tipGroupVetoes',
    items: [
      { titleKey: 'tipGandanta', bodyKey: 'tipGandantaBody', sourceKey: 'tipGandantaSource' },
      { titleKey: 'tipKaalSarpa', bodyKey: 'tipKaalSarpaBody', sourceKey: 'tipKaalSarpaSource' },
    ],
  },
];

function TipItemRow({ item, locale }: { item: TipItem; locale: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gold-primary/6 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 py-2.5 px-3 text-left hover:bg-gold-primary/5 transition-colors rounded-lg"
      >
        <span className="text-xs text-text-primary font-medium">
          {msg(item.titleKey, locale)}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-secondary flex-shrink-0 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' as const }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-1.5">
              <p className="text-xs text-text-secondary leading-relaxed">
                {msg(item.bodyKey, locale)}
              </p>
              <p className="text-[10px] text-gold-primary/60 italic">
                {msg(item.sourceKey, locale)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ClassicalTips() {
  const locale = useLocale();
  const [openGroup, setOpenGroup] = useState<number | null>(null);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-gold-light flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        {msg('tipsTitle', locale)}
      </h2>

      <div className="space-y-2">
        {TIP_GROUPS.map((group, gi) => (
          <div
            key={gi}
            className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl overflow-hidden"
          >
            {/* Group header */}
            <button
              onClick={() => setOpenGroup(openGroup === gi ? null : gi)}
              className="w-full flex items-center justify-between gap-2 p-4 text-left hover:bg-gold-primary/5 transition-colors"
            >
              <span className="text-sm text-gold-light font-semibold">
                {msg(group.titleKey, locale)}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gold-primary flex-shrink-0 transition-transform ${
                  openGroup === gi ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Group items */}
            <AnimatePresence>
              {openGroup === gi && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' as const }}
                  className="overflow-hidden"
                >
                  <div className="px-2 pb-2">
                    {group.items.map((item, ii) => (
                      <TipItemRow key={ii} item={item} locale={locale} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Filter } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { tl } from '@/lib/utils/trilingual';
import InfoBlock from '@/components/ui/InfoBlock';
import { YOGA_DETAIL_DATA } from '@/lib/constants/yoga-details';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import type { EvaluatedYoga, YogaGroup, DomainType } from '@/lib/kundali/yoga-engine/types';
import type { Locale, LocaleText } from '@/types/panchang';

// Set of yoga slugs that have detail pages
const YOGA_DETAIL_SLUGS = new Set(Object.keys(YOGA_DETAIL_DATA));

// ---------------------------------------------------------------------------
// Planet name lookup (shared between old and new yoga rendering)
// ---------------------------------------------------------------------------

const PLANET_NAMES: { id: number; en: string; hi: string }[] = [
  { id: 0, en: 'Sun', hi: 'सूर्य' },
  { id: 1, en: 'Moon', hi: 'चन्द्र' },
  { id: 2, en: 'Mars', hi: 'मंगल' },
  { id: 3, en: 'Mercury', hi: 'बुध' },
  { id: 4, en: 'Jupiter', hi: 'बृहस्पति' },
  { id: 5, en: 'Venus', hi: 'शुक्र' },
  { id: 6, en: 'Saturn', hi: 'शनि' },
  { id: 7, en: 'Rahu', hi: 'राहु' },
  { id: 8, en: 'Ketu', hi: 'केतु' },
];

function getPlanetName(id: number, isEn: boolean): string {
  const p = PLANET_NAMES.find(x => x.id === id);
  return p ? (isEn ? p.en : p.hi) : `Planet ${id}`;
}

// ---------------------------------------------------------------------------
// Group metadata — display order, labels, subtitles, icons
// ---------------------------------------------------------------------------

interface GroupMeta {
  key: YogaGroup;
  label: LocaleText;
  subtitle: { en: string; hi: string };
  icon: string; // Emoji-free text symbol
}

const GROUP_ORDER: GroupMeta[] = [
  { key: 'mahapurusha', label: { en: 'Mahapurusha', hi: 'महापुरुष', sa: 'महापुरुषयोगाः' }, subtitle: { en: 'Five Great Person Yogas (BPHS Ch.34)', hi: 'पंच महापुरुष योग (बृहत् पाराशर होराशास्त्र अ.34)' }, icon: '★' },
  { key: 'raja', label: { en: 'Raja Yogas', hi: 'राजयोग', sa: 'राजयोगाः' }, subtitle: { en: 'Power & Authority (BPHS Ch.34-35)', hi: 'शक्ति और अधिकार (बृ.पा.हो.शा. अ.34-35)' }, icon: '♛' },
  { key: 'dhana', label: { en: 'Dhana Yogas', hi: 'धनयोग', sa: 'धनयोगाः' }, subtitle: { en: 'Wealth & Prosperity (BPHS Ch.36)', hi: 'धन और समृद्धि (बृ.पा.हो.शा. अ.36)' }, icon: '◆' },
  { key: 'chandra', label: { en: 'Chandra Yogas', hi: 'चन्द्र योग', sa: 'चन्द्रयोगाः' }, subtitle: { en: 'Moon-Based (Phaladeepika Ch.6)', hi: 'चन्द्र आधारित (फलदीपिका अ.6)' }, icon: '☽' },
  { key: 'surya', label: { en: 'Surya Yogas', hi: 'सूर्य योग', sa: 'सूर्ययोगाः' }, subtitle: { en: 'Sun-Based (Phaladeepika Ch.6)', hi: 'सूर्य आधारित (फलदीपिका अ.6)' }, icon: '☀' },
  { key: 'dosha', label: { en: 'Doshas', hi: 'दोष', sa: 'दोषाः' }, subtitle: { en: 'Afflictions & Challenges', hi: 'पीड़ा और चुनौतियाँ' }, icon: '▲' },
  { key: 'nabhasa', label: { en: 'Nabhasa Yogas', hi: 'नभस योग', sa: 'नभसयोगाः' }, subtitle: { en: 'Sky-Pattern Yogas (Phaladeepika Ch.7)', hi: 'आकाश-प्रतिमान योग (फलदीपिका अ.7)' }, icon: '✦' },
  { key: 'malika', label: { en: 'Malika Yogas', hi: 'मालिका योग', sa: 'मालिकायोगाः' }, subtitle: { en: 'Garland / Consecutive House Yogas', hi: 'माला / क्रमिक भाव योग' }, icon: '∞' },
  { key: 'parivartana', label: { en: 'Parivartana Yogas', hi: 'परिवर्तन योग', sa: 'परिवर्तनयोगाः' }, subtitle: { en: 'Exchange Yogas — Mutual Sign Exchange', hi: 'विनिमय योग — पारस्परिक राशि विनिमय' }, icon: '⇄' },
  { key: 'conjunction', label: { en: 'Conjunction Yogas', hi: 'युति योग', sa: 'युतियोगाः' }, subtitle: { en: 'Specific Planet Pair Combinations', hi: 'विशिष्ट ग्रह युगल संयोग' }, icon: '⊕' },
  { key: 'arishta', label: { en: 'Arishta Yogas', hi: 'अरिष्ट योग', sa: 'अरिष्टयोगाः' }, subtitle: { en: 'Health & Longevity Indicators', hi: 'स्वास्थ्य और आयु संकेतक' }, icon: '⚕' },
  { key: 'sannyasa', label: { en: 'Sannyasa Yogas', hi: 'संन्यास योग', sa: 'संन्यासयोगाः' }, subtitle: { en: 'Spiritual & Renunciation Yogas', hi: 'आध्यात्मिक और त्याग योग' }, icon: '◎' },
  { key: 'navamsha', label: { en: 'Navamsha Yogas', hi: 'नवांश योग', sa: 'नवांशयोगाः' }, subtitle: { en: 'D9 Divisional Chart Yogas', hi: 'नवांश विभाजन चार्ट योग' }, icon: '⬡' },
  // TODO: Add 'tajika' when tajika rules are implemented
];

const GROUP_META_MAP = new Map(GROUP_ORDER.map(g => [g.key, g]));

// ---------------------------------------------------------------------------
// Domain colours for pills
// ---------------------------------------------------------------------------

const DOMAIN_COLORS: Record<DomainType, string> = {
  health: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  wealth: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  career: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  marriage: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  children: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  family: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  spiritual: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  education: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
};

const DOMAIN_LABELS: Record<DomainType, { en: string; hi: string }> = {
  health: { en: 'Health', hi: 'स्वास्थ्य' },
  wealth: { en: 'Wealth', hi: 'धन' },
  career: { en: 'Career', hi: 'कैरियर' },
  marriage: { en: 'Marriage', hi: 'विवाह' },
  children: { en: 'Children', hi: 'संतान' },
  family: { en: 'Family', hi: 'परिवार' },
  spiritual: { en: 'Spiritual', hi: 'आध्यात्मिक' },
  education: { en: 'Education', hi: 'शिक्षा' },
};

// ---------------------------------------------------------------------------
// Activation guidance generator (reused from old implementation)
// ---------------------------------------------------------------------------

function getActivationNote(planets: number[], isAuspicious: boolean, isEn: boolean): string | null {
  if (planets.length === 0) return null;
  const names = planets.map(id => getPlanetName(id, isEn));

  if (isAuspicious) {
    if (isEn) {
      const dashaList = names.map(n => `${n} Mahadasha`).join(', ');
      const antarList = names.map(n => `${n} Antardasha`).join(' or ');
      return `This yoga activates most strongly during ${dashaList}, or ${antarList}. These are your peak windows to pursue its promises — plan major life moves accordingly.`;
    } else {
      const dashaList = names.map(n => `${n} महादशा`).join(', ');
      const antarList = names.map(n => `${n} अन्तर्दशा`).join(' या ');
      return `यह योग ${dashaList}, या ${antarList} के समय सबसे प्रभावी होता है। इन अवधियों में इसके शुभ फल चरम पर होते हैं — बड़े निर्णय इन्हीं काल में लें।`;
    }
  } else {
    if (isEn) {
      const periodList = names.join(' or ');
      return `The effects of this yoga are felt most during ${periodList} dasha/antardasha periods. Remedial measures (mantras, charity, gemstones) during these periods can significantly reduce negative impact.`;
    } else {
      const periodList = names.join(' या ');
      return `इस योग का प्रभाव ${periodList} दशा/अन्तर्दशा में सबसे अधिक अनुभव होता है। इन अवधियों में उपचार (मन्त्र, दान, रत्न) से नकारात्मक प्रभाव काफी कम हो सकता है।`;
    }
  }
}

// ---------------------------------------------------------------------------
// Filter type
// ---------------------------------------------------------------------------

type FilterMode = 'all' | 'present' | 'auspicious' | 'challenging';

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function YogasTab({ yogas, newYogas, locale, isDevanagari, headingFont }: {
  yogas: YogaComplete[];
  newYogas?: EvaluatedYoga[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const isTamil = String(locale) === 'ta';
  const isEn = locale === 'en' || isTamil;
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const [filter, setFilter] = useState<FilterMode>('all');
  const [expandedYoga, setExpandedYoga] = useState<string | null>(null);
  const [groupFilter, setGroupFilter] = useState<YogaGroup | 'all'>('all');
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  // Decide which data source to use: new engine if available, else old format
  const useNewEngine = newYogas && newYogas.length > 0;

  // ── Stats ──
  const stats = useMemo(() => {
    if (useNewEngine) {
      const total = newYogas.length;
      const present = newYogas.filter(y => y.present).length;
      const auspicious = newYogas.filter(y => y.present && y.isAuspicious).length;
      const challenging = newYogas.filter(y => y.present && !y.isAuspicious).length;
      return { total, present, auspicious, challenging };
    }
    // Old format
    const deduped = deduplicateOld(yogas);
    const present = deduped.filter(y => y.present).length;
    const auspicious = deduped.filter(y => y.present && y.isAuspicious).length;
    const challenging = deduped.filter(y => y.present && !y.isAuspicious).length;
    return { total: deduped.length, present, auspicious, challenging };
  }, [useNewEngine, newYogas, yogas]);

  // ── Group yogas by group (new engine) ──
  const groupedYogas = useMemo(() => {
    if (!useNewEngine) return null;

    const filtered = newYogas.filter(y => {
      if (filter === 'present') return y.present;
      if (filter === 'auspicious') return y.present && y.isAuspicious;
      if (filter === 'challenging') return y.present && !y.isAuspicious;
      return true;
    });

    const groups = new Map<YogaGroup, EvaluatedYoga[]>();
    for (const y of filtered) {
      if (groupFilter !== 'all' && y.group !== groupFilter) continue;
      const list = groups.get(y.group) || [];
      list.push(y);
      groups.set(y.group, list);
    }
    return groups;
  }, [useNewEngine, newYogas, filter, groupFilter]);

  // ── Old format fallback ──
  const oldFiltered = useMemo(() => {
    if (useNewEngine) return [];
    const deduped = deduplicateOld(yogas);
    return deduped.filter(y => {
      if (filter === 'present') return y.present;
      if (filter === 'auspicious') return y.isAuspicious;
      if (filter === 'challenging') return !y.isAuspicious;
      return true;
    });
  }, [useNewEngine, yogas, filter]);

  const OLD_CATEGORY_ORDER = ['dosha', 'mahapurusha', 'moon_based', 'sun_based', 'raja', 'wealth', 'inauspicious', 'other'] as const;
  const OLD_CATEGORY_LABELS: Record<string, LocaleText> = {
    dosha: { en: 'Doshas', hi: 'दोष', sa: 'दोष' },
    mahapurusha: { en: 'Pancha Mahapurusha', hi: 'पंच महापुरुष', sa: 'पंच महापुरुष' },
    moon_based: { en: 'Moon-Based Yogas', hi: 'चन्द्र आधारित योग', sa: 'चन्द्र आधारित योग' },
    sun_based: { en: 'Sun-Based Yogas', hi: 'सूर्य आधारित योग', sa: 'सूर्य आधारित योग' },
    raja: { en: 'Raja Yogas', hi: 'राजयोग', sa: 'राजयोग' },
    wealth: { en: 'Wealth Yogas', hi: 'धनयोग', sa: 'धनयोग' },
    inauspicious: { en: 'Inauspicious Yogas', hi: 'अशुभ योग', sa: 'अशुभ योग' },
    other: { en: 'Other Yogas', hi: 'अन्य योग', sa: 'अन्य योग' },
  };

  return (
    <div className="space-y-6">
      {/* ── Title ── */}
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {isEn ? 'Yogas Analysis' : 'योग विश्लेषण'}
      </h3>

      {/* ── Summary badges ── */}
      <div className="flex justify-center gap-3 flex-wrap text-sm">
        <span className="px-3 py-1 rounded-full bg-gold-primary/10 text-gold-light border border-gold-primary/20">
          {isEn ? `${stats.present} Present` : `${stats.present} उपस्थित`}
          <span className="text-text-secondary ml-1">/ {stats.total}</span>
        </span>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {isEn ? `${stats.auspicious} Auspicious` : `${stats.auspicious} शुभ`}
        </span>
        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          {isEn ? `${stats.challenging} Challenging` : `${stats.challenging} अशुभ`}
        </span>
      </div>

      {/* ── What are Yogas? ── */}
      <InfoBlock
        id="kundali-yogas"
        title={isDevanagari ? 'योग क्या हैं?' : 'What are Yogas?'}
        defaultOpen={false}
      >
        {isDevanagari
          ? 'वैदिक ज्योतिष में "योग" एक विशिष्ट ग्रह संयोजन है जो एक निश्चित परिणाम उत्पन्न करता है — जैसे एक ब्रह्मांडीय नुस्खा। राजयोग शक्ति और अधिकार लाते हैं, धनयोग धन लाते हैं, महापुरुष योग असाधारण व्यक्तित्व बनाते हैं (केवल 5 होते हैं), और अशुभ योग चुनौतियाँ लाते हैं जो चरित्र निर्माण करती हैं। "उपस्थित" का अर्थ है कि यह संयोजन आपकी कुण्डली में विद्यमान है। "शक्ति" दिखाती है कि यह कितनी प्रभावशाली ढंग से काम करता है। हरा = शुभ, लाल = चुनौतीपूर्ण किंतु प्रायः परिवर्तनकारी।'
          : 'In Vedic astrology, a \'Yoga\' is a specific planetary combination that produces a defined result — like a cosmic recipe. Raja Yogas bring power and authority, Dhana Yogas bring wealth, Mahapurusha Yogas create exceptional personalities (only 5 exist), and Inauspicious Yogas bring challenges that build character. \'Present\' means the combination exists in your chart. \'Strength\' shows how powerfully it operates. Green = auspicious, Red = challenging but often transformative.'}
      </InfoBlock>

      {/* ── Filters row ── */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {([
          { key: 'all' as FilterMode, label: isEn ? 'All' : 'सभी' },
          { key: 'present' as FilterMode, label: isEn ? 'Present' : 'उपस्थित' },
          { key: 'auspicious' as FilterMode, label: isEn ? 'Auspicious' : 'शुभ' },
          { key: 'challenging' as FilterMode, label: isEn ? 'Challenging' : 'अशुभ' },
        ]).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === f.key
                ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
                : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
            }`}>
            {f.label}
          </button>
        ))}

        {/* Group filter dropdown (new engine only) */}
        {useNewEngine && (
          <div className="relative">
            <button
              onClick={() => setShowGroupDropdown(!showGroupDropdown)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                groupFilter !== 'all'
                  ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
                  : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
              }`}
            >
              <Filter size={12} />
              {groupFilter === 'all' ? (isEn ? 'Group' : 'समूह') : tl(GROUP_META_MAP.get(groupFilter as YogaGroup)?.label || { en: groupFilter }, locale)}
              <ChevronDown size={12} />
            </button>
            {showGroupDropdown && (
              <div className="absolute right-0 top-full mt-1 z-50 w-56 max-h-72 overflow-y-auto rounded-xl bg-[#1a1040] border border-gold-primary/20 shadow-xl">
                <button
                  onClick={() => { setGroupFilter('all'); setShowGroupDropdown(false); }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gold-primary/10 ${groupFilter === 'all' ? 'text-gold-light font-bold' : 'text-text-secondary'}`}
                >
                  {isEn ? 'All Groups' : 'सभी समूह'}
                </button>
                {GROUP_ORDER.map(g => (
                  <button key={g.key}
                    onClick={() => { setGroupFilter(g.key); setShowGroupDropdown(false); }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gold-primary/10 ${groupFilter === g.key ? 'text-gold-light font-bold' : 'text-text-secondary'}`}
                  >
                    <span className="mr-1.5 opacity-60">{g.icon}</span>
                    {tl(g.label, locale)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── New Engine: grouped display ── */}
      {useNewEngine && groupedYogas && (
        <div className="space-y-8">
          {GROUP_ORDER.map(groupMeta => {
            const groupYogas = groupedYogas.get(groupMeta.key);
            if (!groupYogas || groupYogas.length === 0) return null;

            const presentInGroup = groupYogas.filter(y => y.present).length;

            return (
              <div key={groupMeta.key}>
                {/* Group header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gold-primary text-lg opacity-70">{groupMeta.icon}</span>
                  <div>
                    <h4 className="text-gold-light text-sm font-bold tracking-wide" style={bodyFont}>
                      {tl(groupMeta.label, locale)}
                      {presentInGroup > 0 && (
                        <span className="ml-2 text-xs font-normal text-emerald-400">
                          {presentInGroup} {isEn ? 'present' : 'उपस्थित'}
                        </span>
                      )}
                    </h4>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {isEn ? groupMeta.subtitle.en : groupMeta.subtitle.hi}
                    </p>
                  </div>
                </div>

                {/* Yoga cards */}
                <div className="space-y-2">
                  {/* Present yogas first, then absent */}
                  {[...groupYogas].sort((a, b) => (b.present ? 1 : 0) - (a.present ? 1 : 0)).map(yoga => (
                    <NewYogaCard
                      key={yoga.id}
                      yoga={yoga}
                      isEn={isEn}
                      locale={locale}
                      bodyFont={bodyFont}
                      expanded={expandedYoga === yoga.id}
                      onToggle={() => setExpandedYoga(expandedYoga === yoga.id ? null : yoga.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Old format fallback ── */}
      {!useNewEngine && (
        <div className="space-y-6">
          {OLD_CATEGORY_ORDER.map(cat => {
            const catYogas = oldFiltered.filter(y => y.category === cat);
            if (catYogas.length === 0) return null;
            const catLabel = OLD_CATEGORY_LABELS[cat] || { en: cat, hi: cat };
            return (
              <div key={cat}>
                <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-3 font-bold" style={bodyFont}>
                  {tl(catLabel, locale)}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {catYogas.map(y => (
                    <OldYogaCard
                      key={y.id}
                      yoga={y}
                      isEn={isEn}
                      locale={locale}
                      bodyFont={bodyFont}
                      expanded={expandedYoga === y.id}
                      onToggle={() => setExpandedYoga(expandedYoga === y.id ? null : y.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// New engine yoga card
// ---------------------------------------------------------------------------

function NewYogaCard({ yoga, isEn, locale, bodyFont, expanded, onToggle }: {
  yoga: EvaluatedYoga;
  isEn: boolean;
  locale: Locale;
  bodyFont: React.CSSProperties;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isPresent = yoga.present;
  const hasCancellation = yoga.cancellationStatus?.details.some(d => d.cancelled);
  const isWeakened = yoga.cancellationStatus?.details.some(d => d.cancelled && d.effect === 'weaken');
  const isCancelled = yoga.cancellationStatus?.anyCancelled;

  // Border colour
  const borderClass = isPresent
    ? yoga.isAuspicious
      ? 'border-emerald-500/30'
      : 'border-red-500/25'
    : 'border-gold-primary/8';

  // Strength badge colour
  const strengthClass =
    yoga.strength === 'Strong' ? 'bg-emerald-500/20 text-emerald-400' :
    yoga.strength === 'Moderate' ? 'bg-gold-primary/20 text-gold-light' :
    'bg-amber-500/20 text-amber-400';

  const activationNote = isPresent ? getActivationNote(yoga.involvedPlanets, yoga.isAuspicious, isEn) : null;

  // Domains
  const domains: DomainType[] = yoga.affectedDomains === 'all'
    ? ['career', 'wealth', 'health', 'marriage', 'spiritual']
    : yoga.affectedDomains;

  if (!isPresent && !expanded) {
    // Compact absent card
    return (
      <div
        className={`rounded-xl px-4 py-2.5 border ${borderClass} bg-bg-primary/20 opacity-50 cursor-pointer hover:opacity-70 transition-all`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary/50 text-xs">✗</span>
            <span className="text-text-secondary text-sm" style={bodyFont}>{tl(yoga.name, locale)}</span>
          </div>
          <span className="text-xs text-text-secondary/50">{isEn ? 'Absent' : 'अनुपस्थित'}</span>
        </div>
        {expanded && (
          <p className="text-text-secondary/60 text-xs mt-2 italic" style={bodyFont}>
            {tl(yoga.formationRule, locale)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border ${borderClass} bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] cursor-pointer transition-all hover:border-gold-primary/40`}
      onClick={onToggle}
    >
      {/* ── Header row ── */}
      <div className="px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {isPresent && (
            <span className={`flex-shrink-0 w-2 h-2 rounded-full ${yoga.isAuspicious ? 'bg-emerald-400' : 'bg-red-400'}`} />
          )}
          <span className="text-gold-light font-medium text-sm truncate" style={bodyFont}>
            {tl(yoga.name, locale)}
          </span>
          {isPresent && (
            <span className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${strengthClass}`}>
              {yoga.strength}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Cancellation badge */}
          {hasCancellation && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              isCancelled ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {isCancelled ? (isEn ? 'Cancelled' : 'निरस्त') : (isEn ? 'Weakened' : 'दुर्बल')}
            </span>
          )}
          {/* Classical ref */}
          <span className="text-[10px] text-text-secondary/40 hidden sm:inline">{yoga.classicalRef}</span>
          <ChevronRight size={14} className={`text-text-secondary/40 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>

      {/* ── Formation rule (always visible for present yogas) ── */}
      {isPresent && (
        <div className="px-4 pb-2">
          <p className="text-text-secondary text-xs" style={bodyFont}>
            {tl(yoga.formationRule, locale)}
          </p>
        </div>
      )}

      {/* ── Involved planets + domain tags (present only) ── */}
      {isPresent && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 items-center">
          {yoga.involvedPlanets.length > 0 && (
            <span className="text-[10px] text-text-secondary/60 mr-1">
              {isEn ? 'Involved:' : 'सम्बद्ध:'}
            </span>
          )}
          {yoga.involvedPlanets.map(pid => (
            <span key={pid} className="text-[10px] px-1.5 py-0.5 rounded bg-gold-primary/10 text-gold-light/80 border border-gold-primary/10">
              {getPlanetName(pid, isEn)}
            </span>
          ))}
          {domains.length > 0 && domains.length < 6 && (
            <>
              <span className="text-text-secondary/20 mx-0.5">|</span>
              {domains.map(d => (
                <span key={d} className={`text-[10px] px-1.5 py-0.5 rounded border ${DOMAIN_COLORS[d]}`}>
                  {isEn ? DOMAIN_LABELS[d].en : DOMAIN_LABELS[d].hi}
                </span>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── Expanded section ── */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gold-primary/8 space-y-3">
          {/* Description */}
          <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
            {tl(yoga.description, locale)}
          </p>

          {/* Classical reference */}
          <p className="text-text-secondary/40 text-[10px]">
            {yoga.classicalRef}
          </p>

          {/* Cancellation details */}
          {hasCancellation && yoga.cancellationStatus && (
            <div className="px-2.5 py-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
              <p className="text-xs font-medium text-amber-400/80 mb-1" style={bodyFont}>
                {isEn ? 'Cancellation / Weakening' : 'निरसन / दुर्बलता'}
              </p>
              {yoga.cancellationStatus.details.filter(d => d.cancelled).map((d, i) => (
                <p key={i} className="text-text-secondary/70 text-xs">
                  <span className={d.effect === 'cancel' ? 'text-red-400' : 'text-amber-400'}>
                    {d.effect === 'cancel' ? (isEn ? 'Cancelled: ' : 'निरस्त: ') : (isEn ? 'Weakened: ' : 'दुर्बल: ')}
                  </span>
                  {d.reason}
                </p>
              ))}
            </div>
          )}

          {/* Activation guidance */}
          {activationNote && (
            <div className="px-2.5 py-2 rounded-lg bg-white/[0.03] border border-gold-primary/10">
              <p className="text-xs font-medium text-gold-primary/80 mb-0.5" style={bodyFont}>
                {isEn ? 'When does this activate?' : 'यह कब सक्रिय होता है?'}
              </p>
              <p className="text-text-secondary/80 text-xs leading-relaxed" style={bodyFont}>
                {activationNote}
              </p>
            </div>
          )}

          {/* Learn more link */}
          {YOGA_DETAIL_SLUGS.has(yoga.id) && (
            <Link href={`/learn/yoga/${yoga.id}` as any} className="inline-flex items-center gap-1 text-xs text-gold-primary hover:text-gold-light transition-colors">
              {isEn ? 'Learn more about this yoga' : 'इस योग के बारे में और जानें'} <ChevronRight size={12} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Old format yoga card (backward compat)
// ---------------------------------------------------------------------------

function OldYogaCard({ yoga, isEn, locale, bodyFont, expanded, onToggle }: {
  yoga: YogaComplete;
  isEn: boolean;
  locale: Locale;
  bodyFont: React.CSSProperties;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-xl p-3 border transition-all cursor-pointer ${
        yoga.present
          ? 'border-gold-primary/30 bg-gold-primary/5'
          : 'border-gold-primary/5 bg-bg-primary/20 opacity-50'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gold-light font-medium text-sm" style={bodyFont}>{tl(yoga.name, locale)}</span>
          {yoga.present && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              yoga.strength === 'Strong' ? 'bg-green-500/20 text-green-400' :
              yoga.strength === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-orange-500/20 text-orange-400'
            }`}>
              {yoga.strength}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
            yoga.isAuspicious ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
          }`}>
            {yoga.isAuspicious ? (isEn ? 'Auspicious' : 'शुभ') : (isEn ? 'Inauspicious' : 'अशुभ')}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${yoga.present ? 'bg-gold-primary/20 text-gold-light' : 'bg-bg-primary/50 text-text-secondary/70'}`}>
            {yoga.present ? (isEn ? 'Present' : 'है') : (isEn ? 'Absent' : 'नहीं')}
          </span>
        </div>
      </div>
      {expanded && (
        <div className="mt-2 pt-2 border-t border-gold-primary/10 space-y-2">
          <p className="text-text-secondary text-xs" style={bodyFont}>{tl(yoga.description, locale)}</p>
          <p className="text-gold-dark text-xs italic" style={bodyFont}>
            {isEn ? 'Rule' : 'नियम'}: {tl(yoga.formationRule, locale)}
          </p>
          {YOGA_DETAIL_SLUGS.has(yoga.id) && (
            <Link href={`/learn/yoga/${yoga.id}` as any} className="mt-2 inline-flex items-center gap-1 text-xs text-gold-primary hover:text-gold-light transition-colors">
              {isEn ? 'Learn more about this yoga' : 'इस योग के बारे में और जानें'} <ChevronRight size={12} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deduplicate old-format yogas by ID — keep the present one, or first occurrence */
function deduplicateOld(yogas: YogaComplete[]): YogaComplete[] {
  const seen = new Map<string, YogaComplete>();
  for (const y of yogas) {
    const existing = seen.get(y.id);
    if (!existing || (y.present && !existing.present)) {
      seen.set(y.id, y);
    }
  }
  return [...seen.values()];
}

'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS, GRAHA_ABBREVIATIONS } from '@/lib/constants/grahas';
import { tl } from '@/lib/utils/trilingual';
import type { KundaliData, ChartData, DivisionalChart } from '@/types/kundali';
import type { Locale } from '@/types/panchang';

// Lazy-load chart components — heavy SVG rendering
const ChartNorth = dynamic(() => import('@/components/kundali/ChartNorth'), { ssr: false });

/* ──────────────────────────────────────────────────────────────────
 * Varga metadata — hoisted to module level (never recreated per render)
 * ────────────────────────────────────────────────────────────────── */
interface VargaMeta {
  name: string;
  nameHi: string;
  meaning: string;
  meaningHi: string;
  keyHouse: number;
  keyHouseLabel: string;
  keyHouseLabelHi: string;
}

const VARGA_INFO: Record<string, VargaMeta> = {
  D1:  { name: 'Rashi', nameHi: 'राशि', meaning: 'Overall Life', meaningHi: 'सम्पूर्ण जीवन', keyHouse: 1, keyHouseLabel: 'Self house', keyHouseLabelHi: 'लग्न भाव' },
  D2:  { name: 'Hora', nameHi: 'होरा', meaning: 'Wealth', meaningHi: 'धन', keyHouse: 2, keyHouseLabel: 'Wealth house', keyHouseLabelHi: 'धन भाव' },
  D3:  { name: 'Drekkana', nameHi: 'द्रेक्काण', meaning: 'Siblings & Courage', meaningHi: 'भ्रातृ एवं साहस', keyHouse: 3, keyHouseLabel: 'Siblings house', keyHouseLabelHi: 'सहोदर भाव' },
  D4:  { name: 'Chaturthamsha', nameHi: 'चतुर्थांश', meaning: 'Property & Fortune', meaningHi: 'संपत्ति एवं भाग्य', keyHouse: 4, keyHouseLabel: 'Property house', keyHouseLabelHi: 'संपत्ति भाव' },
  D5:  { name: 'Panchamsha', nameHi: 'पञ्चमांश', meaning: 'Spiritual Merit', meaningHi: 'पुण्य', keyHouse: 5, keyHouseLabel: 'Purva Punya house', keyHouseLabelHi: 'पूर्वपुण्य भाव' },
  D6:  { name: 'Shashthamsha', nameHi: 'षष्ठांश', meaning: 'Health & Enemies', meaningHi: 'स्वास्थ्य एवं शत्रु', keyHouse: 6, keyHouseLabel: 'Enemies house', keyHouseLabelHi: 'शत्रु भाव' },
  D7:  { name: 'Saptamsha', nameHi: 'सप्तांश', meaning: 'Children', meaningHi: 'संतान', keyHouse: 5, keyHouseLabel: 'Children house', keyHouseLabelHi: 'संतान भाव' },
  D8:  { name: 'Ashtamsha', nameHi: 'अष्टांश', meaning: 'Unexpected Troubles', meaningHi: 'अप्रत्याशित कष्ट', keyHouse: 8, keyHouseLabel: 'Mystery house', keyHouseLabelHi: 'रहस्य भाव' },
  D9:  { name: 'Navamsha', nameHi: 'नवांश', meaning: 'Marriage & Dharma', meaningHi: 'विवाह एवं धर्म', keyHouse: 7, keyHouseLabel: 'Marriage house', keyHouseLabelHi: 'विवाह भाव' },
  D10: { name: 'Dasamsha', nameHi: 'दशांश', meaning: 'Career & Status', meaningHi: 'करियर एवं पद', keyHouse: 10, keyHouseLabel: 'Career house', keyHouseLabelHi: 'कर्म भाव' },
  D12: { name: 'Dwadasamsha', nameHi: 'द्वादशांश', meaning: 'Parents', meaningHi: 'माता-पिता', keyHouse: 4, keyHouseLabel: 'Mother house', keyHouseLabelHi: 'मातृ भाव' },
  D16: { name: 'Shodasamsha', nameHi: 'षोडशांश', meaning: 'Vehicles & Comfort', meaningHi: 'वाहन एवं सुख', keyHouse: 4, keyHouseLabel: 'Comforts house', keyHouseLabelHi: 'सुख भाव' },
  D20: { name: 'Vimshamsha', nameHi: 'विंशांश', meaning: 'Spiritual Progress', meaningHi: 'आध्यात्मिक प्रगति', keyHouse: 9, keyHouseLabel: 'Dharma house', keyHouseLabelHi: 'धर्म भाव' },
  D24: { name: 'Chaturvimshamsha', nameHi: 'चतुर्विंशांश', meaning: 'Education', meaningHi: 'शिक्षा', keyHouse: 4, keyHouseLabel: 'Education house', keyHouseLabelHi: 'विद्या भाव' },
  D27: { name: 'Nakshatramsha', nameHi: 'नक्षत्रांश', meaning: 'Strengths', meaningHi: 'शक्ति', keyHouse: 1, keyHouseLabel: 'Self house', keyHouseLabelHi: 'लग्न भाव' },
  D30: { name: 'Trimshamsha', nameHi: 'त्रिंशांश', meaning: 'Misfortunes', meaningHi: 'अरिष्ट', keyHouse: 6, keyHouseLabel: 'Difficulties house', keyHouseLabelHi: 'कष्ट भाव' },
  D40: { name: 'Khavedamsha', nameHi: 'खवेदांश', meaning: 'Maternal Effects', meaningHi: 'मातृ प्रभाव', keyHouse: 4, keyHouseLabel: 'Mother house', keyHouseLabelHi: 'मातृ भाव' },
  D45: { name: 'Akshavedamsha', nameHi: 'अक्षवेदांश', meaning: 'Paternal Effects', meaningHi: 'पितृ प्रभाव', keyHouse: 9, keyHouseLabel: 'Father house', keyHouseLabelHi: 'पितृ भाव' },
  D60: { name: 'Shashtiamsha', nameHi: 'षष्ट्यंश', meaning: 'Past Life Karma', meaningHi: 'पूर्वजन्म कर्म', keyHouse: 12, keyHouseLabel: 'Karma house', keyHouseLabelHi: 'कर्म भाव' },
};

const VARGA_ORDER = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'];

// Interpretive commentary per division — what this chart reveals and how to read it
const VARGA_COMMENTARY: Record<string, { en: string; hi: string }> = {
  D1: {
    en: 'The Rashi chart is your birth chart — the foundation of all analysis. Every planet\'s house, sign, and dignity here determines your life\'s basic blueprint. All other divisional charts are derived from this.',
    hi: 'राशि चार्ट आपकी जन्म कुण्डली है — सम्पूर्ण विश्लेषण का आधार। यहाँ प्रत्येक ग्रह का भाव, राशि और बल आपके जीवन का मूल खाका निर्धारित करता है।',
  },
  D2: {
    en: 'The Hora chart divides each sign into two halves ruled by Sun and Moon. Planets in Sun\'s hora accumulate wealth through effort; in Moon\'s hora, through inheritance or luck. The balance of planets between the two horas reveals your wealth-building pattern.',
    hi: 'होरा चार्ट प्रत्येक राशि को सूर्य और चन्द्र द्वारा शासित दो भागों में विभाजित करता है। सूर्य होरा में ग्रह प्रयास से धन संचय करते हैं; चन्द्र होरा में, विरासत या भाग्य से।',
  },
  D3: {
    en: 'The Drekkana reveals your courage, willpower, and relationship with siblings. Each planet falls into one of 36 "faces" (decanates) with distinct archetypes. This chart also indicates the nature of your co-born and your own initiative patterns.',
    hi: 'द्रेक्काण आपके साहस, इच्छाशक्ति और भाई-बहनों से संबंध दर्शाता है। प्रत्येक ग्रह 36 "मुखों" (दशकों) में से एक में आता है जिनके अलग-अलग प्रारूप होते हैं।',
  },
  D4: {
    en: 'The Chaturthamsha governs fixed assets — property, vehicles, land, and overall fortune. Benefic planets here indicate smooth property acquisition; malefics suggest disputes or delays. The 4th house lord\'s placement is especially significant.',
    hi: 'चतुर्थांश स्थायी संपत्ति — घर, वाहन, भूमि और समग्र भाग्य को नियंत्रित करता है। यहाँ शुभ ग्रह सुगम सम्पत्ति प्राप्ति दर्शाते हैं; अशुभ ग्रह विवाद या विलम्ब सूचित करते हैं।',
  },
  D7: {
    en: 'The Saptamsha is the primary chart for children and progeny. The 5th house here reveals the nature and number of children, while the 1st house shows your relationship with them. Jupiter\'s placement is the single strongest indicator of blessed progeny.',
    hi: 'सप्तांश संतान का प्राथमिक चार्ट है। यहाँ 5वाँ भाव संतान की प्रकृति और संख्या दर्शाता है। बृहस्पति की स्थिति सुसंतान का सबसे प्रबल संकेतक है।',
  },
  D9: {
    en: 'The Navamsha is the most important chart after D1. It reveals the soul\'s true nature (dharma), the quality of marriage, and whether D1 promises will actually deliver. A strong Navamsha can rescue a weak birth chart; a weak one can undermine a strong one. The 7th house and Venus placement here directly describe your spouse.',
    hi: 'नवांश D1 के बाद सबसे महत्वपूर्ण चार्ट है। यह आत्मा की वास्तविक प्रकृति (धर्म), विवाह की गुणवत्ता, और D1 के वादे वास्तव में पूरे होंगे या नहीं — यह दर्शाता है। 7वाँ भाव और शुक्र की स्थिति सीधे आपके जीवनसाथी का वर्णन करती है।',
  },
  D10: {
    en: 'The Dashamsha is the career and professional chart. The 10th house lord\'s placement here determines career trajectory; planets in the 1st indicate personal branding; the 7th house reveals business partnerships. Sun and Saturn\'s dignity here directly reflect authority and organizational ability.',
    hi: 'दशांश कैरियर और पेशेवर चार्ट है। 10वें भाव के स्वामी की स्थिति यहाँ कैरियर की दिशा निर्धारित करती है। सूर्य और शनि का बल सीधे अधिकार और संगठनात्मक क्षमता दर्शाता है।',
  },
  D12: {
    en: 'The Dwadashamsha reveals your relationship with parents and ancestry. The 4th house here indicates your mother\'s nature and your bond with her; the 9th house does the same for your father. Malefics in these houses suggest strained parental relationships.',
    hi: 'द्वादशांश माता-पिता और वंश से आपके संबंध को दर्शाता है। 4वाँ भाव माता की प्रकृति और 9वाँ भाव पिता के बारे में बताता है।',
  },
  D20: {
    en: 'The Vimshamsha governs spiritual progress and religious inclination. Benefic planets in kendras here indicate natural spiritual growth; Jupiter in the 9th is one of the strongest placements for dharmic wisdom. Ketu in the 12th suggests deep moksha potential.',
    hi: 'विंशांश आध्यात्मिक प्रगति और धार्मिक प्रवृत्ति को नियंत्रित करता है। केन्द्र में शुभ ग्रह स्वाभाविक आध्यात्मिक विकास दर्शाते हैं।',
  },
  D24: {
    en: 'The Chaturvimshamsha is the education and learning chart. Mercury and Jupiter\'s placement here determines intellectual gifts and academic success. The 4th house reveals the depth of education; the 5th shows creative intelligence.',
    hi: 'चतुर्विंशांश शिक्षा और ज्ञान का चार्ट है। बुध और बृहस्पति की स्थिति यहाँ बौद्धिक प्रतिभा और शैक्षिक सफलता निर्धारित करती है।',
  },
  D30: {
    en: 'The Trimshamsha indicates misfortunes, health challenges, and hidden difficulties. Malefic planets in dusthanas (6/8/12) here suggest specific health vulnerabilities. This chart helps identify which life areas are most prone to obstacles.',
    hi: 'त्रिंशांश दुर्भाग्य, स्वास्थ्य चुनौतियाँ और छिपी कठिनाइयाँ दर्शाता है। यह चार्ट पहचानने में मदद करता है कि जीवन के कौन से क्षेत्र बाधाओं के लिए सबसे अधिक संवेदनशील हैं।',
  },
  D60: {
    en: 'The Shashtiamsha is the finest division — each of 60 parts carries a specific past-life signature. This chart reveals the deepest karmic patterns: why certain life themes repeat, what soul-level lessons are being worked through, and which planets carry the heaviest karmic load.',
    hi: 'षष्ट्यंश सबसे सूक्ष्म विभाजन है — 60 भागों में से प्रत्येक एक विशिष्ट पूर्वजन्म हस्ताक्षर वहन करता है। यह चार्ट गहनतम कार्मिक प्रतिरूप दर्शाता है।',
  },
};

// Exaltation / debilitation / own sign lookups for dignity checks
const EXALTATION_SIGNS: Record<number, number> = { 0: 1, 1: 2, 2: 10, 3: 6, 4: 4, 5: 12, 6: 7 };
const DEBILITATION_SIGNS: Record<number, number> = { 0: 7, 1: 8, 2: 4, 3: 12, 4: 10, 5: 6, 6: 1 };
const OWN_SIGNS: Record<number, number[]> = { 0: [5], 1: [4], 2: [1, 8], 3: [3, 6], 4: [9, 12], 5: [2, 7], 6: [10, 11] };

interface VargasTabProps {
  kundali: KundaliData;
  locale: Locale;
  headingFont: React.CSSProperties;
}

export default function VargasTab({ kundali, locale, headingFont }: VargasTabProps) {
  const [selectedDiv, setSelectedDiv] = useState('D9');
  const isHi = locale !== 'en' && locale !== 'ta';

  // Resolve chart data for the selected division
  const chartData: ChartData | null = useMemo(() => {
    if (selectedDiv === 'D1') return kundali.chart;
    if (selectedDiv === 'D9') return kundali.navamshaChart;
    return kundali.divisionalCharts?.[selectedDiv] ?? null;
  }, [selectedDiv, kundali]);

  const divChart: DivisionalChart | null = useMemo(() => {
    if (selectedDiv === 'D1' || selectedDiv === 'D9') return null;
    return (kundali.divisionalCharts?.[selectedDiv] as DivisionalChart) ?? null;
  }, [selectedDiv, kundali]);

  // Compute planet placement info for the selected chart
  const planetPlacements = useMemo(() => {
    if (!chartData) return [];
    const ascSign = chartData.ascendantSign;
    return kundali.planets.map(p => {
      let houseIdx = -1;
      for (let h = 0; h < 12; h++) {
        if (chartData.houses[h]?.includes(p.planet.id)) {
          houseIdx = h;
          break;
        }
      }
      const houseNum = houseIdx >= 0 ? houseIdx + 1 : 0;
      const signInDiv = houseIdx >= 0 ? ((ascSign - 1 + houseIdx) % 12) + 1 : 0;
      const isVargottama = signInDiv > 0 && signInDiv === p.sign;
      const pid = p.planet.id;
      let dignity: string | null = null;
      if (isVargottama) dignity = 'vargottama';
      else if (EXALTATION_SIGNS[pid] === signInDiv) dignity = 'exalted';
      else if (DEBILITATION_SIGNS[pid] === signInDiv) dignity = 'debilitated';
      else if (OWN_SIGNS[pid]?.includes(signInDiv)) dignity = 'own';

      return {
        planet: p,
        houseNum,
        signInDiv,
        signName: signInDiv > 0 ? RASHIS[(signInDiv - 1) % 12]?.name : null,
        isVargottama,
        dignity,
      };
    });
  }, [chartData, kundali.planets]);

  const meta = VARGA_INFO[selectedDiv];
  const ascSign = chartData?.ascendantSign ?? 0;
  const ascSignName = ascSign > 0 ? RASHIS[(ascSign - 1) % 12]?.name : null;

  // Key house analysis
  const keyHousePlanets = useMemo(() => {
    if (!meta || !chartData) return [];
    const hIdx = meta.keyHouse - 1;
    const pIds = chartData.houses[hIdx] ?? [];
    return pIds.map(id => GRAHAS.find(g => g.id === id)).filter(Boolean);
  }, [meta, chartData]);

  const keyHouseSign = useMemo(() => {
    if (!meta || !chartData) return null;
    const sign = ((ascSign - 1 + (meta.keyHouse - 1)) % 12) + 1;
    return RASHIS[(sign - 1) % 12] ?? null;
  }, [meta, chartData, ascSign]);

  // Vimshopaka contribution note
  // VimshopakaBala has { planetName: string, total: number } — not LocaleText
  const vimshopakaNotes = useMemo(() => {
    if (!kundali.vimshopakaBala) return [];
    return kundali.vimshopakaBala.map(vb => ({
      planetName: vb.planetName,
      score: vb.total,
    }));
  }, [kundali.vimshopakaBala]);

  // Available divisions — only show pills for charts that actually exist
  const availableDivisions = useMemo(() => {
    return VARGA_ORDER.filter(d => {
      if (d === 'D1') return true;
      if (d === 'D9') return !!kundali.navamshaChart;
      return !!kundali.divisionalCharts?.[d];
    });
  }, [kundali]);

  const chartTitle = useMemo(() => {
    if (!meta) return selectedDiv;
    return `${selectedDiv} ${isHi ? meta.nameHi : meta.name}`;
  }, [selectedDiv, meta, isHi]);

  return (
    <div className="space-y-6">
      {/* ── Division Selector Pills ── */}
      <div>
        <h3 className="text-gold-light text-lg font-bold mb-3 text-center" style={headingFont}>
          {isHi ? 'वर्ग चार्ट चुनें' : 'Select Divisional Chart'}
        </h3>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex sm:flex-wrap sm:justify-center gap-1.5 min-w-max sm:min-w-0">
            {availableDivisions.map(d => {
              const m = VARGA_INFO[d];
              const isActive = d === selectedDiv;
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDiv(d)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex flex-col items-center min-w-[52px] ${
                    isActive
                      ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40 scale-105'
                      : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10 hover:text-text-primary'
                  }`}
                >
                  <span className="font-bold">{d}</span>
                  {m && (
                    <span className="text-text-secondary/60 text-[10px] leading-tight mt-0.5">
                      {isHi ? m.meaningHi : m.meaning}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Header: Division name + meaning ── */}
      {meta && (
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15">
          <h2 className="text-gold-gradient text-xl font-bold" style={headingFont}>
            {selectedDiv} — {isHi ? meta.nameHi : meta.name}
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            {isHi ? meta.meaningHi : meta.meaning}
          </p>
          {ascSignName && (
            <p className="text-gold-primary/70 text-xs mt-2">
              {isHi ? 'लग्न: ' : 'Ascendant: '}
              {tl(ascSignName, locale)}
            </p>
          )}
          {VARGA_COMMENTARY[selectedDiv] && (
            <p className="text-text-secondary/80 text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
              {isHi ? VARGA_COMMENTARY[selectedDiv].hi : VARGA_COMMENTARY[selectedDiv].en}
            </p>
          )}
        </div>
      )}

      {/* ── Chart Rendering ── */}
      {chartData ? (
        <div className="flex justify-center">
          <div className="w-full max-w-[500px]">
            <ChartNorth data={chartData} title={chartTitle} size={500} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary/60 text-sm">
          {isHi ? 'इस वर्ग के लिए चार्ट डेटा उपलब्ध नहीं है।' : 'Chart data not available for this division.'}
        </div>
      )}

      {/* ── Interpretation Panel ── */}
      {chartData && meta && (
        <div className="space-y-4">

          {/* Key House Analysis */}
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] border border-gold-primary/12 p-5">
            <h4 className="text-gold-light text-sm font-bold uppercase tracking-wider mb-3" style={headingFont}>
              {isHi ? `${meta.keyHouseLabelHi} (भाव ${meta.keyHouse})` : `${meta.keyHouseLabel} (House ${meta.keyHouse})`}
            </h4>
            <div className="space-y-2">
              {keyHouseSign && (
                <p className="text-text-secondary text-xs">
                  <span className="text-gold-primary font-medium">
                    {isHi ? 'राशि: ' : 'Sign: '}
                  </span>
                  {tl(keyHouseSign.name, locale)}
                  {keyHouseSign.rulerName && (
                    <span className="text-text-secondary/60">
                      {' '}({isHi ? 'स्वामी: ' : 'Lord: '}{tl(keyHouseSign.rulerName, locale)})
                    </span>
                  )}
                </p>
              )}
              {keyHousePlanets.length > 0 ? (
                <p className="text-text-secondary text-xs">
                  <span className="text-gold-primary font-medium">
                    {isHi ? 'ग्रह: ' : 'Planets: '}
                  </span>
                  {keyHousePlanets.map(g => g ? tl(g.name, locale) : '').join(', ')}
                </p>
              ) : (
                <p className="text-text-secondary/50 text-xs italic">
                  {isHi ? 'इस भाव में कोई ग्रह नहीं' : 'No planets in this house'}
                </p>
              )}
            </div>
          </div>

          {/* Planet Placements with Dignity */}
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] border border-gold-primary/12 p-5">
            <h4 className="text-gold-light text-sm font-bold uppercase tracking-wider mb-3" style={headingFont}>
              {isHi ? 'ग्रह स्थितियां' : 'Planet Placements'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {planetPlacements.map((pp, i) => {
                if (!pp.signName || pp.houseNum === 0) return null;
                const abbr = GRAHA_ABBREVIATIONS[pp.planet.planet.id] ?? '';
                const dignityClass = pp.dignity === 'exalted' || pp.dignity === 'vargottama'
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : pp.dignity === 'debilitated'
                    ? 'border-red-500/20 bg-red-500/5'
                    : pp.dignity === 'own'
                      ? 'border-sky-500/20 bg-sky-500/5'
                      : 'border-gold-primary/8 bg-gold-primary/3';
                const dignityLabel = pp.dignity === 'vargottama' ? 'Vgm'
                  : pp.dignity === 'exalted' ? (isHi ? 'उच्च' : 'Exalted')
                  : pp.dignity === 'debilitated' ? (isHi ? 'नीच' : 'Debil.')
                  : pp.dignity === 'own' ? (isHi ? 'स्वगृह' : 'Own')
                  : null;
                const dignityBadgeClass = pp.dignity === 'exalted' ? 'bg-emerald-500/20 text-emerald-300'
                  : pp.dignity === 'vargottama' ? 'bg-gold-primary/20 text-gold-light'
                  : pp.dignity === 'debilitated' ? 'bg-red-500/20 text-red-300'
                  : pp.dignity === 'own' ? 'bg-sky-500/20 text-sky-300'
                  : '';

                return (
                  <div key={i} className={`rounded-lg p-2.5 border ${dignityClass}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gold-light font-semibold text-xs">{abbr}</span>
                      <span className="text-text-primary text-xs">{tl(pp.planet.planet.name, locale)}</span>
                      <span className="text-text-secondary/50 text-[10px]">
                        H{pp.houseNum} · {tl(pp.signName, locale)}
                      </span>
                      {dignityLabel && (
                        <span className={`text-[10px] font-bold px-1 py-0.5 rounded ${dignityBadgeClass}`}>
                          {dignityLabel}
                        </span>
                      )}
                    </div>
                    {pp.isVargottama && (
                      <p className="text-emerald-400/70 text-[10px] mt-1 italic">
                        {isHi
                          ? 'वर्गोत्तम — D1 और इस वर्ग में एक ही राशि। बल दोगुना।'
                          : 'Vargottama — same sign in D1 and this division. Strength doubled.'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vimshopaka Bala Summary */}
          {vimshopakaNotes.length > 0 && (
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] border border-gold-primary/12 p-5">
              <h4 className="text-gold-light text-sm font-bold uppercase tracking-wider mb-3" style={headingFont}>
                {isHi ? 'विंशोपक बल (सभी वर्ग)' : 'Vimshopaka Bala (All Vargas)'}
              </h4>
              <p className="text-text-secondary/60 text-xs mb-3">
                {isHi
                  ? 'विंशोपक बल 20-सूत्रीय पद्धति है जो सभी 16 वर्गों में ग्रह की स्थिति को मिलाकर एक समग्र शक्ति अंक देती है।'
                  : 'Vimshopaka Bala is a 20-point system that combines a planet\'s dignity across all 16 divisional charts into one composite strength score.'}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                {vimshopakaNotes.map((v, i) => {
                  const pct = (v.score / 20) * 100;
                  const color = pct >= 60 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                    : pct >= 35 ? 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                    : 'text-red-400 border-red-500/20 bg-red-500/5';
                  return (
                    <div key={i} className={`rounded-lg p-2 text-center border ${color}`}>
                      <div className="text-xs font-bold">{v.planetName}</div>
                      <div className="text-sm font-bold mt-0.5">{v.score.toFixed(1)}</div>
                      <div className="text-text-secondary/40 text-[10px]">/20</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

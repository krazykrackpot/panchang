'use client';

import { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { tl } from '@/lib/utils/trilingual';
import { authedFetch } from '@/lib/api/authed-fetch';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import BirthForm from '@/components/kundali/BirthForm';
import ConvergenceSummary from '@/components/kundali/ConvergenceSummary';
import AIReadingButton from '@/components/kundali/AIReadingButton';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import GoldDivider from '@/components/ui/GoldDivider';
import ShareButton from '@/components/ui/ShareButton';
import PrintButton from '@/components/ui/PrintButton';
import { Download, Save, Check, ScrollText } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { generateKundaliPrintHtml } from '@/lib/pdf/kundali-pdf';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS, GRAHA_ABBREVIATIONS } from '@/lib/constants/grahas';
import { getPlanetaryPositions, toSidereal, dateToJD, normalizeDeg } from '@/lib/ephem/astronomical';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';
import { trackKundaliGenerated, trackTabViewed } from '@/lib/analytics';
import type { TippanniContent, PlanetInsight } from '@/lib/kundali/tippanni-types';
import type { MahadashaOverview, AntardashaSynthesis, PratyantardashaSynthesis, PeriodAssessment } from '@/lib/tippanni/dasha-synthesis-types';
import { detectAfflictedPlanets, type AfflictedPlanet } from '@/lib/puja/affliction-detector';
import type { KundaliData, BirthData, ChartStyle, PlanetPosition, AshtakavargaData, DivisionalChart, GrahaDetail, UpagrahaPosition } from '@/types/kundali';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import type { BhavaBalaResult } from '@/lib/kundali/bhavabala';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import type { Locale } from '@/types/panchang';
import type { SadeSatiAnalysis, NakshatraTransitEntry } from '@/lib/kundali/sade-sati-analysis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { useBirthDataStore } from '@/stores/birth-data-store';
import { generateVargaTippanni, type VargaChartTippanni, type VargaSynthesis } from '@/lib/tippanni/varga-tippanni';
import PaywallGate from '@/components/ui/PaywallGate';
import InfoBlock from '@/components/ui/InfoBlock';
import { ShadbalaInterpretation, YogasInterpretation, AvasthasInterpretation, BhavabalaInterpretation, PlanetsInterpretation, DashaInterpretation } from '@/components/kundali/InterpretationHelpers';
import JaiminiTab from '@/components/kundali/JaiminiTab';
import SphutasTab from '@/components/kundali/SphutasTab';
import ShareableKundaliCard from '@/components/kundali/ShareableKundaliCard';

// Lazy-loaded components for non-critical tabs
const TransitRadar = lazy(() => import('@/components/kundali/TransitRadar'));
const ChartChatTab = lazy(() => import('@/components/kundali/ChartChatTab'));
const LifeTimeline = lazy(() => import('@/components/kundali/LifeTimeline'));
const PatrikaTab = lazy(() => import('@/components/kundali/PatrikaTab'));

// Planet colors for table highlights
const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', 1: '#ecf0f1', 2: '#e74c3c', 3: '#2ecc71',
  4: '#f39c12', 5: '#e8e6e3', 6: '#3498db', 7: '#8e44ad', 8: '#95a5a6',
};

// Extracted to module level to avoid recreation on every render
const HOUSE_THEMES: Record<number, { en: string; hi: string }> = {
  1: { en: 'Self, body, health, personality', hi: 'आत्म, शरीर, स्वास्थ्य' },
  2: { en: 'Wealth, family, speech', hi: 'धन, परिवार, वाणी' },
  3: { en: 'Courage, siblings, short travel', hi: 'साहस, भाई-बहन, लघु यात्रा' },
  4: { en: 'Home, mother, property, comfort', hi: 'घर, माता, सम्पत्ति, सुख' },
  5: { en: 'Children, education, creativity', hi: 'सन्तान, शिक्षा, रचनात्मकता' },
  6: { en: 'Enemies, health issues, service', hi: 'शत्रु, स्वास्थ्य, सेवा' },
  7: { en: 'Marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार' },
  8: { en: 'Transformation, longevity, occult', hi: 'परिवर्तन, दीर्घायु, गुप्त विद्या' },
  9: { en: 'Fortune, father, dharma, guru', hi: 'भाग्य, पिता, धर्म, गुरु' },
  10: { en: 'Career, status, authority', hi: 'कैरियर, प्रतिष्ठा, अधिकार' },
  11: { en: 'Gains, income, friends, wishes', hi: 'लाभ, आय, मित्र, इच्छाएँ' },
  12: { en: 'Expenses, liberation, foreign', hi: 'व्यय, मोक्ष, विदेश' },
};

const NARAYANA_SIGN_PROFILES: Record<number, { en: string; hi: string }> = {
  1:  { en: 'Aries Dasha — dynamic, pioneering period. New ventures launch; courage is tested. Competitive environments, conflicts, and breakthroughs in tandem. Events come suddenly; decisions must be made swiftly. Body, head, and Mars-ruled matters are activated. If Mars is well-placed, decisive victories; if afflicted, accidents or surgeries are possible.', hi: 'मेष दशा — गतिशील, अग्रणी काल। नए उद्यम प्रारंभ; साहस की परीक्षा। प्रतिस्पर्धा, संघर्ष और सफलता साथ-साथ। घटनाएं अचानक; त्वरित निर्णय आवश्यक। यदि मंगल बलवान हो तो विजय; पीड़ित हो तो दुर्घ���ना संभव।' },
  2:  { en: 'Taurus Dasha — stable, accumulative period. Financial matters dominate; property, land, and fixed assets are acquired or transacted. Marriage and partnerships come into focus. Pleasures and comforts increase. Progress is slow but steady; patience is rewarded with lasting prosperity. Venus-ruled arts and aesthetic pursuits flourish.', hi: 'वृष दशा — स्थिर, संचयशील काल। वित्तीय मामले प्रमुख; सम्पत्ति, भूमि अर्जित या हस्तांतरित। विवाह और साझेदारियां केंद्र में। सुख-सुविधाएं बढ़ती हैं। धीमी किन्तु स्थिर प्रगति; धैर्य से स्थायी समृद्धि।' },
  3:  { en: 'Gemini Dasha — intellectual, communicative period. Education, writing, and short journeys multiply. Siblings play a significant role. Two paths or dual involvements are common. Business dealings and negotiations succeed. The mind is sharp and restless — channelled well, it achieves brilliance; scattered, it produces anxiety.', hi: 'मिथुन दशा — बौद्धिक, ���ंचार-प्रधान काल। शिक्षा, लेखन और लघु यात्राएं बढ़ती हैं। भाई-बहनों की भूमिका महत्वपूर्ण। दोहरी राहें सामान्य। व्यापार और वार्ता में सफलता। मन तीव्र और बेचैन — सुनिर्देशित हो तो प्रतिभाशाली।' },
  4:  { en: 'Cancer Dasha — domestic, emotional period. Home, mother, and property matters dominate. Residential changes or renovations are common. Emotional sensitivity peaks — intuition is strong. Real estate deals are favourable. Mother\'s health may require attention. Psychic experiences and vivid dreams are possible.', hi: 'कर्क दशा — गृह, भावनात्मक काल। घर, माता और सम्पत्ति मामले प्रमुख। आवासीय परिवर्तन सामान्य। भावनात्मक संवेदनशीलता शिखर पर। अचल सम्पत्ति अनुकूल। माता का स्वास्थ्य ध्यान योग्य। अतींद्रिय अनुभव संभव।' },
  5:  { en: 'Leo Dasha — authoritative, prestigious period. Career advancement and social recognition are prominent. Father\'s influence is strong. Dealings with government or authority figures feature. Children may be a central theme. Creative expression and leadership roles come naturally. Pride and dignity are tested — humility prevents falls.', hi: 'सिंह दशा — अधिकार, प्रतिष्ठा काल। कैरियर उन्नति और सामाजिक मान्यता प्रमुख। पिता का प्रभाव बलवान। सरकार या अधिकारियों से व्यवहार। संतान केंद्रीय विषय। रचनात्मक अभिव्यक्ति स्वाभाविक। अहंकार की परीक्षा — विनम्रता आवश्यक।' },
  6:  { en: 'Virgo Dasha — service, health-focused period. Work routines and employment matters are central. Health issues may arise and be resolved. Enemies or disputes surface — detailed attention to contracts and agreements is crucial. Debts are settled. Service-oriented activities succeed. The native works harder than usual, with tangible rewards.', hi: 'कन्या दशा — सेवा, स्वास्थ्य-केंद्रित काल। कार्य दिनचर्या और रोजगार मामले केंद्रीय। स्वास्थ्य समस्याएं उठ सकती और सुलझ सकती हैं। शत्रु या विवाद उभरते हैं। ऋण चुकाए जाते हैं। सेवा-कार्य सफल होते हैं।' },
  7:  { en: 'Libra Dasha — partnership, justice-seeking period. Marriage, business partnerships, and legal agreements dominate. Travel is prominent. Balance and fairness are sought in all dealings. Collaborative ventures succeed; solo efforts struggle. Venus-ruled pleasures abound. Legal settlements or court matters may conclude.', hi: 'तुला दशा — साझेदारी, न्याय-साधना काल। विवाह, व्यापारिक साझेदारी और कानूनी समझौते प्रमुख। यात्रा महत्वपूर्ण। सहयोगी उद्यम सफल। वीनस-प्रभावित सुख प्रचुर। कानूनी निपटान संभव।' },
  8:  { en: 'Scorpio Dasha — transformative, crisis-prone period. Hidden matters surface; secrets are revealed. Inheritance, insurance, or joint finances may be involved. Accidents, surgeries, or near-death experiences are possible if 8th lord is afflicted. Occult research and spiritual depth are favoured. Profound inner transformation accompanies outer disruption.', hi: 'वृश्चिक दशा — परिवर्तनकारी, संकट-सम्भावित काल। छिपे विषय उजागर; रहस्य प्रकट। विरासत, बीमा या संयुक्त वित्त जुड़ा। दुर्घटना या शल्य संभव। आध्यात���मिक गहराई अनुकूल। बाहरी उथल-पुथल के साथ गहरा आंतरिक परिवर्तन।' },
  9:  { en: 'Sagittarius Dasha — expansive, dharmic period. Higher education, philosophy, and long-distance travel feature prominently. Father\'s health and teacher/guru influence are strong. Religious activities, foreign journeys, and charitable work flourish. Optimism expands; fortune smiles. The native reaches beyond familiar boundaries and grows.', hi: 'धनु दशा — विस्तारशील, धार्मिक काल। उच्च शिक्षा, दर्शन और दूर यात्राएं प्रमुख। पिता का स्वास्थ्य और गुरु का प्रभाव बलवान। धार्मिक कार्य, विदेश यात्रा फलती है। आशावाद बढ़ता है। परिचित सीमाओं से परे जाना।' },
  10: { en: 'Capricorn Dasha — career-peak, ambition-activated period. Professional life demands maximum effort and delivers maximum reward when Saturn is strong. Government dealings, structured work, and long-term projects bear fruit. Property gains are possible. Discipline and perseverance are the keys — karmic lessons from past effort arrive as results.', hi: 'मकर दशा — कैरियर शिखर, महत्वाकांक्षा-सक्रिय काल। व्यावसायिक जी���न अधिकतम प्रयास मांगता और देता है। सरकारी कार्य, दीर्घकालिक परियोजनाएं फलती हैं। अनुशासन और अध्यवसाय मुख्य कुंजी।' },
  11: { en: 'Aquarius Dasha — social, gain-oriented period. Community involvement, friendship networks, and collective causes are activated. Gains from groups, elder siblings, and unexpected sources arrive. Unconventional events and sudden opportunities appear. Technology and innovation benefit the native. Ambitions find fulfilment through social means.', hi: '��ुंभ दशा — सामाजिक, लाभ-उन्मुख काल। समुदाय, मित्र नेटवर्क और सामूहिक कारण सक्रि��। समूहों से लाभ। अप्रत्याशित घटनाएं और अवसर। प्रौद्योगिकी और नवाचार लाभकारी। सामाजिक साधनों से महत्वाकांक्षा पूरी।' },
  12: { en: 'Pisces Dasha — spiritual, introspective period. Foreign travel, ashrams, hospitals, and retreats feature. Intuition and psychic gifts peak. Hidden losses are possible but offset by spiritual gains. Charitable work and service to the suffering are favoured. The soul turns inward — those who embrace this find liberation; those who resist find confusion.', hi: 'मीन दशा — आध्यात्मिक, आत्मनिरीक्षण काल। विदेश, आश्रम, अस्पताल और एकांत प्रमुख। अंतर्ज्ञान शिखर पर। छिपे नुकसान संभव। दान और पीड़ितों की सेवा अनुकूल। आत्मा अंतर्मुखी होती है — जो स्वीकारते हैं उन्हें मुक्ति, जो विरोध करते हैं उन्हें भ्रम।' },
};

const GANDA_MULA_DATA: Record<number, { type: { en: string; hi: string }; affected: { en: string; hi: string }; procedure: { en: string; hi: string } }> = {
  1:  { type: { en: 'Ketu-ruled (Ashwini)', hi: 'केतु-शासित (अश्विनी)' }, affected: { en: 'Father', hi: 'पिता' }, procedure: { en: 'Shanti puja on 27th day', hi: '27वें दिन शांति पूजा' } },
  10: { type: { en: 'Ketu-ruled (Magha)', hi: 'केतु-शासित (मघा)' }, affected: { en: 'Father', hi: 'पिता' }, procedure: { en: 'Shanti puja on 27th day', hi: '27वें दिन शांति पूजा' } },
  19: { type: { en: 'Ketu-ruled (Moola)', hi: 'केतु-शासित (मूल)' }, affected: { en: 'Father-in-law', hi: 'ससुर' }, procedure: { en: 'Most intense Ganda Mula. Shanti havan recommended within 27 days.', hi: 'सबसे तीव्र गण्ड मूल। 27 दिनों के भीतर शांति हवन अनुशंसित।' } },
  9:  { type: { en: 'Mercury-ruled (Ashlesha)', hi: 'बुध-शासित (आश्लेषा)' }, affected: { en: 'Mother-in-law', hi: 'सास' }, procedure: { en: 'Shanti puja on 27th day', hi: '27वें दिन शांति पूजा' } },
  18: { type: { en: 'Mercury-ruled (Jyeshtha)', hi: 'बुध-शासित (ज्येष्ठा)' }, affected: { en: 'Elder brother', hi: 'बड़ा भाई' }, procedure: { en: 'Shanti puja on 27th day', hi: '27वें दिन शांति पूजा' } },
  27: { type: { en: 'Mercury-ruled (Revati)', hi: 'बुध-शासित (रेवती)' }, affected: { en: 'Mother', hi: 'माता' }, procedure: { en: 'Generally mild; simple Ganesha puja suffices.', hi: 'सामान्यतः सौम्य; साधारण गणेश पूजा पर्याप्त।' } },
};

const PLANET_COLORS_SPHUTA: Record<number, string> = {
  0: 'text-amber-400', 1: 'text-slate-300', 2: 'text-red-400', 3: 'text-emerald-400',
  4: 'text-yellow-300', 5: 'text-pink-300', 6: 'text-blue-400', 7: 'text-purple-400', 8: 'text-gray-400',
};

const SIGN_ELEMENTS: Record<number, string> = {
  1: 'Fire', 2: 'Earth', 3: 'Air', 4: 'Water', 5: 'Fire', 6: 'Earth',
  7: 'Air', 8: 'Water', 9: 'Fire', 10: 'Earth', 11: 'Air', 12: 'Water',
};

const SIGN_ELEMENTS_HI: Record<number, string> = {
  1: 'अग्नि', 2: 'पृथ्वी', 3: 'वायु', 4: 'जल', 5: 'अग्नि', 6: 'पृथ्वी',
  7: 'वायु', 8: 'जल', 9: 'अग्नि', 10: 'पृथ्वी', 11: 'वायु', 12: 'जल',
};

function HouseDetailPanel({
  houseNum,
  kundali,
  locale,
  isDevanagari,
  onClose,
}: {
  houseNum: number;
  kundali: KundaliData;
  locale: Locale;
  isDevanagari: boolean;
  onClose: () => void;
}) {
  const isTamil = String(locale) === 'ta';
  const house = kundali.houses.find(h => h.house === houseNum);
  const planetsInHouse = kundali.planets.filter(p => p.house === houseNum);
  const signNum = house?.sign || 1;
  const rashi = RASHIS[signNum - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <RashiIconById id={signNum} size={48} />
          <div>
            <h3 className="text-gold-light text-xl font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' }}>
              {locale === 'en' || isTamil ? `House ${houseNum}` : `भाव ${houseNum}`}
              {houseNum === 1 && <span className="text-gold-primary ml-2 text-sm">({locale === 'en' || isTamil ? 'Ascendant' : 'लग्न'})</span>}
            </h3>
            <p className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {tl(rashi?.name, locale)} &mdash; {locale === 'en' || isTamil ? 'Lord' : 'स्वामी'}: {tl(house?.lordName, locale)}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-gold-light transition-colors text-xl leading-none p-1"
        >
          &times;
        </button>
      </div>

      {planetsInHouse.length > 0 ? (
        <div className="space-y-3">
          {planetsInHouse.map((p) => (
            <PlanetDetailRow key={p.planet.id} planet={p} locale={locale} isDevanagari={isDevanagari} />
          ))}
        </div>
      ) : (
        <p className="text-text-secondary/70 text-center py-4">
          {locale === 'en' || isTamil ? 'No planets in this house' : 'इस भाव में कोई ग्रह नहीं'}
        </p>
      )}

      {/* House significations + layperson personal implication */}
      <div className="mt-4 pt-4 border-t border-gold-primary/10 space-y-3">
        <div>
          <p className="text-gold-dark text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Life Area' : 'जीवन क्षेत्र'}</p>
          <p className="text-text-secondary text-sm">{getHouseSignifications(houseNum, locale)}</p>
        </div>
        <div className="rounded-lg bg-gold-primary/5 border border-gold-primary/15 p-3">
          <p className="text-gold-dark text-xs uppercase tracking-wider mb-1.5">{locale === 'en' || isTamil ? 'What this means for you' : 'आपके लिए इसका अर्थ'}</p>
          <p className="text-text-secondary text-xs leading-relaxed">
            {locale === 'en' || isTamil
              ? planetsInHouse.length === 0
                ? `House ${houseNum} has no planets — its results depend primarily on the condition of its lord (${house?.lordName.en}). Trace ${house?.lordName.en}'s sign and house to understand how this life area performs for you.`
                : planetsInHouse.length === 1
                ? `${planetsInHouse[0].planet.name.en} occupies this house, making it the dominant force in your ${getHouseSignifications(houseNum, 'en').split(',')[0].trim().toLowerCase()} area. ${planetsInHouse[0].isExalted ? `${planetsInHouse[0].planet.name.en} is exalted here — this is a major strength.` : planetsInHouse[0].isDebilitated ? `${planetsInHouse[0].planet.name.en} is debilitated here — this area requires extra effort and attention.` : planetsInHouse[0].isRetrograde ? `${planetsInHouse[0].planet.name.en} is retrograde — results come through reflection, revisiting, and internal processing rather than direct action.` : `${planetsInHouse[0].planet.name.en} directs its themes (${planetsInHouse[0].planet.name.en === 'Sun' ? 'authority, recognition' : planetsInHouse[0].planet.name.en === 'Moon' ? 'emotions, instincts' : planetsInHouse[0].planet.name.en === 'Mars' ? 'drive, courage' : planetsInHouse[0].planet.name.en === 'Mercury' ? 'intellect, communication' : planetsInHouse[0].planet.name.en === 'Jupiter' ? 'wisdom, expansion' : planetsInHouse[0].planet.name.en === 'Venus' ? 'relationships, pleasure' : planetsInHouse[0].planet.name.en === 'Saturn' ? 'discipline, karmic lessons' : planetsInHouse[0].planet.name.en === 'Rahu' ? 'ambition, obsession' : 'spirituality, detachment'}) into this life area.`}`
                : `Multiple planets (${planetsInHouse.map(p => p.planet.name.en).join(', ')}) occupy this house — this life area is highly activated and complex. Expect significant activity, both opportunities and challenges, related to ${getHouseSignifications(houseNum, 'en').split(',').slice(0, 2).join(' and ').toLowerCase()}.`
              : planetsInHouse.length === 0
                ? `भाव ${houseNum} में कोई ग्रह नहीं है — परिणाम मुख्यतः इसके स्वामी (${house?.lordName.hi}) की स्थिति पर निर्भर करते हैं।`
                : planetsInHouse.length === 1
                ? `${planetsInHouse[0].planet.name.hi} इस भाव में है, जो इस जीवन क्षेत्र की प्रमुख शक्ति है। ${planetsInHouse[0].isExalted ? `${planetsInHouse[0].planet.name.hi} उच्च में है — यह एक प्रमुख शक्ति है।` : planetsInHouse[0].isDebilitated ? `${planetsInHouse[0].planet.name.hi} नीच में है — इस क्षेत्र में अतिरिक्त प्रयास चाहिए।` : planetsInHouse[0].isRetrograde ? `${planetsInHouse[0].planet.name.hi} वक्री है — परिणाम आत्म-विचार और पुनरावलोकन से आते हैं।` : `${planetsInHouse[0].planet.name.hi} अपने विषय इस जीवन क्षेत्र में लाता है।`}`
                : `एकाधिक ग्रह (${planetsInHouse.map(p => p.planet.name.hi).join(', ')}) इस भाव में हैं — यह जीवन क्षेत्र अत्यंत सक्रिय और जटिल है।`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PlanetDetailRow({ planet: p, locale, isDevanagari }: { planet: PlanetPosition; locale: Locale; isDevanagari: boolean }) {
  const isTamil = String(locale) === 'ta';
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <motion.div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10 hover:border-gold-primary/25 cursor-pointer transition-all"
        whileHover={{ scale: 1.01 }}
      >
        <GrahaIconById id={p.planet.id} size={36} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base" style={{ color: p.planet.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>
              {tl(p.planet.name, locale)}
            </span>
            {p.isRetrograde && <span className="text-red-400 text-xs font-bold px-1.5 py-0.5 bg-red-500/10 rounded">R</span>}
            {p.isExalted && <span className="text-emerald-400 text-xs font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded">{locale === 'en' || isTamil ? 'Exalted' : 'उच्च'}</span>}
            {p.isDebilitated && <span className="text-orange-400 text-xs font-bold px-1.5 py-0.5 bg-orange-500/10 rounded">{locale === 'en' || isTamil ? 'Debilitated' : 'नीच'}</span>}
            {p.isOwnSign && <span className="text-blue-400 text-xs font-bold px-1.5 py-0.5 bg-blue-500/10 rounded">{locale === 'en' || isTamil ? 'Own Sign' : 'स्वगृह'}</span>}
            {p.isVargottama && <span className="text-gold-light text-xs font-bold px-1.5 py-0.5 bg-gold-primary/15 rounded border border-gold-primary/30" title={locale === 'en' || isTamil ? 'Strength equal to double exaltation — same sign in D1 and D9' : 'वर्गोत्तम — D1 और D9 में एक ही राशि'}>Vgm</span>}
            {p.isMrityuBhaga && <span className="text-rose-400 text-xs font-bold px-1.5 py-0.5 bg-rose-500/10 rounded" title={locale === 'en' || isTamil ? 'At or near Mrityu Bhaga — dangerous degree, severely weakened' : 'मृत्यु भाग — खतरनाक अंश, बल में गिरावट'}>MB</span>}
            {p.isPushkarNavamsha && <span className="text-sky-300 text-xs font-bold px-1.5 py-0.5 bg-sky-500/10 rounded border border-sky-400/20" title={locale === 'en' || isTamil ? 'Pushkar Navamsha — supremely auspicious navamsha position' : 'पुष्कर नवांश — अत्यंत शुभ नवांश स्थिति'}>Pushkar Nav.</span>}
            {p.isPushkarBhaga && <span className="text-emerald-300 text-xs font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-400/20" title={locale === 'en' || isTamil ? 'Pushkar Bhaga — most auspicious degree in the sign. Greatly strengthens this planet.' : 'पुष्कर भाग — राशि में सर्वाधिक शुभ अंश। ग्रह को अत्यंत बल मिलता है।'}>Pushkar Bh.</span>}
          </div>
          <div className="text-text-secondary text-xs mt-0.5">
            <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(p.signName, locale)}</span>
            <span className="mx-1.5 text-gold-dark/30">|</span>
            <span className="font-mono">{p.degree}</span>
          </div>
        </div>
        <svg className={`w-4 h-4 text-gold-dark/50 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-3 ml-12 text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gold-dark">{locale === 'en' || isTamil ? 'Nakshatra' : 'नक्षत्र'}</span>
                <span className="text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(p.nakshatra.name, locale)} ({locale === 'en' || isTamil ? 'Pada' : 'पाद'} {p.pada})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-dark">{locale === 'en' || isTamil ? 'Speed' : 'गति'}</span>
                <span className="text-text-secondary font-mono">{p.speed.toFixed(4)}°/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-dark">{locale === 'en' || isTamil ? 'Longitude' : 'अंश'}</span>
                <span className="text-text-secondary font-mono">{p.longitude.toFixed(4)}°</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getHouseSignifications(house: number, locale: Locale): string {
  const isTamil = String(locale) === 'ta';
  const sigs: Record<number, { en: string; hi: string }> = {
    1: { en: 'Self, personality, physical body, appearance, vitality', hi: 'आत्म, व्यक्तित्व, शरीर, रूप, जीवन शक्ति' },
    2: { en: 'Wealth, family, speech, food, early education', hi: 'धन, परिवार, वाणी, भोजन, प्रारम्भिक शिक्षा' },
    3: { en: 'Courage, siblings, communication, short journeys', hi: 'साहस, भाई-बहन, संवाद, छोटी यात्राएँ' },
    4: { en: 'Mother, home, property, vehicles, emotional peace', hi: 'माता, गृह, सम्पत्ति, वाहन, मानसिक शान्ति' },
    5: { en: 'Children, intelligence, creativity, romance, past merit', hi: 'सन्तान, बुद्धि, रचनात्मकता, प्रेम, पूर्वपुण्य' },
    6: { en: 'Enemies, disease, debts, service, daily work', hi: 'शत्रु, रोग, ऋण, सेवा, दैनिक कार्य' },
    7: { en: 'Marriage, partnerships, business, public dealings', hi: 'विवाह, साझेदारी, व्यापार, सार्वजनिक व्यवहार' },
    8: { en: 'Longevity, transformation, occult, inheritance, obstacles', hi: 'आयु, परिवर्तन, गुप्त विद्या, विरासत, बाधाएँ' },
    9: { en: 'Fortune, dharma, father, higher education, pilgrimage', hi: 'भाग्य, धर्म, पिता, उच्च शिक्षा, तीर्थयात्रा' },
    10: { en: 'Career, fame, authority, government, public image', hi: 'करियर, यश, अधिकार, शासन, सार्वजनिक छवि' },
    11: { en: 'Gains, income, elder siblings, wishes fulfilled', hi: 'लाभ, आय, बड़े भाई-बहन, इच्छा पूर्ति' },
    12: { en: 'Expenses, losses, foreign lands, liberation, sleep', hi: 'व्यय, हानि, विदेश, मोक्ष, निद्रा' },
  };
  return sigs[house]?.[locale === 'en' || isTamil ? 'en' : 'hi'] || '';
}

export default function KundaliPage() {
  const t = useTranslations('kundali');
  const tTip = useTranslations('tippanni');
  const locale = useLocale() as Locale;
  const isTamil = (locale as string) === 'ta';
  const isDevanagari = locale !== 'en' && !isTamil;
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const L3 = (en: string, hi: string, ta?: string) => isTamil ? (ta || en) : locale === 'en' ? en : hi;

  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('north');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const user = useAuthStore(s => s.user);

  const handleSaveChart = async () => {
    if (!user || !kundali) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setSaving(true);
    try {
      await supabase.from('saved_charts').insert({
        user_id: user.id,
        label: kundali.birthData.name || 'Chart',
        birth_data: {
          name: kundali.birthData.name,
          date: kundali.birthData.date,
          time: kundali.birthData.time,
          place: kundali.birthData.place,
          lat: kundali.birthData.lat,
          lng: kundali.birthData.lng,
          timezone: kundali.birthData.timezone,
        },
        is_primary: false,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* silently fail */ }
    setSaving(false);
  };
  const [activeTab, setActiveTab] = useState<'chart' | 'planets' | 'dasha' | 'ashtakavarga' | 'tippanni' | 'varga' | 'chat' | 'jaimini' | 'graha' | 'yogas' | 'shadbala' | 'bhavabala' | 'avasthas' | 'argala' | 'sphutas' | 'sadesati' | 'patrika' | 'timeline'>('chart');
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [activeChart, setActiveChart] = useState<string>('D1');
  const [dashaSystem, setDashaSystem] = useState('vimshottari');
  const [showTransits, setShowTransits] = useState(false);
  const [transitData, setTransitData] = useState<{ planets: { id: number; name: { en: string; hi: string; sa: string }; rashi: number; longitude: number; isRetrograde: boolean }[] } | null>(null);

  // Restore last kundali from sessionStorage on mount (survives locale switches)
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('kundali_last_result');
      if (cached) {
        const { kundali: k, chartStyle: cs } = JSON.parse(cached);
        if (k?.planets) {
          setKundali(k);
          setChartStyle(cs || 'north');
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Fetch current transits when toggled on
  useEffect(() => {
    if (showTransits && !transitData) {
      fetch('/api/panchang').then(r => r.json()).then(data => {
        if (data.planets) setTransitData({ planets: data.planets });
      }).catch(() => {});
    }
  }, [showTransits, transitData]);

  // Tippanni insights for planet commentary in Planets & Graha tabs
  const tip = useMemo(() => kundali ? generateTippanni(kundali, locale) : null, [kundali, locale]);

  // Retrograde and combust planet sets for chart rendering
  const retrogradeIds = useMemo(() => kundali ? new Set(kundali.planets.filter(p => p.isRetrograde).map(p => p.planet.id)) : new Set<number>(), [kundali]);
  const combustIds = useMemo(() => kundali ? new Set(kundali.planets.filter(p => p.isCombust).map(p => p.planet.id)) : new Set<number>(), [kundali]);

  // Build transit ChartData for chart overlay
  const transitChartData = useMemo(() => {
    if (!kundali || !transitData || !showTransits) return undefined;
    const ascSign = kundali.ascendant.sign;
    const houses: number[][] = Array.from({ length: 12 }, () => []);
    for (const tp of transitData.planets) {
      // Only overlay slow planets (Jupiter, Saturn, Rahu, Ketu) — fast planets change too quickly
      if (tp.id < 4 || tp.id === 5) continue; // skip Sun, Moon, Mars, Mercury, Venus
      const houseIdx = ((tp.rashi - ascSign + 12) % 12);
      houses[houseIdx].push(tp.id);
    }
    return { houses, ascendantDeg: kundali.ascendant.degree, ascendantSign: ascSign } as import('@/types/kundali').ChartData;
  }, [kundali, transitData, showTransits]);

  // ── Sphuta transit windows ────────────────────────────────────────────────
  // Estimates when key planets will next cross each sensitive sphuta degree.
  // Uses average daily motions + birth positions; retrograde adds ~4-6 week variance.
  const sphuataTransitData = useMemo(() => {
    if (!kundali?.sphutas || !kundali.julianDay || !kundali.planets) return null;
    const today = new Date();
    const todayJD = dateToJD(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const daysSince = todayJD - kundali.julianDay;

    const AVG_SPEEDS: Record<number, number> = {
      0: 0.9856, 1: 13.176, 2: 0.524,  3: 1.383,
      4: 0.0831, 5: 1.2,    6: 0.0335, 7: -0.0529, 8: -0.0529,
    };
    const PLANET_NAMES_EN = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
    const PERIOD_YEARS: Record<number, string> = { 0:'~1 yr',1:'~27 days',2:'~2 yrs',3:'~1 yr',4:'~12 yrs',5:'~1 yr',6:'~29.5 yrs',7:'~18 yrs',8:'~18 yrs' };

    const approxCurrentLong = (pid: number): number => {
      const p = kundali.planets.find(pl => pl.planet.id === pid);
      const bLong = p ? p.longitude : 0;
      const speed = AVG_SPEEDS[pid] ?? 0;
      return normalizeDeg(bLong + speed * daysSince);
    };

    const nextTransit = (targetDeg: number, pid: number): {
      label: string; labelHi: string; daysAway: number; isActive: boolean; planetName: string; period: string;
    } => {
      const speed = AVG_SPEEDS[pid];
      if (!speed) return { label: '—', labelHi: '—', daysAway: 9999, isActive: false, planetName: PLANET_NAMES_EN[pid] || 'Unknown', period: '' };
      const curr = approxCurrentLong(pid);
      let delta = speed > 0 ? normalizeDeg(targetDeg - curr) : normalizeDeg(curr - targetDeg);
      const isActive = delta <= 5 || delta >= 355;
      if (isActive) delta = 0;
      const daysAway = isActive ? 0 : delta / Math.abs(speed);
      const centerDate = new Date();
      centerDate.setDate(centerDate.getDate() + Math.round(daysAway));

      // Window = ±5° around target. halfWindowDays = 5 / speed.
      const halfWindowDays = Math.round(5 / Math.abs(speed));
      const showRange = halfWindowDays >= 7; // skip range for Sun (~5d) and Moon (~9h)
      const fmtShort = (d: Date, loc: string) => d.toLocaleDateString(loc, { month: 'short', year: 'numeric' });

      let label: string;
      let labelHi: string;
      if (isActive) {
        // Show how long the window remains
        if (showRange) {
          const exitDate = new Date();
          exitDate.setDate(exitDate.getDate() + halfWindowDays);
          label   = `Active – ${fmtShort(exitDate, 'en-US')}`;
          labelHi = `सक्रिय – ${fmtShort(exitDate, 'hi-IN')}`;
        } else {
          label = 'Active now!'; labelHi = 'अभी सक्रिय!';
        }
      } else if (daysAway < 30) {
        label = `~${Math.round(daysAway)} days`; labelHi = `~${Math.round(daysAway)} दिन`;
      } else if (showRange) {
        const startDate = new Date(); startDate.setDate(startDate.getDate() + Math.max(0, Math.round(daysAway - halfWindowDays)));
        const endDate   = new Date(); endDate.setDate(endDate.getDate()   + Math.round(daysAway + halfWindowDays));
        label   = `${fmtShort(startDate,'en-US')} – ${fmtShort(endDate,'en-US')}`;
        labelHi = `${fmtShort(startDate,'hi-IN')} – ${fmtShort(endDate,'hi-IN')}`;
      } else {
        label   = centerDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        labelHi = centerDate.toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' });
      }
      return { label, labelHi, daysAway: Math.round(daysAway), isActive, planetName: PLANET_NAMES_EN[pid] || '', period: PERIOD_YEARS[pid] || '' };
    };

    const sp = kundali.sphutas;

    const yogiJupiter    = nextTransit(sp.yogiPoint.degree, 4);
    const yogiPlanetTx   = sp.yogiPoint.yogiPlanet !== 4 ? nextTransit(sp.yogiPoint.degree, sp.yogiPoint.yogiPlanet) : null;
    const avayogiSaturn  = nextTransit(sp.avayogiPoint.degree, 6);
    const avayogiPlanTx  = sp.avayogiPoint.avayogiPlanet !== 6 ? nextTransit(sp.avayogiPoint.degree, sp.avayogiPoint.avayogiPlanet) : null;
    const pranaSun       = nextTransit(sp.pranaSphuta.degree, 0);
    const pranaJupiter   = nextTransit(sp.pranaSphuta.degree, 4);
    const dehaMoon       = nextTransit(sp.dehaSphuta.degree, 1);
    const dehaSaturn     = nextTransit(sp.dehaSphuta.degree, 6);
    const mrityuSaturn   = nextTransit(sp.mrityuSphuta.degree, 6);
    const mrityuMars     = nextTransit(sp.mrityuSphuta.degree, 2);
    const triSun         = nextTransit(sp.triSphuta.degree, 0);
    const bijaJupiter    = sp.bijaSphuta ? nextTransit(sp.bijaSphuta.degree, 4) : null;
    const kshetraJupiter = sp.kshetraSphuta ? nextTransit(sp.kshetraSphuta.degree, 4) : null;

    // Build unified timeline for synthesis — top upcoming events
    type TEvent = { date: Date; daysAway: number; planet: number; sphutalabel: string; isBenefic: boolean; action: string; actionHi: string };
    const timeline: TEvent[] = [];
    const addEv = (t: ReturnType<typeof nextTransit>, pid: number, sl: string, benef: boolean, act: string, actHi: string) => {
      if (!t.isActive) {
        const d = new Date(); d.setDate(d.getDate() + t.daysAway);
        timeline.push({ date: d, daysAway: t.daysAway, planet: pid, sphutalabel: sl, isBenefic: benef, action: act, actionHi: actHi });
      }
    };
    addEv(yogiJupiter, 4, 'Yogi Point', true, 'Major positive event window — start new ventures', 'शुभ घटना की खिड़की — नए कार्य आरम्भ करें');
    if (yogiPlanetTx) addEv(yogiPlanetTx, sp.yogiPoint.yogiPlanet, 'Yogi Point', true, `${PLANET_NAMES_EN[sp.yogiPoint.yogiPlanet]} activates your lucky degree`, `योगी ग्रह आपके शुभ बिंदु को सक्रिय करेगा`);
    addEv(avayogiSaturn, 6, 'Avayogi Point', false, 'Saturn stress window — avoid major decisions', 'शनि का चुनौतीपूर्ण गोचर — बड़े निर्णय टालें');
    if (avayogiPlanTx) addEv(avayogiPlanTx, sp.avayogiPoint.avayogiPlanet, 'Avayogi Point', false, 'Avayogi planet transits — exercise caution', 'अवयोगी ग्रह गोचर — सावधानी बरतें');
    addEv(pranaSun, 0, 'Prana Sphuta', true, 'Sun energises your vitality point — good for health actions', 'सूर्य आपकी जीवनशक्ति को ऊर्जित करेगा');
    addEv(mrityuSaturn, 6, 'Mrityu Sphuta', false, 'Saturn over longevity point — health checkup advised', 'शनि दीर्घायु बिंदु पर — स्वास्थ्य परीक्षण कराएं');
    addEv(mrityuMars, 2, 'Mrityu Sphuta', false, 'Mars over longevity point — avoid risky activities', 'मंगल दीर्घायु बिंदु पर — जोखिम से बचें');
    if (bijaJupiter) addEv(bijaJupiter, 4, 'Bija Sphuta', true, 'Jupiter activates male fertility point', 'बृहस्पति बीज स्फुट को सक्रिय करेगा');
    if (kshetraJupiter) addEv(kshetraJupiter, 4, 'Kshetra Sphuta', true, 'Jupiter activates female fertility point', 'बृहस्पति क्षेत्र स्फुट को सक्रिय करेगा');
    timeline.sort((a, b) => a.daysAway - b.daysAway);

    return { yogiJupiter, yogiPlanetTx, avayogiSaturn, avayogiPlanTx, pranaSun, pranaJupiter, dehaMoon, dehaSaturn, mrityuSaturn, mrityuMars, triSun, bijaJupiter, kshetraJupiter, timeline: timeline.slice(0, 7) };
  }, [kundali]);

  const handleGenerate = async (birthData: BirthData, style: ChartStyle) => {
    setLoading(true);
    setChartStyle(style);
    setSelectedHouse(null);
    setSelectedPlanet(null);
    try {
      const res = await authedFetch('/api/kundali', {
        method: 'POST',
        body: JSON.stringify(birthData),
      });
      const data = await res.json();
      if (!res.ok || data.error || !data.planets) {
        console.error('Kundali API error:', data.error || `HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      setKundali(data);
      try {
        sessionStorage.setItem('kundali_last_result', JSON.stringify({ kundali: data, chartStyle: style, sig: `${birthData.lat}|${birthData.lng}|${birthData.date}|${birthData.time}|${birthData.timezone}` }));
      } catch { /* quota exceeded or private browsing */ }
      trackKundaliGenerated({ location: birthData.place || 'unknown', hasBirthTime: !!birthData.time });
      // Persist Moon nakshatra & rashi for Chandrabalam/Tarabalam on panchang page
      if (data.planets) {
        const moon = data.planets.find((p: { planet: { id: number }; sign: number; nakshatra: { id: number } }) => p.planet.id === 1);
        if (moon) {
          // nakshatra is an object { id, name, ... } — extract the numeric id
          const nakId = typeof moon.nakshatra === 'number' ? moon.nakshatra : moon.nakshatra?.id || 0;
          useBirthDataStore.getState().setBirthData(nakId, moon.sign, birthData.name || '');
        }
      }
    } catch (e) {
      console.error('Kundali generation failed:', e);
    }
    setLoading(false);
  };

  const handleSelectHouse = (house: number) => {
    setSelectedHouse(prev => prev === house ? null : house);
    setSelectedPlanet(null);
  };

  const handleSelectPlanet = (planetId: number) => {
    setSelectedPlanet(prev => prev === planetId ? null : planetId);
    if (kundali) {
      const p = kundali.planets.find(pl => pl.planet.id === planetId);
      if (p) setSelectedHouse(p.house);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg">{t('subtitle')}</p>
      </motion.div>

      {(!kundali || editing) && (
        <BirthForm
          onSubmit={(data, style) => {
            setEditing(false);
            handleGenerate(data, style);
          }}
          loading={loading}
          initialData={editing && kundali ? {
            name: kundali.birthData.name,
            date: kundali.birthData.date,
            time: kundali.birthData.time,
            place: kundali.birthData.place,
            lat: kundali.birthData.lat,
            lng: kundali.birthData.lng,
            timezone: kundali.birthData.timezone,
          } : undefined}
        />
      )}

      {kundali && !editing && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-16">
          <GoldDivider />

          {/* Birth details header */}
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 mb-8 text-center">
            <h2 className="text-gold-light text-2xl font-semibold mb-2" style={headingFont}>
              {kundali.birthData.name || (locale === 'en' || isTamil ? 'Birth Chart' : 'जन्म कुण्डली')}
            </h2>
            <p className="text-text-secondary text-sm">
              {kundali.birthData.date} | {kundali.birthData.time} | {kundali.birthData.place}
            </p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <RashiIconById id={kundali.ascendant.sign} size={28} />
              <span className="text-gold-primary text-base font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                {locale === 'en' || isTamil ? 'Lagna (Ascendant)' : 'लग्न'}: {tl(kundali.ascendant.signName, locale)} ({kundali.ascendant.degree.toFixed(2)}°)
              </span>
            </div>
            {/* Key birth details — nakshatra, tithi, yoga, masa */}
            {(() => {
              const moonP = kundali.planets.find(p => p.planet.id === 1);
              const { calculateTithi, calculateYoga, sunLongitude: sunLon, toSidereal: toSid, getMasa, MASA_NAMES } = require('@/lib/ephem/astronomical');
              const { TITHIS } = require('@/lib/constants/tithis');
              const { YOGAS } = require('@/lib/constants/yogas');
              const jd = kundali.julianDay;
              const tR = calculateTithi(jd);
              const tD = TITHIS[tR.number - 1];
              const yN = calculateYoga(jd);
              const yD = YOGAS[yN - 1];
              const sS = toSid(sunLon(jd), jd);
              const mI = getMasa(sS);
              const mD = MASA_NAMES[mI];
              return (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-xs">
                  <span><span className="text-text-secondary/70">{locale === 'en' || isTamil ? 'Rashi' : 'राशि'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(moonP?.signName, locale) || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{locale === 'en' || isTamil ? 'Nakshatra' : 'नक्षत्र'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(moonP?.nakshatra?.name, locale) || '—'} ({locale === 'en' || isTamil ? 'Pada' : 'पाद'} {moonP?.pada || '—'})</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{locale === 'en' || isTamil ? 'Tithi' : 'तिथि'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(tD?.name, locale) || '—'} ({tD?.paksha === 'shukla' ? (locale === 'en' || isTamil ? 'Shukla' : 'शुक्ल') : (locale === 'en' || isTamil ? 'Krishna' : 'कृष्ण')})</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{locale === 'en' || isTamil ? 'Yoga' : 'योग'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(yD?.name, locale) || '—'}</span></span>
                  <span className="text-gold-primary/15">|</span>
                  <span><span className="text-text-secondary/70">{locale === 'en' || isTamil ? 'Masa' : 'मास'}:</span> <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(mD, locale) || '—'}</span></span>
                </div>
              );
            })()}
            {/* Actions */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                {locale === 'en' || isTamil ? 'Edit Details' : locale === 'hi' ? 'विवरण सम्पादित करें' : 'विवरणं सम्पादयतु'}
              </button>
              {user && (
                <button
                  onClick={handleSaveChart}
                  disabled={saving || saved}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-300 ${
                    saved
                      ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                      : 'border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60'
                  }`}
                >
                  {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved
                    ? (locale === 'en' || isTamil ? 'Saved' : 'सहेजा गया')
                    : saving
                      ? (locale === 'en' || isTamil ? 'Saving...' : 'सहेज रहे...')
                      : (locale === 'en' || isTamil ? 'Save Chart' : 'चार्ट सहेजें')
                  }
                </button>
              )}
              <button
                onClick={() => { setKundali(null); setEditing(false); }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
              >
                {locale === 'en' || isTamil ? 'New Chart' : 'नया चार्ट'}
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                onClick={() => setActiveTab('patrika')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/40 text-gold-light bg-gold-primary/8 hover:bg-gold-primary/15 hover:border-gold-primary/70 transition-all duration-300"
              >
                <ScrollText className="w-4 h-4" />
                {locale === 'en' || isTamil ? 'Generate Patrika' : 'पत्रिका बनाएं'}
              </button>
              <button
                onClick={async () => {
                  const { exportKundaliPDF } = await import('@/lib/export/pdf-kundali');
                  const tip = generateTippanni(kundali, locale);
                  exportKundaliPDF(kundali, locale as Locale, tip);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
                aria-label="Download PDF report"
              >
                <Download className="w-4 h-4" />
                PDF Report
              </button>
              <PrintButton
                contentHtml={generateKundaliPrintHtml(kundali, locale as 'en' | 'hi' | 'sa')}
                title={`Kundali — ${kundali.birthData.name}`}
                label={locale === 'en' || isTamil ? 'Print' : 'प्रिंट'}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
              />
              <ShareableKundaliCard kundali={kundali} locale={locale as Locale} />
            </div>
          </div>

          {/* Ganda Mula Alert — visible on ALL tabs */}
          {(() => {
            const moonP = kundali.planets.find(p => p.planet.id === 1);
            // 6 Ganda Mula nakshatras: 1=Ashwini, 9=Ashlesha, 10=Magha, 18=Jyestha, 19=Moola, 27=Revati
            const moonNakId = moonP?.nakshatra?.id;
            if (!moonNakId || !GANDA_MULA_DATA[moonNakId]) return null;
            const gm = GANDA_MULA_DATA[moonNakId];
            const nakName = moonP?.nakshatra?.name?.[locale] || moonP?.nakshatra?.name?.en;
            const lk = (locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const;
            return (
              <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-red-500/5 to-amber-500/10 p-5 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-amber-400 text-xl font-bold">!</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-amber-300 font-bold text-base mb-1" style={headingFont}>
                      {lk === 'en' ? `Ganda Mula — Moon in ${nakName} (Pada ${moonP?.pada})` : `गण्ड मूल — चन्द्रमा ${nakName} (पाद ${moonP?.pada})`}
                    </h4>
                    <div className="text-amber-200/80 text-xs font-semibold mb-2">{gm.type[lk === 'en' ? 'en' : 'hi']}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <div className="rounded-lg bg-amber-500/8 p-3">
                        <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                          {lk === 'en' ? 'Who is affected' : 'किसे प्रभाव'}
                        </div>
                        <p className="text-text-secondary/80 text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {gm.affected[lk === 'en' ? 'en' : 'hi']}
                        </p>
                      </div>
                      <div className="rounded-lg bg-amber-500/8 p-3">
                        <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                          {lk === 'en' ? 'Shanti procedure' : 'शान्ति विधि'}
                        </div>
                        <p className="text-text-secondary/80 text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {gm.procedure[lk === 'en' ? 'en' : 'hi']}
                        </p>
                      </div>
                    </div>
                    <p className="text-text-secondary/70 text-xs mt-3" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {lk === 'en'
                        ? 'Annual shanti: perform Ganda Mula Puja on your birth nakshatra day each year. Shanti timing: when the Moon transits your birth nakshatra.'
                        : 'वार्षिक शान्ति: प्रत्येक वर्ष अपने जन्म नक्षत्र के दिन गण्ड मूल पूजा करें। शान्ति काल: जब चन्द्रमा आपके जन्म नक्षत्र से गुजरे।'}
                    </p>
                    <Link href="/learn/modules/24-1" className="inline-block mt-2 text-xs text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2" tabIndex={-1}>
                      {lk === 'en' ? 'Learn about Ganda Mula Nakshatras →' : 'गण्ड मूल नक्षत्रों के बारे में जानें →'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Tab navigation — horizontal scroll strip */}
          <div className="relative mb-8">
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-1.5 sm:gap-2 min-w-max sm:flex-wrap sm:justify-center sm:min-w-0">
                {([
                  { key: 'chart' as const, label: t('birthChart') },
                  { key: 'planets' as const, label: t('planetPositions') },
                  { key: 'dasha' as const, label: t('dashaTimeline') },
                  { key: 'ashtakavarga' as const, label: t('ashtakavarga') },
                  { key: 'tippanni' as const, label: t('tippanni') },
                  { key: 'varga' as const, label: locale === 'en' || isTamil ? 'Varga Analysis' : 'वर्ग विश्लेषण' },
                  { key: 'chat' as const, label: locale === 'en' || isTamil ? 'Chat' : 'चैट' },
                  { key: 'graha' as const, label: locale === 'en' || isTamil ? 'Graha' : 'ग्रह' },
                  { key: 'yogas' as const, label: locale === 'en' || isTamil ? 'Yogas' : 'योग' },
                  { key: 'avasthas' as const, label: locale === 'en' || isTamil ? 'Avasthas' : 'अवस्था' },
                  { key: 'argala' as const, label: locale === 'en' || isTamil ? 'Argala' : 'अर्गला' },
                  { key: 'sphutas' as const, label: locale === 'en' || isTamil ? 'Sphutas' : 'स्फुट' },
                  { key: 'shadbala' as const, label: locale === 'en' || isTamil ? 'Shadbala' : 'षड्बल' },
                  { key: 'bhavabala' as const, label: locale === 'en' || isTamil ? 'Bhavabala' : 'भावबल' },
                  { key: 'sadesati' as const, label: locale === 'en' || isTamil ? 'Sade Sati' : 'साढ़े साती' },
                  { key: 'jaimini' as const, label: locale === 'en' || isTamil ? 'Jaimini' : 'जैमिनी' },
                  { key: 'timeline' as const, label: locale === 'en' || isTamil ? 'Life Timeline' : 'जीवन-रेखा' },
                  { key: 'patrika' as const, label: locale === 'en' || isTamil ? 'Patrika' : 'पत्रिका' },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setSelectedHouse(null); setSelectedPlanet(null); trackTabViewed({ tab: tab.key }); }}
                    className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border border-gold-primary/40 shadow-lg shadow-gold-primary/5'
                        : 'text-text-secondary/70 hover:text-gold-light bg-bg-secondary/30 border border-gold-primary/8 hover:border-gold-primary/25 hover:bg-[#1a1040]/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ===== CHART TAB ===== */}
          {activeTab === 'chart' && (
            <div>
              <a href={`/${locale}/learn/birth-chart`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">
                {locale === 'en' || isTamil ? 'Learn about Birth Charts \u2192' : 'जन्म कुण्डली के बारे में जानें \u2192'}
              </a>
              {/* Chart type selector — all Parashara vargas */}
              <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mb-4">
              <div className="flex sm:flex-wrap sm:justify-center gap-1.5 min-w-max sm:min-w-0">
                {([
                  { key: 'D1', label: locale === 'en' || isTamil ? 'D1 Rashi' : locale === 'hi' ? 'D1 राशि' : 'D1 राशिः' },
                  { key: 'bhav_chalit', label: locale === 'en' || isTamil ? 'Bhav Chalit' : 'भाव चलित' },
                  { key: 'D9', label: locale === 'en' || isTamil ? 'D9 Navamsha' : locale === 'hi' ? 'D9 नवांश' : 'D9 नवांशः' },
                  ...(kundali.divisionalCharts ? Object.entries(kundali.divisionalCharts).map(([key, dc]) => ({
                    key,
                    label: dc.label[locale as Locale] || dc.label.en || key,
                  })) : []),
                ]).map(c => (
                  <button key={c.key} onClick={() => setActiveChart(c.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeChart === c.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
              </div>

              {/* Chart meaning description */}
              {activeChart !== 'D1' && activeChart !== 'bhav_chalit' && activeChart !== 'D9' && kundali.divisionalCharts?.[activeChart] && (
                <div className="text-center mb-4 p-2 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                  <span className="text-gold-light text-xs font-bold">{kundali.divisionalCharts[activeChart].label[locale as Locale]}</span>
                  <span className="text-text-secondary text-xs"> — </span>
                  <span className="text-text-secondary text-xs">{(kundali.divisionalCharts[activeChart] as DivisionalChart & { meaning?: { en: string; hi: string } }).meaning?.[locale === 'hi' ? 'hi' : 'en'] || ''}</span>
                </div>
              )}
              {activeChart === 'D9' && (
                <div className="text-center mb-4 p-2 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                  <span className="text-gold-light text-xs font-bold">{t('navamsha')}</span>
                  <span className="text-text-secondary text-xs"> — </span>
                  <span className="text-text-secondary text-xs">{locale === 'en' || isTamil ? 'Marriage, dharma & inner self — the most important divisional chart' : 'विवाह, धर्म एवं आंतरिक स्वरूप — सर्वाधिक महत्वपूर्ण वर्ग चार्ट'}</span>
                </div>
              )}
              {activeChart === 'bhav_chalit' && (
                <div className="text-center mb-4 p-2 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                  <span className="text-gold-light text-xs font-bold">{t('bhavChalit')}</span>
                  <span className="text-text-secondary text-xs"> — </span>
                  <span className="text-text-secondary text-xs">{locale === 'en' || isTamil ? 'Mid-cusp house system — planets may shift houses compared to D1' : 'मध्य-शिखर भाव पद्धति — D1 की तुलना में ग्रह भाव बदल सकते हैं'}</span>
                </div>
              )}

              {/* Style toggle */}
              <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => setChartStyle('north')} className={`px-5 py-2 rounded-lg text-sm transition-all ${chartStyle === 'north' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary'}`}>
                  {t('north')}
                </button>
                <button onClick={() => setChartStyle('south')} className={`px-5 py-2 rounded-lg text-sm transition-all ${chartStyle === 'south' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary'}`}>
                  {t('south')}
                </button>
              </div>

              <InfoBlock
                id="kundali-chart"
                title={locale === 'en' || isTamil ? 'What is a Birth Chart (Kundali)?' : 'जन्म कुण्डली क्या है?'}
                defaultOpen={true}
              >
                {locale === 'en' || isTamil
                  ? 'A birth chart is a map of the sky at the exact moment you were born. It shows where all 9 planets were positioned across 12 zodiac signs and 12 houses (life areas). This map reveals your personality, career path, relationships, health patterns, and life timing — think of it as your cosmic DNA. The diamond shape is the traditional North Indian format. Each triangle is one \'house.\' Planet abbreviations: Su=Sun, Mo=Moon, Ma=Mars, Me=Mercury, Ju=Jupiter, Ve=Venus, Sa=Saturn, Ra=Rahu, Ke=Ketu.'
                  : 'जन्म कुण्डली आपके जन्म के सटीक क्षण में आकाश का नक्शा है। यह दर्शाती है कि 9 ग्रह 12 राशियों और 12 भावों (जीवन क्षेत्रों) में कहाँ थे। यह आपके व्यक्तित्व, कैरियर, सम्बन्ध, स्वास्थ्य और जीवन समय को प्रकट करती है। हीरे का आकार पारम्परिक उत्तर भारतीय प्रारूप है। प्रत्येक त्रिभुज एक \'भाव\' है।'}
              </InfoBlock>

              <div className="flex justify-center gap-3 mb-4 flex-wrap">
                <button onClick={() => setShowTransits(!showTransits)}
                  className={`px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${showTransits ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'}`}>
                  <span className={`w-2 h-2 rounded-full ${showTransits ? 'bg-emerald-400' : 'bg-text-secondary/30'}`} />
                  {locale === 'en' || isTamil ? 'Show Current Transits' : 'वर्तमान गोचर दिखाएं'}
                </button>
              </div>
              {showTransits && (
                <div className="mb-4">
                  <div className="text-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 mb-3">
                    <div className="text-emerald-400 text-xs font-medium mb-1">{locale === 'en' || isTamil ? 'Current Transit Positions' : 'वर्तमान गोचर स्थितियाँ'}</div>
                    <div className="text-text-tertiary text-xs" suppressHydrationWarning>{locale === 'en' || isTamil ? `As of ${new Date().toLocaleDateString()}` : `${new Date().toLocaleDateString('hi-IN')}`}</div>
                  </div>
                  {transitData && (
                    <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 mb-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                        {transitData.planets?.map((p: { id: number; name: { en: string; hi: string; sa: string }; rashi: number; longitude: number; isRetrograde: boolean }, i: number) => {
                          const rashiName = RASHIS[p.rashi - 1]?.name[locale as Locale] || '';
                          const natalPlanet = kundali.planets.find(np => np.planet.id === p.id);
                          const isSameSign = natalPlanet && natalPlanet.sign === p.rashi;
                          return (
                            <div key={i} className={`text-center p-2 rounded-lg ${isSameSign ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-bg-secondary/50'}`}>
                              <div className="text-gold-light text-xs font-bold">{p.name[locale as Locale]}</div>
                              <div className="text-emerald-400 text-xs font-medium mt-0.5">{rashiName}</div>
                              {p.isRetrograde && <div className="text-red-400 text-xs">℞</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <p className="text-text-secondary/70 text-xs text-center mb-6">
                {locale === 'en' || isTamil ? 'Click on any house to see details' : 'विवरण देखने के लिए किसी भाव पर क्लिक करें'}
              </p>

              {/* Chart display */}
              {(() => {
                const chartData = activeChart === 'D1' ? kundali.chart
                  : activeChart === 'D9' ? kundali.navamshaChart
                  : activeChart === 'bhav_chalit' ? (kundali.bhavChalitChart || kundali.chart)
                  : kundali.divisionalCharts?.[activeChart]
                    ? kundali.divisionalCharts[activeChart]
                    : kundali.chart;

                const chartTitle = activeChart === 'D1' ? t('birthChart')
                  : activeChart === 'D9' ? t('navamsha')
                  : activeChart === 'bhav_chalit' ? t('bhavChalit')
                  : tl(kundali.divisionalCharts?.[activeChart]?.label, locale) || activeChart;

                // Show selected chart + D1 side by side (unless D1 is already selected)
                const showD1Companion = activeChart !== 'D1';

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
                    {chartStyle === 'north' ? (
                      <>
                        {showD1Companion && <ChartNorth data={kundali.chart} title={t('birthChart')} size={500} selectedHouse={selectedHouse} onSelectHouse={handleSelectHouse} retrogradeIds={retrogradeIds} combustIds={combustIds} transitData={transitChartData} />}
                        <ChartNorth data={chartData} title={chartTitle} size={500} selectedHouse={showD1Companion ? null : selectedHouse} onSelectHouse={showD1Companion ? undefined : handleSelectHouse} transitData={!showD1Companion ? transitChartData : undefined} />
                        {!showD1Companion && <ChartNorth data={kundali.navamshaChart} title={t('navamsha')} size={500} selectedHouse={null} />}
                      </>
                    ) : (
                      <>
                        {showD1Companion && <ChartSouth data={kundali.chart} title={t('birthChart')} size={500} selectedHouse={selectedHouse} onSelectHouse={handleSelectHouse} retrogradeIds={retrogradeIds} combustIds={combustIds} transitData={transitChartData} />}
                        <ChartSouth data={chartData} title={chartTitle} size={500} selectedHouse={showD1Companion ? null : selectedHouse} onSelectHouse={showD1Companion ? undefined : handleSelectHouse} transitData={!showD1Companion ? transitChartData : undefined} />
                        {!showD1Companion && <ChartSouth data={kundali.navamshaChart} title={t('navamsha')} size={500} selectedHouse={null} />}
                      </>
                    )}
                  </div>
                );
              })()}

              {/* ── Inline Chart Commentary ── */}
              {(() => {
                const vargaData = generateVargaTippanni(kundali, locale as Locale);
                const chartInsight = vargaData.vargaInsights.find(v =>
                  v.chart === activeChart || (activeChart === 'bhav_chalit' && v.chart === 'BC')
                );
                if (!chartInsight) return null;
                const isHi = locale === 'hi';
                const sC: Record<string, string> = { strong: 'border-emerald-500/20', moderate: 'border-amber-500/20', weak: 'border-red-500/20' };
                const sL: Record<string, string> = { strong: isHi ? 'बलवान' : 'Strong', moderate: isHi ? 'मध्यम' : 'Moderate', weak: isHi ? 'दुर्बल' : 'Weak' };
                const sClr: Record<string, string> = { strong: 'text-emerald-400', moderate: 'text-amber-400', weak: 'text-red-400' };
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={activeChart}
                    className={`mt-8 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border ${sC[chartInsight.strength]}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-gold-light font-bold text-sm" style={headingFont}>
                        {chartInsight.chart} — {isHi ? chartInsight.meaning.hi : chartInsight.meaning.en}
                      </h4>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${sC[chartInsight.strength]} ${sClr[chartInsight.strength]}`}>
                        {sL[chartInsight.strength]}
                      </span>
                    </div>

                    {/* Overall Commentary */}
                    <div className="text-text-secondary text-xs leading-relaxed mb-3 whitespace-pre-line">
                      {isHi ? chartInsight.overallCommentary.hi : chartInsight.overallCommentary.en}
                    </div>

                    {/* Key Findings */}
                    {chartInsight.keyFindings.length > 0 && (
                      <div className="mb-3">
                        <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-1.5">
                          {isHi ? 'प्रमुख निष्कर्ष' : 'Key Findings'}
                        </div>
                        <div className="space-y-1">
                          {chartInsight.keyFindings.map((f, j) => (
                            <div key={j} className="text-text-secondary text-xs leading-relaxed flex gap-2">
                              <span className="text-gold-dark mt-0.5 shrink-0">•</span>
                              <span>{isHi ? f.hi : f.en}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prognosis */}
                    <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                      <div className="text-indigo-400 text-xs uppercase tracking-widest font-bold mb-1">
                        {isHi ? '1-2 वर्ष की प्रगति' : '1-2 Year Prognosis'}
                      </div>
                      <div className="text-text-secondary text-xs leading-relaxed">
                        {isHi ? chartInsight.prognosis.hi : chartInsight.prognosis.en}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Planet legend below charts */}
              <div className="mt-8 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
                <h4 className="text-gold-dark text-xs uppercase tracking-wider mb-4 text-center">{locale === 'en' || isTamil ? 'Planets in Chart' : 'कुण्डली में ग्रह'}</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {kundali.planets.map((p) => (
                    <motion.button
                      key={p.planet.id}
                      onClick={() => handleSelectPlanet(p.planet.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border ${
                        selectedPlanet === p.planet.id
                          ? 'border-gold-primary/50 bg-gold-primary/10'
                          : 'border-gold-primary/10 hover:border-gold-primary/25 bg-bg-primary/40'
                      }`}
                    >
                      <GrahaIconById id={p.planet.id} size={28} />
                      <div className="text-left">
                        <div className="text-sm font-bold" style={{ color: p.planet.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}>
                          {tl(p.planet.name, locale)}
                        </div>
                        <div className="text-text-secondary text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {tl(p.signName, locale)} &middot; H{p.house}
                          {p.isRetrograde ? ' (R)' : ''}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Selected house detail panel */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {selectedHouse && (
                    <HouseDetailPanel
                      key={selectedHouse}
                      houseNum={selectedHouse}
                      kundali={kundali}
                      locale={locale}
                      isDevanagari={isDevanagari}
                      onClose={() => { setSelectedHouse(null); setSelectedPlanet(null); }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* JYOTISH-16: Transit Activation of Natal Promise */}
              {(() => {
                const lk = (locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const;
                // Current Mahadasha lord
                const currentMaha = kundali.dashas.find(d => {
                  const now = new Date();
                  return d.level === 'maha' && new Date(d.startDate) <= now && new Date(d.endDate) >= now;
                });
                if (!currentMaha || !transitData) return null;

                const mahaLordId = ['Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury','Ketu','Venus']
                  .indexOf(typeof currentMaha.planet === 'string' ? currentMaha.planet : (currentMaha.planet as { en: string }).en);
                const mahaHouse = kundali.planets.find(p => p.planet.id === mahaLordId)?.house ?? 0;
                const mahaOwnedHouses = kundali.houses
                  .filter(h => {
                    const lordSign = h.sign;
                    const SIGN_LORD_MAP: Record<number,number> = {1:2,2:5,3:3,4:1,5:0,6:3,7:5,8:2,9:4,10:6,11:6,12:4};
                    return SIGN_LORD_MAP[lordSign] === mahaLordId;
                  })
                  .map(h => h.house);

                // Life area checks — 5 core domains
                const LIFE_AREAS = [
                  {
                    area: { en: 'Marriage / Partnership', hi: 'विवाह / साझेदारी' },
                    natHouse: 7, // Natal 7H lord in kendra/trikona = natal promise
                    transitPlanet: 4, // Jupiter transiting 7H = transit confirmation
                    dashaHouses: [7, 2], // Dasha activating 7H or 2H
                  },
                  {
                    area: { en: 'Career / Authority', hi: 'कैरियर / अधिकार' },
                    natHouse: 10,
                    transitPlanet: 4, // Jupiter on 10H
                    dashaHouses: [10, 1, 9],
                  },
                  {
                    area: { en: 'Children / Creativity', hi: 'संतान / रचनात्मकता' },
                    natHouse: 5,
                    transitPlanet: 4, // Jupiter on 5H
                    dashaHouses: [5, 9],
                  },
                  {
                    area: { en: 'Wealth / Gains', hi: 'धन / लाभ' },
                    natHouse: 11,
                    transitPlanet: 4, // Jupiter on 2H or 11H
                    dashaHouses: [2, 11],
                  },
                  {
                    area: { en: 'Relocation / Abroad', hi: 'स्थानान्तरण / विदेश' },
                    natHouse: 12,
                    transitPlanet: 6, // Saturn on 12H or Rahu
                    dashaHouses: [12, 9, 3],
                  },
                ];

                const results = LIFE_AREAS.map(la => {
                  // 1. Natal promise — lord of natHouse in kendra (1,4,7,10) or trikona (1,5,9)
                  const houseData = kundali.houses.find(h => h.house === la.natHouse);
                  const lordSign = houseData?.sign ?? 0;
                  const SIGN_LORD: Record<number,number> = {1:2,2:5,3:3,4:1,5:0,6:3,7:5,8:2,9:4,10:6,11:6,12:4};
                  const lordId = SIGN_LORD[lordSign];
                  const lordPlanet = kundali.planets.find(p => p.planet.id === lordId);
                  const lordHouse = lordPlanet?.house ?? 0;
                  const kendraTrikona = new Set([1, 4, 5, 7, 9, 10]);
                  const natalPromise = kendraTrikona.has(lordHouse);

                  // 2. Dasha activation — current Mahadasha lord owns or occupies relevant house
                  const dashaConfirm = la.dashaHouses.includes(mahaHouse) ||
                    la.dashaHouses.some(h => mahaOwnedHouses.includes(h));

                  // 3. Transit — relevant planet in the target house
                  const transitPlanetData = transitData?.planets.find(p => p.id === la.transitPlanet);
                  const transitSign = transitPlanetData?.rashi ?? 0;
                  // House of transit planet = which house (from lagna) that sign occupies
                  const lagnaSign = kundali.ascendant.sign;
                  const transitHouseFromLagna = transitSign > 0 ? ((transitSign - lagnaSign + 12) % 12) + 1 : 0;
                  const transitConfirm = la.dashaHouses.includes(transitHouseFromLagna);

                  const confirmCount = [natalPromise, dashaConfirm, transitConfirm].filter(Boolean).length;

                  return { ...la, natalPromise, dashaConfirm, transitConfirm, confirmCount, lordPlanet, lordHouse };
                }).sort((a, b) => b.confirmCount - a.confirmCount);

                const highProbability = results.filter(r => r.confirmCount >= 3);
                const moderate = results.filter(r => r.confirmCount === 2);
                const showing = [...highProbability, ...moderate].slice(0, 5);

                return (
                  <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 p-5">
                    <h3 className="text-gold-gradient text-lg font-bold mb-1 text-center" style={headingFont}>
                      {lk === 'en' ? 'Transit Activation of Natal Promise' : 'गोचर द्वारा जन्म वादे की सक्रियता'}
                    </h3>
                    <p className="text-text-secondary/70 text-xs text-center mb-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {lk === 'en'
                        ? `Current Mahadasha: ${typeof currentMaha.planet === 'string' ? currentMaha.planet : (currentMaha.planet as { en: string }).en} — events manifest when Natal Promise + Dasha + Transit align. Source: Nadi tradition, BPHS transit chapters.`
                        : `वर्तमान महादशा — नटाल वादा + दशा + गोचर एकसाथ होने पर घटनाएँ घटित होती हैं।`}
                    </p>
                    <div className="space-y-3">
                      {showing.map((r, i) => (
                        <div key={i} className={`rounded-xl p-3 border ${r.confirmCount >= 3 ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10 bg-bg-primary/20'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gold-light font-semibold text-sm" style={headingFont}>{r.area[lk === 'en' ? 'en' : 'hi']}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.confirmCount >= 3 ? 'bg-gold-primary/20 text-gold-light' : 'bg-amber-500/15 text-amber-400'}`}>
                              {r.confirmCount}/3 {lk === 'en' ? 'confirmed' : 'पुष्ट'}
                            </span>
                          </div>
                          <div className="flex gap-3 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded ${r.natalPromise ? 'text-emerald-400 bg-emerald-500/10' : 'text-text-secondary/55 bg-bg-primary/20'}`}>
                              {lk === 'en' ? 'Natal Promise' : 'जन्म वादा'} {r.natalPromise ? '✓' : '✗'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${r.dashaConfirm ? 'text-emerald-400 bg-emerald-500/10' : 'text-text-secondary/55 bg-bg-primary/20'}`}>
                              {lk === 'en' ? `Dasha (${typeof currentMaha.planet === 'string' ? currentMaha.planet : (currentMaha.planet as { en: string }).en})` : 'दशा'} {r.dashaConfirm ? '✓' : '✗'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${r.transitConfirm ? 'text-emerald-400 bg-emerald-500/10' : 'text-text-secondary/55 bg-bg-primary/20'}`}>
                              {lk === 'en' ? 'Transit' : 'गोचर'} {r.transitConfirm ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {showing.length === 0 && (
                        <p className="text-text-secondary/70 text-xs text-center py-4">
                          {lk === 'en' ? 'No life areas currently show triple alignment. Enable transit overlay for real-time data.' : 'कोई क्षेत्र तीनों शर्तें पूरी नहीं करता। गोचर ओवरले सक्षम करें।'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ===== PLANETS TAB ===== */}
          {activeTab === 'planets' && (
            <div className="space-y-3">
              <a href={`/${locale}/learn/planets`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Planets \u2192' : 'ग्रहों के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-planets"
                title={locale === 'en' || isTamil ? 'What do Planet Positions mean?' : 'ग्रह स्थितियों का क्या अर्थ है?'}
                defaultOpen={false}
              >
                {locale === 'en' || isTamil
                  ? 'Each planet represents a force in your life: Sun=ego/authority/father, Moon=mind/emotions/mother, Mars=energy/courage/property, Mercury=communication/business/intellect, Jupiter=wisdom/children/wealth, Venus=love/marriage/luxury, Saturn=discipline/karma/hard work, Rahu=ambition/foreign/technology, Ketu=spirituality/detachment/liberation. The SIGN a planet is in colors its expression. The HOUSE it occupies determines which life area it affects. Retrograde (R) planets work inwardly — their effects are felt more internally.'
                  : 'प्रत्येक ग्रह आपके जीवन में एक शक्ति का प्रतिनिधित्व करता है: सूर्य=अहंकार/अधिकार/पिता, चंद्र=मन/भावनाएं/माता, मंगल=ऊर्जा/साहस/संपत्ति, बुध=संचार/व्यापार/बुद्धि, गुरु=ज्ञान/संतान/धन, शुक्र=प्रेम/विवाह/विलास, शनि=अनुशासन/कर्म/परिश्रम, राहु=महत्वाकांक्षा/विदेश/तकनीक, केतु=आध्यात्म/वैराग्य/मोक्ष। ग्रह जिस राशि में हो वह उसकी अभिव्यक्ति रंगती है। जिस भाव में हो वह जीवन क्षेत्र प्रभावित होता है। वक्री (R) ग्रह अंतर्मुखी होकर कार्य करते हैं।'}
              </InfoBlock>
              {/* Badge Legend */}
              <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border border-gold-primary/10 p-4">
                <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2.5">
                  {locale === 'en' || isTamil ? 'Badge Guide' : 'बैज मार्गदर्शिका'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-bold px-1.5 py-0.5 bg-red-500/10 rounded shrink-0">R</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Retrograde — planet appears to move backward; its energy turns inward, causing delays but deeper insight' : 'वक्री — ग्रह पीछे चलता दिखता है; ऊर्जा अंतर्मुखी, विलम्ब पर गहन अंतर्दृष्टि'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded shrink-0">{locale === 'en' || isTamil ? 'Exalted' : 'उच्च'}</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Planet at peak strength — delivers its best results with full confidence' : 'ग्रह चरम शक्ति पर — पूर्ण आत्मविश्वास से सर्वोत्तम फल'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400 font-bold px-1.5 py-0.5 bg-orange-500/10 rounded shrink-0">{locale === 'en' || isTamil ? 'Debilitated' : 'नीच'}</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Planet at weakest expression — struggles to deliver, needs remedial support' : 'ग्रह सबसे कमज़ोर — फल देने में संघर्ष, उपचार आवश्यक'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold px-1.5 py-0.5 bg-blue-500/10 rounded shrink-0">{locale === 'en' || isTamil ? 'Own Sign' : 'स्वगृह'}</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Planet in its own sign — comfortable and reliable, like being at home' : 'ग्रह अपनी राशि में — सहज और विश्वसनीय, अपने घर जैसा'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold-light font-bold px-1.5 py-0.5 bg-gold-primary/15 rounded border border-gold-primary/30 shrink-0">Vgm</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Vargottama — same sign in birth chart & navamsha; exceptionally strong and reliable' : 'वर्गोत्तम — D1 और D9 में समान राशि; अत्यंत बलवान और विश्वसनीय'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold px-1.5 py-0.5 bg-rose-500/10 rounded shrink-0">MB</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Mrityu Bhaga — planet at a vulnerable degree; health and that planet\'s themes need extra care' : 'मृत्यु भाग — संवेदनशील अंश; स्वास्थ्य और उस ग्रह के विषयों पर ध्यान दें'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sky-300 font-bold px-1.5 py-0.5 bg-sky-500/10 rounded border border-sky-400/20 shrink-0">Pushkar Nav.</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Pushkar Navamsha — planet in a supremely auspicious navamsha; greatly amplifies positive results' : 'पुष्कर नवांश — अत्यंत शुभ नवांश; सकारात्मक फलों में भारी वृद्धि'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-300 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-400/20 shrink-0">Pushkar Bh.</span>
                    <span className="text-text-secondary">{locale === 'en' || isTamil ? 'Pushkar Bhaga — most auspicious degree in the sign; greatly strengthens this planet' : 'पुष्कर भाग — राशि में सर्वाधिक शुभ अंश; ग्रह को अत्यंत बल'}</span>
                  </div>
                </div>
              </div>
              {kundali.planets.map((p) => (
                <motion.div
                  key={p.planet.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: p.planet.id * 0.04 }}
                  onClick={() => handleSelectPlanet(p.planet.id)}
                  className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 cursor-pointer transition-all border ${
                    selectedPlanet === p.planet.id
                      ? 'border-gold-primary/40 bg-gold-primary/5'
                      : 'border-transparent hover:border-gold-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <GrahaIconById id={p.planet.id} size={44} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold" style={{ color: p.planet.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>
                          {tl(p.planet.name, locale)}
                        </span>
                        {p.isRetrograde && <span className="text-red-400 text-xs font-bold px-1.5 py-0.5 bg-red-500/10 rounded">R</span>}
                        {p.isExalted && <span className="text-emerald-400 text-xs font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded">{locale === 'en' || isTamil ? 'Exalted' : 'उच्च'}</span>}
                        {p.isDebilitated && <span className="text-orange-400 text-xs font-bold px-1.5 py-0.5 bg-orange-500/10 rounded">{locale === 'en' || isTamil ? 'Debilitated' : 'नीच'}</span>}
                        {p.isOwnSign && <span className="text-blue-400 text-xs font-bold px-1.5 py-0.5 bg-blue-500/10 rounded">{locale === 'en' || isTamil ? 'Own Sign' : 'स्वगृह'}</span>}
                        {p.isVargottama && <span className="text-gold-light text-xs font-bold px-1.5 py-0.5 bg-gold-primary/15 rounded border border-gold-primary/30" title={locale === 'en' || isTamil ? 'Same sign in D1 & D9 — strength equal to double exaltation' : 'वर्गोत्तम — D1 और D9 में एक ही राशि'}>Vgm</span>}
                        {p.isMrityuBhaga && <span className="text-rose-400 text-xs font-bold px-1.5 py-0.5 bg-rose-500/10 rounded" title={locale === 'en' || isTamil ? 'At or near Mrityu Bhaga — dangerous degree, severely weakened' : 'मृत्यु भाग — खतरनाक अंश, बल में गिरावट'}>MB</span>}
                        {p.isPushkarNavamsha && <span className="text-sky-300 text-xs font-bold px-1.5 py-0.5 bg-sky-500/10 rounded border border-sky-400/20" title={locale === 'en' || isTamil ? 'Pushkar Navamsha — supremely auspicious navamsha position' : 'पुष्कर नवांश — अत्यंत शुभ नवांश स्थिति'}>Pushkar Nav.</span>}
            {p.isPushkarBhaga && <span className="text-emerald-300 text-xs font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-400/20" title={locale === 'en' || isTamil ? 'Pushkar Bhaga — most auspicious degree in the sign. Greatly strengthens this planet.' : 'पुष्कर भाग — राशि में सर्वाधिक शुभ अंश। ग्रह को अत्यंत बल मिलता है।'}>Pushkar Bh.</span>}
                      </div>
                      <div className="text-text-secondary text-sm mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5">
                        <span>
                          <span className="text-gold-dark">{locale === 'en' || isTamil ? 'Sign:' : 'राशि:'}</span>{' '}
                          <span style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(p.signName, locale)}</span>
                        </span>
                        <span>
                          <span className="text-gold-dark">{locale === 'en' || isTamil ? 'House:' : 'भाव:'}</span> {p.house}
                          <span className="text-text-secondary/60 text-xs ml-1">({getHouseSignifications(p.house, locale).split(',').slice(0, 2).join(',')})</span>
                        </span>
                        <span>
                          <span className="text-gold-dark">{locale === 'en' || isTamil ? 'Degree:' : 'अंश:'}</span>{' '}
                          <span className="font-mono">{p.degree}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-text-secondary text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {tl(p.nakshatra.name, locale)}
                      </div>
                      <div className="text-gold-dark/60 text-xs">
                        {locale === 'en' || isTamil ? 'Pada' : 'पाद'} {p.pada}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedPlanet === p.planet.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gold-primary/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gold-dark text-xs">{locale === 'en' || isTamil ? 'Nakshatra' : 'नक्षत्र'}</span>
                            <p className="text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                              {tl(p.nakshatra.name, locale)} (P{p.pada})
                            </p>
                          </div>
                          <div>
                            <span className="text-gold-dark text-xs">{locale === 'en' || isTamil ? 'Longitude' : 'अंश'}</span>
                            <p className="text-text-secondary font-mono">{p.longitude.toFixed(4)}°</p>
                          </div>
                          <div>
                            <span className="text-gold-dark text-xs">{locale === 'en' || isTamil ? 'Speed' : 'गति'}</span>
                            <p className="text-text-secondary font-mono">{p.speed.toFixed(4)}°/d</p>
                          </div>
                          <div>
                            <span className="text-gold-dark text-xs">{locale === 'en' || isTamil ? 'Latitude' : 'अक्षांश'}</span>
                            <p className="text-text-secondary font-mono">{p.latitude.toFixed(4)}°</p>
                          </div>
                        </div>
                        {/* Commentary from tippanni */}
                        {tip && (() => {
                          const insight = tip.planetInsights.find(pi => pi.planetId === p.planet.id);
                          if (!insight) return null;
                          return (
                            <div className="mt-4 space-y-3">
                              <p className="text-text-secondary text-sm leading-relaxed">{insight.description}</p>
                              {insight.dignity && (
                                <div className="p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                                  <p className="text-gold-dark text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Dignity' : 'गरिमा'}</p>
                                  <p className="text-text-secondary text-sm">{insight.dignity}</p>
                                </div>
                              )}
                              {insight.retrogradeEffect && (
                                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                  <p className="text-red-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Retrograde Effect' : 'वक्री प्रभाव'}</p>
                                  <p className="text-text-secondary text-sm">{insight.retrogradeEffect}</p>
                                </div>
                              )}
                              {insight.implications && (
                                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                  <p className="text-blue-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Life Impact' : 'जीवन प्रभाव'}</p>
                                  <p className="text-text-secondary text-sm">{insight.implications}</p>
                                </div>
                              )}
                              {insight.prognosis && (
                                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                                  <p className="text-purple-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Prognosis' : 'पूर्वानुमान'}</p>
                                  <p className="text-text-secondary text-sm">{insight.prognosis}</p>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              <PlanetsInterpretation planets={kundali.planets} ascendant={kundali.ascendant} locale={locale} />

              {/* ── Functional Nature per Lagna ── */}
              {kundali.functionalNature && (() => {
                const fn = kundali.functionalNature!;
                const COLOR: Record<string, string> = {
                  yogaKaraka:  'bg-gold-primary/25 text-gold-light border-gold-primary/30',
                  funcBenefic: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
                  neutral:     'bg-bg-secondary/60 text-text-secondary/70 border-gold-primary/8',
                  funcMalefic: 'bg-red-500/12 text-red-400 border-red-500/20',
                  maraka:      'bg-orange-500/15 text-orange-300 border-orange-500/20',
                  badhak:      'bg-purple-500/15 text-purple-300 border-purple-500/20',
                };
                return (
                  <div className="mt-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 p-5">
                    <div className="text-gold-primary/80 text-xs uppercase tracking-wider font-bold mb-1">
                      {locale === 'en' || isTamil ? 'Functional Nature per Lagna (Laghu Parashari)' : 'लग्न अनुसार क्रियात्मक स्वभाव'}
                    </div>
                    <p className="text-text-secondary/65 text-[11px] mb-1">
                      {locale === 'en' || isTamil
                        ? `For ${kundali.ascendant.signName.en} lagna — based on which houses each planet rules`
                        : `${kundali.ascendant.signName.hi} लग्न के लिए — प्रत्येक ग्रह किस भाव का स्वामी है`}
                    </p>
                    <p className="text-text-secondary/55 text-[10px] mb-4 italic">
                      {locale === 'en' || isTamil
                        ? 'Lords = houses this planet rules · In = house where it is placed in your birth chart (these are different things)'
                        : 'भावेश = ग्रह किस भाव का स्वामी है · स्थान = ग्रह किस भाव में है (ये दो अलग बातें हैं)'}
                    </p>
                    {/* Summary badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {fn.yogaKaraka !== null && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gold-primary/20 text-gold-light border border-gold-primary/30 font-bold">
                          {locale === 'en' || isTamil ? 'Yoga Karaka:' : 'योगकारक:'} {GRAHAS.find(g => g.id === fn.yogaKaraka)?.name.en || '—'}
                        </span>
                      )}
                      {fn.marakaLords.map(id => (
                        <span key={id} className="text-xs px-2 py-1 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/20 font-semibold">
                          {locale === 'en' || isTamil ? 'Maraka:' : 'मारक:'} {GRAHAS.find(g => g.id === id)?.name.en || '—'}
                        </span>
                      ))}
                      {fn.badhakLord !== null && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20 font-semibold">
                          {locale === 'en' || isTamil ? `Badhak (${fn.badhakHouse}H):` : `बाधक (${fn.badhakHouse}वाँ):`} {GRAHAS.find(g => g.id === fn.badhakLord)?.name.en || '—'}
                        </span>
                      )}
                    </div>
                    {/* Grid of all 7 planets */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {fn.planets.map(p => {
                        const placedInHouse = kundali.planets.find(pl => pl.planet.id === p.planetId)?.house;
                        return (
                          <div key={p.planetId} className={`rounded-lg border p-2.5 ${COLOR[p.nature] || COLOR.neutral}`}>
                            <div className="font-bold text-sm mb-0.5" style={headingFont}>
                              {locale === 'en' || isTamil ? p.planetName.en : p.planetName.hi}
                            </div>
                            <div className="text-[10px] font-semibold mb-1 opacity-80">
                              {p.label[locale === 'en' || isTamil ? 'en' : 'hi']}
                            </div>
                            <div className="text-[10px] opacity-60 font-mono">
                              {locale === 'en' || isTamil ? `Lords ${p.houseRulership.join(', ')}H` : `${p.houseRulership.join(', ')}वें भाव`}
                            </div>
                            {placedInHouse !== undefined && (
                              <div className="text-[10px] opacity-45 font-mono mt-0.5">
                                {locale === 'en' || isTamil ? `Placed in ${placedInHouse}H` : `${placedInHouse}वें भाव में`}
                              </div>
                            )}
                            {p.note && (
                              <div className="text-[10px] opacity-55 mt-1 leading-tight" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                {p.note[locale === 'en' || isTamil ? 'en' : 'hi']}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* ── Graha Yuddha (Planetary War) ── */}
              {kundali.grahaYuddha && kundali.grahaYuddha.length > 0 && (
                <div className="mt-4 rounded-xl bg-gradient-to-br from-red-900/20 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/30 p-5">
                  <div className="text-red-400 text-xs uppercase tracking-wider font-bold mb-3">
                    {locale === 'en' || isTamil ? '⚔ Graha Yuddha — Planetary War' : '⚔ ग्रह युद्ध'}
                  </div>
                  <div className="space-y-4">
                    {kundali.grahaYuddha.map((gy, i) => (
                      <div key={i} className="border-t border-red-500/15 pt-3 first:border-0 first:pt-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-gold-light font-bold text-sm">{gy.planet1Name[locale as 'en' | 'hi' | 'sa']}</span>
                          <span className="text-red-400 font-bold">⚔</span>
                          <span className="text-gold-light font-bold text-sm">{gy.planet2Name[locale as 'en' | 'hi' | 'sa']}</span>
                          <span className="text-text-secondary/70 text-xs font-mono">({gy.separation.toFixed(2)}°)</span>
                          <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-xs rounded-full font-bold border border-emerald-500/20">
                            {locale === 'en' || isTamil ? 'Winner:' : 'विजयी:'} {gy.winnerName[locale as 'en' | 'hi' | 'sa']}
                          </span>
                          <span className="px-2 py-0.5 bg-red-500/15 text-red-400 text-xs rounded-full font-bold border border-red-500/20">
                            {locale === 'en' || isTamil ? 'Loser:' : 'पराजित:'} {gy.loserName[locale as 'en' | 'hi' | 'sa']}
                          </span>
                        </div>
                        <p className="text-text-secondary/80 text-xs leading-relaxed">
                          {gy.interpretation[locale as 'en' | 'hi' | 'sa']}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== DASHA TAB ===== */}
          {activeTab === 'dasha' && (
            <div className="space-y-3">
              <a href={`/${locale}/learn/dashas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Dashas \u2192' : 'दशा के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-dasha"
                title={locale === 'en' || isTamil ? 'What is a Dasha? (Your Life Chapters)' : 'दशा क्या है? (आपके जीवन के अध्याय)'}
                defaultOpen={false}
              >
                {locale === 'en' || isTamil ? (
                  <div className="space-y-3">
                    <p>A <strong>Dasha</strong> is a planetary period — a specific chunk of time when one planet &quot;runs the show&quot; in your life. Think of it like chapters in a book: during a Jupiter Dasha, your life chapter is about wisdom, growth, and expansion; during a Saturn Dasha, the chapter is about hard work, discipline, and karmic lessons.</p>
                    <p><strong>How is it calculated?</strong> Vimshottari Dasha (the most widely used system) is based on your <em>Moon nakshatra at birth</em>. The system assigns each of 9 planets a fixed number of years: Ketu 7yr, Venus 20yr, Sun 6yr, Moon 10yr, Mars 7yr, Rahu 18yr, Jupiter 16yr, Saturn 19yr, Mercury 17yr — totaling 120 years. Within each Mahadasha (main period), there are sub-periods called Antardasha, and within those, Pratyantardasha — increasingly fine time slices.</p>
                    <p><strong>What this means for you:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li>Your <strong className="text-gold-light">current Mahadasha</strong> defines the main theme of this phase of your life. Check which planet you&apos;re under and read its forecast.</li>
                      <li>Your <strong className="text-gold-light">current Antardasha</strong> (sub-period) fine-tunes the energy — a beneficial Antardasha within a difficult Mahadasha can still bring relief.</li>
                      <li>Planets that are <strong className="text-emerald-400">strong in your chart</strong> give excellent results during their Dasha. Weak planets give challenging periods but also the most growth.</li>
                      <li>You cannot change your Dasha timing, but you CAN change how you respond — Dashas point to themes, not fixed outcomes.</li>
                    </ul>
                    <p className="text-text-secondary/70 text-xs"><strong>Which system to use?</strong> Start with <em>Vimshottari</em> (most tested, most widely used). Use other systems for additional confirmation once you understand the basics.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p><strong>दशा</strong> एक ग्रह काल है — एक विशिष्ट समय जब एक ग्रह आपके जीवन को चलाता है। इसे किसी किताब के अध्यायों की तरह सोचें: बृहस्पति दशा में जीवन ज्ञान और विस्तार का अध्याय है; शनि दशा में कठिन परिश्रम और कर्म पाठों का।</p>
                    <p><strong>गणना कैसे होती है?</strong> विंशोत्तरी दशा आपके जन्म चन्द्र नक्षत्र पर आधारित है। 9 ग्रहों को निश्चित वर्ष मिलते हैं — कुल 120 वर्ष। महादशा में अन्तर्दशा और प्रत्यन्तर्दशा होती हैं।</p>
                    <p><strong>आपके लिए इसका अर्थ:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li>आपकी वर्तमान <strong className="text-gold-light">महादशा</strong> इस जीवन चरण का मुख्य विषय है।</li>
                      <li>वर्तमान <strong className="text-gold-light">अन्तर्दशा</strong> ऊर्जा को सूक्ष्म बनाती है।</li>
                      <li>कुण्डली में <strong className="text-emerald-400">बलवान ग्रह</strong> अपनी दशा में उत्कृष्ट परिणाम देते हैं।</li>
                      <li>दशा का समय नहीं बदल सकते, पर अपनी प्रतिक्रिया बदल सकते हैं।</li>
                    </ul>
                  </div>
                )}
              </InfoBlock>

              {/* Dasha system selector */}
              <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                {[
                  { key: 'vimshottari', label: locale === 'en' || isTamil ? 'Vimshottari' : 'विंशोत्तरी', desc: locale === 'en' || isTamil ? '120yr cycle based on Moon nakshatra — most widely used' : 'चन्द्र नक्षत्र आधारित 120 वर्ष — सर्वाधिक प्रचलित' },
                  ...(kundali.yoginiDashas ? [{ key: 'yogini', label: locale === 'en' || isTamil ? 'Yogini' : 'योगिनी', desc: locale === 'en' || isTamil ? '36yr cycle — fast-moving, good for timing events' : '36 वर्ष — तीव्र, घटनाओं के समय हेतु' }] : []),
                  ...(kundali.ashtottariDashas ? [{ key: 'ashtottari', label: locale === 'en' || isTamil ? 'Ashtottari' : 'अष्टोत्तरी', desc: locale === 'en' || isTamil ? '108yr cycle — used when Rahu is in a kendra/trikona' : '108 वर्ष — राहु केन्द्र/त्रिकोण में हो तब' }] : []),
                  ...(kundali.narayanaDasha ? [{ key: 'narayana', label: locale === 'en' || isTamil ? 'Narayana' : 'नारायण', desc: locale === 'en' || isTamil ? 'Sign-based — shows external life events and environment' : 'राशि आधारित — बाह्य जीवन घटनाएँ' }] : []),
                  ...(kundali.kalachakraDasha ? [{ key: 'kalachakra', label: locale === 'en' || isTamil ? 'Kalachakra' : 'कालचक्र', desc: locale === 'en' || isTamil ? 'Wheel of Time — navamsha-based, complex and precise' : 'कालचक्र — नवांश आधारित, सूक्ष्म' }] : []),
                  ...(kundali.sthiraDasha ? [{ key: 'sthira', label: locale === 'en' || isTamil ? 'Sthira' : 'स्थिर', desc: locale === 'en' || isTamil ? 'Fixed sign dasha — for longevity analysis' : 'स्थिर राशि — आयु विश्लेषण हेतु' }] : []),
                  ...(kundali.shoolaDasha ? [{ key: 'shoola', label: locale === 'en' || isTamil ? 'Shoola' : 'शूल', desc: locale === 'en' || isTamil ? 'Pain/death indicator — used in medical astrology' : 'कष्ट/मृत्यु सूचक — चिकित्सा ज्योतिष' }] : []),
                  { key: 'shodasottari', label: locale === 'en' || isTamil ? 'Shodasottari' : 'षोडशोत्तरी', desc: locale === 'en' || isTamil ? '116yr — for night births in Krishna Paksha' : '116 वर्ष — कृष्ण पक्ष रात्रि जन्म हेतु' },
                  { key: 'dwadasottari', label: locale === 'en' || isTamil ? 'Dwadasottari' : 'द्वादशोत्तरी', desc: locale === 'en' || isTamil ? '112yr — for Shukla Paksha births with Venus in lagna' : '112 वर्ष — शुक्ल पक्ष, शुक्र लग्न में' },
                  { key: 'panchottari', label: locale === 'en' || isTamil ? 'Panchottari' : 'पंचोत्तरी', desc: locale === 'en' || isTamil ? '105yr — for Cancer lagna births' : '105 वर्ष — कर्क लग्न हेतु' },
                  { key: 'satabdika', label: locale === 'en' || isTamil ? 'Satabdika' : 'शताब्दिका', desc: locale === 'en' || isTamil ? '100yr — for Vargottama lagna births' : '100 वर्ष — वर्गोत्तम लग्न हेतु' },
                  { key: 'chaturaaseethi', label: locale === 'en' || isTamil ? 'Chaturaaseethi' : 'चतुराशीति', desc: locale === 'en' || isTamil ? '84yr — for day births in Shukla Paksha' : '84 वर्ष — शुक्ल पक्ष दिवस जन्म' },
                  { key: 'shashtihayani', label: locale === 'en' || isTamil ? 'Shashtihayani' : 'षष्ठीहायनी', desc: locale === 'en' || isTamil ? '60yr — Sun in lagna, alternative timing' : '60 वर्ष — सूर्य लग्न में' },
                  { key: 'mandooka', label: locale === 'en' || isTamil ? 'Mandooka' : 'मण्डूक', desc: locale === 'en' || isTamil ? 'Frog leap dasha — signs jump in sequence' : 'मण्डूक — राशियाँ कूदकर चलतीं' },
                  { key: 'drig', label: locale === 'en' || isTamil ? 'Drig' : 'दृग्', desc: locale === 'en' || isTamil ? 'Aspect-based — signs with most aspects activate' : 'दृष्टि आधारित — सर्वाधिक दृष्ट राशि' },
                  { key: 'moola', label: locale === 'en' || isTamil ? 'Moola' : 'मूल', desc: locale === 'en' || isTamil ? '121yr — based on Moola Trikona positions' : '121 वर्ष — मूल त्रिकोण आधारित' },
                  { key: 'navamsha_dasha', label: locale === 'en' || isTamil ? 'Navamsha' : 'नवांश', desc: locale === 'en' || isTamil ? 'D9 chart based — for marriage and dharma timing' : 'D9 आधारित — विवाह और धर्म समय' },
                  { key: 'naisargika', label: locale === 'en' || isTamil ? 'Naisargika' : 'नैसर्गिक', desc: locale === 'en' || isTamil ? 'Natural order — fixed planetary periods by nature' : 'प्राकृतिक क्रम — नैसर्गिक ग्रह काल' },
                  { key: 'tara', label: locale === 'en' || isTamil ? 'Tara' : 'तारा', desc: locale === 'en' || isTamil ? 'Star-based — nakshatra lord sequences' : 'तारा — नक्षत्र स्वामी क्रम' },
                  { key: 'tithi_ashtottari', label: locale === 'en' || isTamil ? 'Tithi Ashtottari' : 'तिथि अष्टोत्तरी', desc: locale === 'en' || isTamil ? '108yr — based on birth tithi lord' : '108 वर्ष — जन्म तिथि स्वामी आधारित' },
                  { key: 'yoga_vimsottari', label: locale === 'en' || isTamil ? 'Yoga Vimsottari' : 'योग विंशोत्तरी', desc: locale === 'en' || isTamil ? 'Based on birth yoga — Sun+Moon combination' : 'जन्म योग आधारित — सूर्य+चन्द्र' },
                  { key: 'buddhi_gathi', label: locale === 'en' || isTamil ? 'Buddhi Gathi' : 'बुद्धि गति', desc: locale === 'en' || isTamil ? '100yr — intellectual development timing' : '100 वर्ष — बौद्धिक विकास समय' },
                ].map(dt => (
                  <button key={dt.key} onClick={() => setDashaSystem(dt.key)} title={dt.desc}
                    className={`px-4 py-1.5 rounded-lg text-xs transition-all ${dashaSystem === dt.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-text-primary border border-transparent'}`}>
                    {dt.label}
                  </button>
                ))}
              </div>
              {/* Selected dasha description */}
              {(() => {
                const allSystems: { key: string; desc: { en: string; hi: string } }[] = [
                  { key: 'vimshottari', desc: { en: 'The most widely used dasha system (BPHS Ch.20). Based on Moon\'s nakshatra at birth, it divides life into 9 planetary periods totaling 120 years. Each planet\'s dasha activates its significations — this is your primary life timeline.', hi: 'सर्वाधिक प्रचलित दशा पद्धति (BPHS अ.20)। जन्म नक्षत्र पर आधारित, 120 वर्षों में 9 ग्रह काल। यह आपकी प्राथमिक जीवन समयरेखा है।' } },
                  { key: 'yogini', desc: { en: 'A fast 36-year cycle with 8 yogini periods (Saravali). Excellent for timing short-term events — job changes, health episodes, travel. Repeats ~3 times in a lifetime, so each period carries different weight depending on age.', hi: '8 योगिनी कालों का 36 वर्षीय चक्र (सरावली)। लघु घटनाओं — नौकरी, स्वास्थ्य, यात्रा — के समय निर्धारण में उत्कृष्ट।' } },
                  { key: 'ashtottari', desc: { en: '108-year cycle using 8 planets (excludes Ketu). Applied when Rahu is in a kendra/trikona from lagna lord. Gives a second opinion on life timing — compare with Vimshottari to find overlapping themes.', hi: '108 वर्षीय चक्र, 8 ग्रह (केतु रहित)। जब राहु लग्नेश से केन्द्र/त्रिकोण में हो तब लागू। विंशोत्तरी से तुलना करके समान विषय खोजें।' } },
                  { key: 'narayana', desc: { en: 'Sign-based dasha from Jaimini astrology (Jaimini Sutras 2.1). Shows external life events — career changes, relocations, relationship milestones — based on which sign is activated. Best for predicting visible life changes.', hi: 'जैमिनी ज्योतिष से राशि दशा (जैमिनी सूत्र 2.1)। बाह्य जीवन घटनाएँ — कैरियर, स्थानान्तरण, सम्बन्ध — कौन सी राशि सक्रिय है।' } },
                  { key: 'kalachakra', desc: { en: 'The "Time Wheel" dasha (BPHS Ch.21). Based on Moon\'s nakshatra pada, it follows a specific sign sequence (Savya or Apasavya). Considered very accurate by Parasara for timing karmic events. Complex but powerful.', hi: '"काल चक्र" दशा (BPHS अ.21)। चन्द्र नक्षत्र पद पर आधारित। कार्मिक घटनाओं के समय निर्धारण में पराशर द्वारा अत्यंत सटीक माना गया।' } },
                  { key: 'sthira', desc: { en: 'Fixed-duration sign dasha (Jaimini). Each sign runs for a fixed number of years regardless of planetary placement. Used alongside Narayana for cross-verification of life event timing.', hi: 'स्थिर अवधि राशि दशा (जैमिनी)। प्रत्येक राशि निश्चित वर्षों तक चलती है। नारायण दशा के साथ जीवन घटनाओं की पुष्टि हेतु।' } },
                  { key: 'shoola', desc: { en: '"Trident" dasha (Jaimini) — used exclusively for longevity and health crisis analysis. Each activated sign can indicate periods of acute pain or transformative endings. Cross-reference with 8th house lord and Rudra. NOT for general prediction.', hi: '"शूल" दशा (जैमिनी) — केवल दीर्घायु और स्वास्थ्य संकट विश्लेषण हेतु। सामान्य भविष्यवाणी के लिए नहीं।' } },
                  { key: 'shodasottari', desc: { en: '116-year cycle. Applied when lagna is in Krishna Paksha and birth is at night. An alternative to Vimshottari for specific birth conditions — if applicable, it may give more accurate timing than the standard system.', hi: '116 वर्षीय चक्र। कृष्ण पक्ष लग्न और रात्रि जन्म पर लागू। विशिष्ट जन्म स्थितियों के लिए विंशोत्तरी का विकल्प।' } },
                  { key: 'dwadasottari', desc: { en: '112-year cycle. Applied when lagna is in Shukla Paksha and Venus is in a kendra. Emphasizes Venus-related themes — relationships, comforts, artistic pursuits, and material prosperity.', hi: '112 वर्षीय चक्र। शुक्ल पक्ष लग्न और शुक्र केन्द्र में हो तब लागू। शुक्र विषय — सम्बन्ध, सुख, कला पर बल।' } },
                  { key: 'panchottari', desc: { en: '105-year cycle. Applied when lagna is in Dhanishtha nakshatra or Cancer sign. A rare conditional dasha — if your birth conditions match, compare its periods with Vimshottari for confirmation.', hi: '105 वर्षीय चक्र। धनिष्ठा नक्षत्र या कर्क लग्न पर लागू। दुर्लभ सशर्त दशा।' } },
                  { key: 'satabdika', desc: { en: '100-year cycle. Applied when lagna is in Vargottama (same sign in D1 and D9). Emphasizes the soul\'s deeper evolutionary journey — spiritual milestones and inner transformation.', hi: '100 वर्षीय चक्र। वर्गोत्तम लग्न पर लागू। आत्मा की गहन विकास यात्रा — आध्यात्मिक उपलब्धियाँ।' } },
                  { key: 'chaturaaseethi', desc: { en: '84-year cycle. Applied when the 10th lord is in the 10th house. Focuses on career and public life timing — when you rise, when you face professional challenges, and when recognition comes.', hi: '84 वर्षीय चक्र। दशमेश दशम में हो तब लागू। कैरियर और सार्वजनिक जीवन — उत्थान, चुनौती और मान्यता का समय।' } },
                  { key: 'shashtihayani', desc: { en: '60-year cycle. Applied when Sun is in the lagna. Solar-focused timing — leadership opportunities, authority, government interactions, and health vitality through life.', hi: '60 वर्षीय चक्र। सूर्य लग्न में हो तब लागू। नेतृत्व, अधिकार, सरकारी संबंध और स्वास्थ्य शक्ति।' } },
                  { key: 'mandooka', desc: { en: '"Frog" dasha — signs jump in a specific pattern (like a frog hops). A Jaimini sign-based system that reveals sudden life changes, relocations, and unexpected turns of fortune.', hi: '"मण्डूक" दशा — राशियाँ विशिष्ट पैटर्न में कूदती हैं। अचानक जीवन परिवर्तन, स्थानान्तरण और अप्रत्याशित भाग्य-मोड़।' } },
                  { key: 'drig', desc: { en: '"Sight" dasha — based on planetary aspects (drishti) to signs. Shows which life areas receive active planetary attention during each period. Useful for understanding why certain themes intensify.', hi: '"दृग" दशा — राशियों पर ग्रह दृष्टि आधारित। कौन से जीवन क्षेत्र प्रत्येक अवधि में सक्रिय ग्रह ध्यान प्राप्त करते हैं।' } },
                  { key: 'moola', desc: { en: 'Root dasha — traces back to the fundamental nakshatra lord chain. Reveals the deepest karmic patterns operating beneath the surface of more visible dasha systems.', hi: 'मूल दशा — मूल नक्षत्र स्वामी श्रृंखला। दृश्य दशाओं के नीचे संचालित गहनतम कार्मिक पैटर्न।' } },
                  { key: 'navamsha_dasha', desc: { en: 'Dasha based on Navamsha (D9) chart positions. Since D9 represents the soul\'s deeper purpose and marriage, this system times spiritual evolution, partnership changes, and dharmic milestones.', hi: 'नवांश (D9) कुण्डली स्थितियों पर आधारित दशा। D9 आत्मा और विवाह का प्रतिनिधित्व करता है — आध्यात्मिक विकास और धार्मिक उपलब्धियों का समय।' } },
                  { key: 'naisargika', desc: { en: 'Natural planetary periods based on each planet\'s innate nature, not birth-specific. Shows universal developmental stages — childhood (Moon), education (Mercury), marriage (Venus), career (Sun), etc. Same for everyone.', hi: 'प्रत्येक ग्रह के स्वाभाविक स्वभाव पर आधारित। सार्वभौमिक विकास चरण — बचपन (चन्द्र), शिक्षा (बुध), विवाह (शुक्र), कैरियर (सूर्य)।' } },
                  { key: 'tara', desc: { en: 'Star-based dasha using the 27 nakshatra lords in sequence. Times events through the nakshatras\' intrinsic qualities — each nakshatra activates its specific life themes (health, wealth, relationships, spirituality).', hi: 'तारा दशा — 27 नक्षत्र स्वामियों के क्रम में। प्रत्येक नक्षत्र अपने विशिष्ट जीवन विषयों को सक्रिय करता है।' } },
                  { key: 'tithi_ashtottari', desc: { en: '108-year cycle based on the tithi lord at birth. If you were born on Dvitiya (Moon\'s tithi), Moon dominates. Reveals how the lunar day of birth shapes your life\'s rhythmic pattern.', hi: 'जन्म तिथि स्वामी पर आधारित 108 वर्षीय चक्र। जन्म तिथि जीवन की लयबद्ध पैटर्न कैसे आकार देती है।' } },
                  { key: 'yoga_vimsottari', desc: { en: 'Based on the birth yoga (Sun + Moon combination). The yoga active at birth determines the starting dasha lord. Reveals how the Sun-Moon dynamic — your conscious will vs emotional nature — plays out over time.', hi: 'जन्म योग (सूर्य+चन्द्र) पर आधारित। सचेतन इच्छा बनाम भावनात्मक स्वभाव का गतिशील जीवन भर कैसे प्रकट होता है।' } },
                  { key: 'buddhi_gathi', desc: { en: '100-year cycle tracking intellectual and wisdom development. Shows when mental faculties peak, when learning opportunities arise, and when accumulated wisdom bears fruit in practical life.', hi: '100 वर्षीय चक्र — बौद्धिक और ज्ञान विकास। मानसिक क्षमताएँ कब चरम पर, सीखने के अवसर कब, संचित ज्ञान कब फलित।' } },
                ];
                const found = allSystems.find(s => s.key === dashaSystem);
                if (!found) return null;
                return <p className="text-text-secondary/75 text-xs text-center mb-4 max-w-2xl mx-auto" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{found.desc[locale === 'en' || isTamil ? 'en' : 'hi']}</p>;
              })()}
              <h3 className="text-gold-gradient text-xl font-bold mb-6 text-center" style={headingFont}>{t('dashaTimeline')}</h3>
              {(() => {
                // Rasi dashas use signName instead of planetName
                const rasiDashaKeysLocal = ['narayana', 'kalachakra', 'sthira', 'shoola', 'mandooka', 'drig', 'navamsha_dasha'];
                if (rasiDashaKeysLocal.includes(dashaSystem)) {
                  const rasiData = dashaSystem === 'narayana' ? kundali.narayanaDasha
                    : dashaSystem === 'kalachakra' ? kundali.kalachakraDasha
                    : dashaSystem === 'sthira' ? kundali.sthiraDasha
                    : dashaSystem === 'mandooka' ? kundali.mandookaDasha
                    : dashaSystem === 'drig' ? kundali.drigDasha
                    : dashaSystem === 'navamsha_dasha' ? kundali.navamshaDasha
                    : kundali.shoolaDasha;
                  const SIGN_NAMES_EN = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
                  const lagnaSign = kundali.ascendant.sign;
                  const getNarayanaHouseTheme = (dashSign: number): { en: string; hi: string } | null => {
                    if (dashaSystem !== 'narayana') return null;
                    const fatherSign = ((dashSign - 1 + 8) % 12) + 1; // 9th from dasha sign
                    const childSign  = ((dashSign - 1 + 4) % 12) + 1; // 5th
                    const spouseSign = ((dashSign - 1 + 6) % 12) + 1; // 7th
                    const motherSign = ((dashSign - 1 + 3) % 12) + 1; // 4th
                    const careerSign = ((dashSign - 1 + 9) % 12) + 1; // 10th
                    const houseFromLagna = ((dashSign - lagnaSign + 12) % 12) + 1;
                    const sn = (s: number) => SIGN_NAMES_EN[s - 1];
                    return {
                      en: `H${houseFromLagna} from Lagna activated. Father: ${sn(fatherSign)} | Children: ${sn(childSign)} | Spouse: ${sn(spouseSign)} | Mother: ${sn(motherSign)} | Career: ${sn(careerSign)}`,
                      hi: `लग्न से भाव ${houseFromLagna} सक्रिय। पिता: ${sn(fatherSign)} | सन्तान: ${sn(childSign)} | जीवनसाथी: ${sn(spouseSign)} | माता: ${sn(motherSign)} | कैरियर: ${sn(careerSign)}`,
                    };
                  };
                  return (rasiData || []).map((d: { sign: number; signName: { en: string; hi: string; sa: string }; years: number; startDate: string; endDate: string }, i: number) => {
                    const now = new Date();
                    const start = new Date(d.startDate);
                    const end = new Date(d.endDate);
                    const isCurrent = now >= start && now <= end;
                    const isPast = now > end;
                    const houseFromLagna = ((d.sign - lagnaSign + 12) % 12) + 1;
                    const theme = getNarayanaHouseTheme(d.sign);
                    // Sign profiles apply to ALL sign-based dashas, not just Narayana
                    const signProfile = NARAYANA_SIGN_PROFILES[d.sign] || null;
                    const houseTheme = HOUSE_THEMES[houseFromLagna];
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 ${isCurrent ? 'border border-gold-primary/40 bg-gold-primary/5' : ''} ${isPast ? 'opacity-40' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isCurrent ? 'bg-gold-primary animate-pulse' : isPast ? 'bg-text-secondary/30' : 'bg-gold-dark/50'}`} />
                            <span className="text-gold-light font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{d.signName[locale as 'en' | 'hi' | 'sa']}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${isCurrent ? 'bg-gold-primary/15 text-gold-light' : 'bg-bg-secondary/30 text-text-tertiary'}`}>
                              H{houseFromLagna} — {houseTheme?.[locale === 'en' || isTamil ? 'en' : 'hi'] || ''}
                            </span>
                            <span className="text-text-tertiary text-xs">{d.years} {locale === 'en' || isTamil ? 'yrs' : 'वर्ष'}</span>
                          </div>
                          <span className="text-text-secondary text-xs font-mono">{d.startDate} → {d.endDate}</span>
                        </div>
                        {signProfile && (isCurrent || !isPast) && (
                          <div className="mt-2 pt-2 border-t border-gold-primary/10">
                            <p className={`text-xs leading-relaxed ${isCurrent ? 'text-text-secondary/80' : 'text-text-secondary/50'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                              {signProfile[locale === 'en' || isTamil ? 'en' : 'hi']}
                            </p>
                          </div>
                        )}
                        {isCurrent && theme && (
                          <div className="mt-1 pt-1 border-t border-gold-primary/8">
                            <p className="text-text-secondary/70 text-xs leading-relaxed font-mono" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                              {theme[locale === 'en' || isTamil ? 'en' : 'hi']}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    );
                  });
                }
                return null;
              })()}
              {!['narayana', 'kalachakra', 'sthira', 'shoola', 'mandooka', 'drig', 'navamsha_dasha'].includes(dashaSystem) && (() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const grahaDashaMap: Record<string, any[]> = {
                  vimshottari: kundali.dashas || [],
                  yogini: kundali.yoginiDashas || [],
                  ashtottari: kundali.ashtottariDashas || [],
                  shodasottari: kundali.shodasottariDasha || [],
                  dwadasottari: kundali.dwadasottariDasha || [],
                  panchottari: kundali.panchottariDasha || [],
                  satabdika: kundali.satabdikaDasha || [],
                  chaturaaseethi: kundali.chaturaaseethiDasha || [],
                  shashtihayani: kundali.shashtihayaniDasha || [],
                  moola: kundali.moolaDasha || [],
                  naisargika: kundali.naisargikaDasha || [],
                  tara: kundali.taraDasha || [],
                  tithi_ashtottari: kundali.tithiAshtottariDasha || [],
                  yoga_vimsottari: kundali.yogaVimsottariDasha || [],
                  buddhi_gathi: kundali.buddhiGathiDasha || [],
                };
                const dashaList = grahaDashaMap[dashaSystem] || kundali.dashas || [];

                // Planet colors and dasha significations
                const PLANET_COLORS: Record<string, string> = {
                  Sun: '#e67e22', Moon: '#ecf0f1', Mars: '#e74c3c', Mercury: '#2ecc71',
                  Jupiter: '#f39c12', Venus: '#e8e6e3', Saturn: '#3498db', Rahu: '#8e44ad', Ketu: '#95a5a6',
                };
                const DASHA_MEANING: Record<string, { en: string; hi: string }> = {
                  Sun: { en: 'Authority, career, father, government, health vitality, soul purpose', hi: 'अधिकार, कैरियर, पिता, सरकार, स्वास्थ्य, आत्म उद्देश्य' },
                  Moon: { en: 'Mind, emotions, mother, home, public life, mental peace', hi: 'मन, भावनाएँ, माता, घर, सार्वजनिक जीवन, मानसिक शान्ति' },
                  Mars: { en: 'Energy, courage, property, siblings, surgery, disputes', hi: 'ऊर्जा, साहस, सम्पत्ति, भाई-बहन, शल्य, विवाद' },
                  Mercury: { en: 'Intellect, communication, business, education, skills', hi: 'बुद्धि, संवाद, व्यापार, शिक्षा, कौशल' },
                  Jupiter: { en: 'Wisdom, children, wealth, spirituality, guru, expansion', hi: 'ज्ञान, सन्तान, धन, आध्यात्मिकता, गुरु, विस्तार' },
                  Venus: { en: 'Love, marriage, luxury, arts, vehicles, comfort', hi: 'प्रेम, विवाह, विलासिता, कला, वाहन, सुख' },
                  Saturn: { en: 'Discipline, karma, delays, service, longevity, hard work', hi: 'अनुशासन, कर्म, विलम्ब, सेवा, दीर्घायु, परिश्रम' },
                  Rahu: { en: 'Ambition, foreign, unconventional, obsession, technology', hi: 'महत्वाकांक्षा, विदेश, अपारम्परिक, जुनून, प्रौद्योगिकी' },
                  Ketu: { en: 'Spirituality, detachment, past karma, liberation, isolation', hi: 'आध्यात्मिकता, वैराग्य, पूर्व कर्म, मोक्ष, एकान्त' },
                };

                // Calculate full timeline span for the progress bar
                const firstStart = dashaList.length > 0 ? new Date(dashaList[0].startDate).getTime() : 0;
                const lastEnd = dashaList.length > 0 ? new Date(dashaList[dashaList.length - 1].endDate).getTime() : 1;
                const totalSpan = lastEnd - firstStart;
                const nowMs = Date.now();

                return (
                  <>
                    {/* Visual timeline bar */}
                    <div className="rounded-lg overflow-hidden h-10 sm:h-8 flex mb-8 border border-gold-primary/10">
                      {dashaList.map((d: { planetName: Record<string, string>; startDate: string; endDate: string; planet?: string }, idx: number) => {
                        const s = new Date(d.startDate).getTime();
                        const e = new Date(d.endDate).getTime();
                        const widthPct = ((e - s) / totalSpan) * 100;
                        const isCur = nowMs >= s && nowMs <= e;
                        const planetEn = d.planetName?.en || d.planet || '';
                        const color = PLANET_COLORS[planetEn] || '#d4a853';
                        return (
                          <div key={idx} className="relative group cursor-pointer" style={{ width: `${widthPct}%`, backgroundColor: `${color}${isCur ? '40' : '18'}`, borderRight: '1px solid rgba(10,14,39,0.5)' }}>
                            {isCur && (
                              <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${color}30, ${color}50)` }}>
                                <div className="absolute left-0 top-0 bottom-0 bg-gold-primary/30" style={{ width: `${Math.min(100, ((nowMs - s) / (e - s)) * 100)}%` }} />
                              </div>
                            )}
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/70 truncate px-1">
                              {widthPct > 4 ? (planetEn.substring(0, 3)) : ''}
                            </span>
                            {/* Tooltip — visible on hover (desktop) and focus-within (touch tap) */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-bg-primary/95 border border-gold-primary/20 rounded text-xs text-gold-light whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 active:opacity-100 transition-opacity pointer-events-none z-10" role="tooltip">
                              {tl(d.planetName, locale)} ({d.startDate.substring(0, 4)}–{d.endDate.substring(0, 4)})
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Dasha cards with meaning */}
                    {dashaList.map((dasha: { planetName: Record<string, string>; planet?: string; startDate: string; endDate: string; subPeriods?: { planetName: Record<string, string>; planet?: string; startDate: string; endDate: string }[] }, i: number) => {
                      const now = new Date();
                      const start = new Date(dasha.startDate);
                      const end = new Date(dasha.endDate);
                      const isCurrent = now >= start && now <= end;
                      const isPast = now > end;
                      // Dasha Sandhi — within 3 months of boundary
                      const THREE_MONTHS_MS = 90 * 24 * 3600 * 1000;
                      const isEndingSoon = isCurrent && (end.getTime() - now.getTime()) <= THREE_MONTHS_MS;
                      const isStartingSoon = !isCurrent && !isPast && (start.getTime() - now.getTime()) <= THREE_MONTHS_MS;
                      const planetEn = dasha.planetName?.en || dasha.planet || '';
                      const color = PLANET_COLORS[planetEn] || '#d4a853';
                      const meaning = DASHA_MEANING[planetEn];
                      const durationYears = ((end.getTime() - start.getTime()) / (365.25 * 24 * 3600000)).toFixed(1);
                      const progressPct = isCurrent ? Math.min(100, ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100) : isPast ? 100 : 0;

                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                          className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden ${isCurrent ? 'border-2 ring-1 ring-gold-primary/20' : ''} ${isPast ? 'opacity-40' : ''}`}
                          style={{ borderColor: isCurrent ? `${color}60` : undefined }}>
                          {/* Progress bar at top */}
                          <div className="h-1" style={{ backgroundColor: `${color}15` }}>
                            <div className="h-full transition-all duration-500" style={{ width: `${progressPct}%`, backgroundColor: color }} />
                          </div>

                          <div className="p-5">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color, opacity: isPast ? 0.3 : 0.8 }} />
                                <span className="text-gold-light font-bold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                                  {tl(dasha.planetName, locale)}
                                </span>
                                <span className="text-text-secondary/70 text-xs">{durationYears} {locale === 'en' || isTamil ? 'yrs' : 'वर्ष'}</span>
                                {isCurrent && <span className="px-2 py-0.5 bg-gold-primary/20 text-gold-light text-xs rounded-full font-bold animate-pulse">{locale === 'en' || isTamil ? 'NOW' : 'अभी'}</span>}
                                {(isEndingSoon || isStartingSoon) && (
                                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full font-bold border border-amber-500/30" title={locale === 'en' || isTamil ? 'Dasha Sandhi — junction zone, 3-6 months of instability. Avoid major commitments.' : 'दशा संधि — अस्थिर काल, नए कार्यों से बचें'}>
                                    {locale === 'en' || isTamil ? 'Sandhi' : 'संधि'}
                                  </span>
                                )}
                              </div>
                              <span className="text-text-secondary text-xs font-mono">{dasha.startDate.substring(0, 7)} → {dasha.endDate.substring(0, 7)}</span>
                            </div>

                            {/* Sandhi warning */}
                            {(isEndingSoon || isStartingSoon) && (
                              <div className="mt-2 ml-7 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <p className="text-amber-400 text-xs leading-relaxed">
                                  {locale === 'en' || isTamil
                                    ? isEndingSoon
                                      ? `Dasha Sandhi — this Mahadasha ends in ${Math.ceil((end.getTime() - Date.now()) / (30 * 24 * 3600 * 1000))} months. The junction zone brings instability; avoid irreversible decisions until the new dasha establishes.`
                                      : `Dasha Sandhi — this Mahadasha begins in ${Math.ceil((start.getTime() - Date.now()) / (30 * 24 * 3600 * 1000))} months. Prepare for a significant shift in life themes.`
                                    : isEndingSoon
                                      ? `दशा संधि — यह महादशा ${Math.ceil((end.getTime() - Date.now()) / (30 * 24 * 3600 * 1000))} माह में समाप्त। संधि काल में महत्वपूर्ण निर्णय टालें।`
                                      : `दशा संधि — यह महादशा ${Math.ceil((start.getTime() - Date.now()) / (30 * 24 * 3600 * 1000))} माह में प्रारम्भ। नए जीवन-विषयों की तैयारी करें।`}
                                </p>
                              </div>
                            )}

                            {/* Dasha meaning — generic keywords + chart-specific context */}
                            {meaning && !isPast && (() => {
                              // Chart-specific: where is this planet in YOUR chart?
                              const planetData = kundali.planets.find(p => p.planet.name.en === planetEn);
                              const HOUSE_KEYWORDS: Record<number, { en: string; hi: string }> = {
                                1: { en: 'self, health, personality', hi: 'आत्म, स्वास्थ्य, व्यक्तित्व' },
                                2: { en: 'wealth, family, speech', hi: 'धन, परिवार, वाणी' },
                                3: { en: 'courage, siblings, communication', hi: 'साहस, भाई-बहन, संवाद' },
                                4: { en: 'home, mother, comfort', hi: 'घर, माता, सुख' },
                                5: { en: 'children, education, creativity', hi: 'सन्तान, शिक्षा, रचनात्मकता' },
                                6: { en: 'health challenges, competition, service', hi: 'स्वास्थ्य चुनौतियाँ, प्रतिस्पर्धा, सेवा' },
                                7: { en: 'marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार' },
                                8: { en: 'transformation, longevity, hidden matters', hi: 'परिवर्तन, दीर्घायु, गुप्त विषय' },
                                9: { en: 'fortune, dharma, guru, father', hi: 'भाग्य, धर्म, गुरु, पिता' },
                                10: { en: 'career, status, authority', hi: 'कैरियर, प्रतिष्ठा, अधिकार' },
                                11: { en: 'gains, income, friends', hi: 'लाभ, आय, मित्र' },
                                12: { en: 'expenses, liberation, foreign', hi: 'व्यय, मोक्ष, विदेश' },
                              };
                              const houseKw = planetData ? HOUSE_KEYWORDS[planetData.house] : null;
                              const dignity = planetData?.isExalted ? (locale === 'en' || isTamil ? 'exalted (very strong)' : 'उच्च (अत्यन्त बलवान)')
                                : planetData?.isDebilitated ? (locale === 'en' || isTamil ? 'debilitated (weakened)' : 'नीच (दुर्बल)')
                                : planetData?.isOwnSign ? (locale === 'en' || isTamil ? 'in own sign (comfortable)' : 'स्वगृही (सहज)')
                                : null;
                              return (
                                <div className="mt-2 ml-7 space-y-1">
                                  <p className="text-text-secondary/60 text-xs" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                    {locale === 'en' || isTamil ? meaning.en : meaning.hi}
                                  </p>
                                  {planetData && houseKw && (
                                    <p className={`text-xs leading-relaxed ${isCurrent ? 'text-gold-light/70' : 'text-text-secondary/50'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                      {locale === 'en' || isTamil
                                        ? <>{planetEn} is in your <strong>house {planetData.house}</strong> ({houseKw.en}) in {planetData.signName.en}.{dignity ? ` ${planetEn} is ${dignity}.` : ''} This dasha activates these life areas most strongly.</>
                                        : <>{dasha.planetName.hi} आपके <strong>भाव {planetData.house}</strong> ({houseKw.hi}) में {planetData.signName.hi} राशि में है।{dignity ? ` ${dasha.planetName.hi} ${dignity}।` : ''} यह दशा इन जीवन क्षेत्रों को सबसे अधिक सक्रिय करती है।</>
                                      }
                                    </p>
                                  )}
                                </div>
                              );
                            })()}

                            {/* Current dasha progress detail */}
                            {isCurrent && (
                              <div className="mt-3 ml-7 text-xs text-gold-primary/70">
                                {Math.round(progressPct)}% {locale === 'en' || isTamil ? 'complete' : 'पूर्ण'} — {locale === 'en' || isTamil ? 'ends' : 'समाप्ति'} {end.toLocaleDateString(locale === 'en' || isTamil ? 'en-IN' : 'hi-IN', { year: 'numeric', month: 'short' })}
                              </div>
                            )}

                            {/* Sub-periods (Antar Dasha) — show for current maha dasha */}
                            {isCurrent && dasha.subPeriods && (
                              <div className="mt-4 ml-2 pl-2 sm:ml-4 sm:pl-4 border-l-2 space-y-1.5" style={{ borderColor: `${color}30` }}>
                                <div className="text-xs uppercase tracking-wider text-text-secondary/65 mb-2">{locale === 'en' || isTamil ? 'Antar Dasha (Sub-periods)' : 'अन्तर दशा'}</div>
                                {dasha.subPeriods.map((sub, j) => {
                                  const subStart = new Date(sub.startDate);
                                  const subEnd = new Date(sub.endDate);
                                  const isSubCurrent = now >= subStart && now <= subEnd;
                                  const isSubPast = now > subEnd;
                                  const subPlanetEn = sub.planetName?.en || sub.planet || '';
                                  const subColor = PLANET_COLORS[subPlanetEn] || '#d4a853';
                                  const subMeaning = DASHA_MEANING[subPlanetEn];
                                  return (
                                    <div key={j} className={`rounded-lg p-2.5 ${isSubCurrent ? 'bg-gold-primary/5 border border-gold-primary/15' : isSubPast ? 'opacity-30' : ''}`}>
                                      <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isSubCurrent ? subColor : `${subColor}40` }} />
                                          <span className={`text-sm ${isSubCurrent ? 'text-gold-light font-semibold' : 'text-text-secondary'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                            {tl(sub.planetName, locale)}
                                          </span>
                                          {isSubCurrent && <span className="text-xs px-1.5 py-0.5 bg-gold-primary/15 text-gold-primary rounded-full">{locale === 'en' || isTamil ? 'active' : 'सक्रिय'}</span>}
                                        </span>
                                        <span className="font-mono text-xs text-text-secondary/70">{sub.startDate.substring(0, 7)} → {sub.endDate.substring(0, 7)}</span>
                                      </div>
                                      {isSubCurrent && subMeaning && (
                                        <p className="text-text-secondary/75 text-xs mt-1 ml-5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                          {planetEn}–{subPlanetEn}: {locale === 'en' || isTamil ? subMeaning.en : subMeaning.hi}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </>
                );
              })()}
              <DashaInterpretation dashas={kundali.dashas} planets={kundali.planets} locale={locale} />
            </div>
          )}

          {/* ===== ASHTAKAVARGA TAB ===== */}
          {activeTab === 'ashtakavarga' && kundali.ashtakavarga && (
            <>
              <a href={`/${locale}/learn/ashtakavarga`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">
                {locale === 'en' || isTamil ? 'Learn about Ashtakavarga \u2192' : 'अष्टकवर्ग के बारे में जानें \u2192'}
              </a>
              <AshtakavargaTab ashtakavarga={kundali.ashtakavarga} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} t={t} />
            </>
          )}

          {/* ===== TIPPANNI TAB ===== */}
          {activeTab === 'tippanni' && (
            <>
              <a href={`/${locale}/learn/tippanni`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">
                {locale === 'en' || isTamil ? 'Learn about Tippanni \u2192' : 'टिप्पणी के बारे में जानें \u2192'}
              </a>
              <TippanniTab kundali={kundali} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} tTip={tTip} />
            </>
          )}

          {/* ===== VARGA ANALYSIS TAB ===== */}
          {activeTab === 'varga' && (
            <>
              <a href={`/${locale}/learn/vargas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">
                {locale === 'en' || isTamil ? 'Learn about Varga Charts \u2192' : 'वर्ग चार्ट के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-varga"
                title={locale === 'en' || isTamil ? 'What are Divisional Charts (Varga)?' : 'विभागीय चार्ट (वर्ग) क्या हैं?'}
                defaultOpen={false}
              >
                {locale === 'en' || isTamil
                  ? 'Your birth chart (D1) shows the big picture. Divisional charts zoom into specific life areas by mathematically dividing each sign: D9 (Navamsha)=marriage/dharma/soul\'s true nature (most important after D1), D10 (Dashamsha)=career/profession, D2 (Hora)=wealth, D3 (Drekkana)=siblings, D7 (Saptamsha)=children, D12 (Dwadashamsha)=parents. If a planet is strong in BOTH D1 and D9, its results are confirmed and powerful.'
                  : 'आपकी जन्म कुण्डली (D1) व्यापक चित्र दिखाती है। विभागीय चार्ट प्रत्येक राशि को गणितीय रूप से विभाजित करके विशिष्ट जीवन क्षेत्रों में ज़ूम करते हैं: D9 (नवांश)=विवाह/धर्म/आत्मा का सच्चा स्वरूप (D1 के बाद सर्वाधिक महत्वपूर्ण), D10 (दशमांश)=कैरियर/व्यवसाय, D2 (होरा)=धन, D3 (द्रेष्काण)=भाई-बहन, D7 (सप्तांश)=संतान, D12 (द्वादशांश)=माता-पिता। यदि कोई ग्रह D1 और D9 दोनों में बलवान है तो उसके फल निश्चित और शक्तिशाली होते हैं।'}
              </InfoBlock>
              <VargaAnalysisTab kundali={kundali} locale={locale as Locale} headingFont={headingFont} />
            </>
          )}

          {/* ===== GRAHA TAB ===== */}
          {activeTab === 'graha' && kundali.grahaDetails && (
            <>
              <a href={`/${locale}/learn/grahas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">
                {locale === 'en' || isTamil ? 'Learn about Grahas \u2192' : 'ग्रहों के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-graha"
                title={locale === 'hi' ? 'ग्रह विश्लेषण क्या है?' : 'What is Graha Analysis?'}
                defaultOpen={false}
              >
                {locale === 'hi'
                  ? 'विस्तृत ग्रह डेटा जिसमें सटीक निर्देशांक, गति, क्रांति और प्रत्येक ग्रह जिस नक्षत्र पाद (चतुर्थांश) में है वह शामिल हैं। उपग्रह (गुलिका और मंदी जैसे छाया उप-ग्रह) और सूक्ष्मता जोड़ते हैं। गति बताती है कि ग्रह कितना सक्रिय है — धीमे ग्रह (वक्री के निकट) विलंबित लेकिन गहरे परिणाम देते हैं। अक्षांश दर्शाता है कि ग्रह क्रांतिवृत्त से कितना दूर है — अत्यधिक अक्षांश ग्रह के प्रभाव को कमज़ोर करता है।'
                  : 'Extended planetary data including exact coordinates, speed, declination, and the nakshatra pada (quarter) each planet occupies. Upagrahas (shadow sub-planets like Gulika and Mandi) add nuance. Speed tells you how active a planet is — slow planets (near retrograde) give delayed but deep results. Latitude shows how far a planet is from the ecliptic — extreme latitudes weaken a planet\'s influence.'}
              </InfoBlock>
              <GrahaTab grahaDetails={kundali.grahaDetails} upagrahas={kundali.upagrahas || []} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} planetInsights={tip?.planetInsights} />
            </>
          )}

          {/* ===== YOGAS TAB ===== */}
          {activeTab === 'yogas' && kundali.yogasComplete && (
            <div className="space-y-6">
              <a href={`/${locale}/learn/yogas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Yogas \u2192' : 'योगों के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-yogas"
                title={locale === 'en' || isTamil ? 'What are Yogas and why do they matter for your life?' : 'योग क्या हैं और वे आपके जीवन के लिए क्यों मायने रखते हैं?'}
                defaultOpen={false}
              >
                {locale === 'en' || isTamil ? (
                  <div className="space-y-3">
                    <p>A <strong>Yoga</strong> (literally &quot;union&quot;) is a special planetary combination that, when formed, creates a distinct life theme or talent. Think of them as <em>bonus features</em> installed at birth — certain yogas give natural wealth, others give fame, spiritual gifts, or leadership abilities.</p>
                    <p><strong>Key types of Yogas and what they mean for you:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong className="text-emerald-400">Raj Yogas</strong> (royal combinations) — Planets owning trikona (1st/5th/9th) and kendra (1st/4th/7th/10th) houses are conjunct or mutually aspect. Effect: authority, success, high social status, career breakthroughs. The more Raj Yogas you have, the more natural momentum towards achievement.</li>
                      <li><strong className="text-amber-300">Dhana Yogas</strong> (wealth combinations) — 1st, 2nd, 5th, 9th, 11th house lords linking together. Effect: financial gains, prosperity, material comfort. Strong Dhana Yogas mean money flows more easily.</li>
                      <li><strong className="text-sky-300">Viparita Raj Yogas</strong> — Lords of the challenging houses (6th, 8th, 12th) weakening each other. Effect: transformation through adversity — what seems like misfortune turns into a hidden advantage. These people bounce back stronger from setbacks.</li>
                      <li><strong className="text-gold-light">Pancha Mahapurusha Yogas</strong> — A strong planet in its own or exaltation sign in a kendra house. Creates an exceptional person in that planet&apos;s domain (e.g., Ruchaka = warrior/Mars energy; Hamsa = wisdom/Jupiter energy; Malavya = beauty/Venus energy).</li>
                      <li><strong className="text-red-400">Arishta Yogas</strong> — Challenging combinations. These are obstacles, but also opportunities for growth. Many great people have significant Arishta Yogas.</li>
                    </ul>
                    <p><strong>Important:</strong> A Yoga&apos;s strength depends on: (1) whether both planets are strong, (2) whether they are aspected by malefics, (3) whether the dasha of those planets is active. A yoga in a chart gives its results fully during its planet&apos;s dasha period.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p><strong>योग</strong> एक विशेष ग्रह संयोजन है जो जन्म से एक विशिष्ट जीवन विषय या प्रतिभा बनाता है — जैसे <em>बोनस सुविधाएं</em> जन्म में स्थापित। कुछ योग स्वाभाविक धन देते हैं, कुछ यश, आध्यात्मिक शक्ति या नेतृत्व।</p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong className="text-emerald-400">राज योग</strong> — त्रिकोण और केन्द्र भाव के स्वामी एक साथ। प्रभाव: अधिकार, सफलता, उच्च सामाजिक स्थिति।</li>
                      <li><strong className="text-amber-300">धन योग</strong> — 1, 2, 5, 9, 11 भाव के स्वामी जुड़े हों। प्रभाव: आर्थिक समृद्धि।</li>
                      <li><strong className="text-sky-300">विपरीत राज योग</strong> — कठिन भावों (6, 8, 12) के स्वामी एक-दूसरे को कमज़ोर करें। प्रभाव: प्रतिकूलता से सफलता।</li>
                      <li><strong className="text-gold-light">पंचमहापुरुष योग</strong> — स्वगृह या उच्च में केन्द्र भाव में बलवान ग्रह। उस ग्रह के क्षेत्र में असाधारण व्यक्ति।</li>
                    </ul>
                    <p><strong>महत्वपूर्ण:</strong> योग का फल उसके ग्रहों की दशा में सबसे अधिक मिलता है।</p>
                  </div>
                )}
              </InfoBlock>
              <YogasTab yogas={kundali.yogasComplete} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
              <YogasInterpretation yogas={kundali.yogasComplete} locale={locale} />
            </div>
          )}


          {/* ===== SHADBALA TAB ===== */}
          {activeTab === 'shadbala' && kundali.fullShadbala && (
            <div className="space-y-6">
              <a href={`/${locale}/learn/shadbala`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Shadbala \u2192' : 'षड्बल के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-shadbala"
                title={locale === 'hi' ? 'षड्बल क्या है?' : 'What is Shadbala (Six-fold Strength)?'}
                defaultOpen={false}
              >
                {locale === 'hi'
                  ? 'आपकी कुण्डली के सभी ग्रह समान रूप से शक्तिशाली नहीं होते। षड्बल 6 स्रोतों से प्रत्येक ग्रह की शक्ति मापता है: स्थानीय (कौन सी राशि), दिशात्मक (कौन सा भाव), कालिक (जन्म का समय), गतिज (गति), नैसर्गिक (जन्मजात शक्ति), और दृग् (अन्य ग्रहों का प्रभाव)। 1.0 रूप से ऊपर अंक पाने वाला ग्रह पर्याप्त बलवान है। उससे नीचे वह अपने वादे पूरे करने में संघर्ष करता है। सबसे बलवान ग्रह अक्सर आपके प्रमुख व्यक्तित्व लक्षण को परिभाषित करता है।'
                  : 'Not all planets in your chart are equally powerful. Shadbala measures each planet\'s strength from 6 sources: positional (which sign), directional (which house), temporal (time of birth), motional (speed), natural (inherent strength), and aspectual (other planets\' influence). A planet scoring above 1.0 Rupa is adequately strong. Below that, it struggles to deliver its promises. The strongest planet often defines your dominant personality trait.'}
              </InfoBlock>
              <ShadbalaInterpretation shadbala={kundali.fullShadbala} planets={kundali.planets} dashas={kundali.dashas || []} locale={locale} />
              <ShadbalaTab shadbala={kundali.fullShadbala} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
            </div>
          )}

          {/* ===== BHAVABALA TAB ===== */}
          {activeTab === 'bhavabala' && kundali.bhavabala && (
            <div className="space-y-6">
              <a href={`/${locale}/learn/bhavabala`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Bhavabala \u2192' : 'भावबल के बारे में जानें \u2192'}
              </a>
              <InfoBlock
                id="kundali-bhavabala"
                title={locale === 'hi' ? 'भावबल क्या है?' : 'What is Bhavabala (House Strength)?'}
                defaultOpen={false}
              >
                {locale === 'hi'
                  ? 'आपकी कुण्डली के 12 भावों में से प्रत्येक का एक शक्ति स्कोर होता है। बलवान भाव सहजता से अपने वादे पूरे करते हैं — एक बलवान 10वाँ भाव का अर्थ है कि करियर की सफलता स्वाभाविक रूप से आती है। कमज़ोर भाव उन क्षेत्रों को इंगित करते हैं जिनमें अधिक प्रयास की आवश्यकता है। यह स्कोर भावेश की शक्ति, उसमें स्थित ग्रहों और प्राप्त दृष्टियों का संयोजन है। आपका सबसे बलवान भाव अक्सर आपकी सबसे बड़ी जीवन संपदा बन जाता है।'
                  : 'Each of the 12 houses in your chart has a strength score. Strong houses deliver their promises easily — a strong 10th house means career success comes naturally. Weak houses indicate areas requiring more effort. The score combines the lord\'s strength, occupant planets, and aspects received. Your strongest house often becomes your greatest life asset.'}
              </InfoBlock>
              <BhavabalaTab bhavabala={kundali.bhavabala} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
              <BhavabalaInterpretation bhavabala={kundali.bhavabala} locale={locale} />
            </div>
          )}

          {/* ===== AVASTHAS TAB ===== */}
          {activeTab === 'avasthas' && kundali.avasthas && (
            <div className="space-y-6">
              <a href={`/${locale}/learn/avasthas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Avasthas \u2192' : 'अवस्थाओं के बारे में जानें \u2192'}
              </a>
              <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
                {locale === 'en' || isTamil ? 'Planetary Avasthas (States)' : 'ग्रह अवस्थाएं'}
              </h3>

              <InfoBlock
                id="kundali-avasthas"
                title={locale === 'en' || isTamil ? 'What are Avasthas and why do they matter?' : 'अवस्थाएं क्या हैं और वे क्यों मायने रखती हैं?'}
                defaultOpen={false}
              >
                {locale === 'en' || isTamil ? (
                  <div className="space-y-3">
                    <p>Think of <strong>Avasthas</strong> as the <em>mood and energy level</em> of each planet. A planet can be very powerful (high Shadbala) but still express itself awkwardly — like a strong person who is embarrassed or sleepy. Avasthas explain exactly HOW each planet is feeling and delivering its results.</p>
                    <p><strong>The 5 Avastha systems (each measures a different dimension):</strong></p>
                    <ul className="list-disc ml-4 space-y-2 text-xs">
                      <li><strong className="text-gold-light">Baladi (Age State)</strong> — Is the planet young and eager, middle-aged and settled, or old and tired? <em>Bala</em> (infant) = still developing its potential; <em>Kumara</em> (youth) = active and learning; <em>Yuva</em> (young adult) = full power and giving best results; <em>Vriddha</em> (old) = slowing down; <em>Mrita</em> (dead) = blocked, giving minimal results. <strong>Impact on you:</strong> Planets in Yuva state are your biggest assets right now.</li>
                      <li><strong className="text-gold-light">Jagradadi (Alertness)</strong> — Is the planet awake, dreaming, or asleep? <em>Jaagrit</em> (awake) = giving 100% of promised results; <em>Swapna</em> (dreaming) = giving 50%; <em>Sushupti</em> (deep sleep) = giving only 25%. <strong>Impact on you:</strong> An awake planet actively shapes your life; a sleeping one underperforms despite its placement.</li>
                      <li><strong className="text-gold-light">Deeptadi (Brightness)</strong> — How brightly is the planet shining? <em>Deepta</em> (radiant) = expressing fully and positively; <em>Swastha</em> (comfortable) = at ease; <em>Mudita</em> (pleased) = happy; <em>Shanta</em> (calm); <em>Dina</em> (dim); <em>Dukhita</em> (distressed) = struggling to express; <em>Vikala</em> (defective) = giving erratic results. <strong>Impact on you:</strong> Radiant planets perform with confidence; distressed ones give unpredictable or painful results.</li>
                      <li><strong className="text-gold-light">Lajjitadi (Emotional State)</strong> — Is the planet in a dignified or compromised emotional state? <em>Lajjita</em> (ashamed) = in a difficult sign with enemy planets; <em>Garvita</em> (proud) = exalted or own sign; <em>Kshudita</em> (hungry) = with enemies; <em>Trishita</em> (thirsty) = in a watery sign with enemy; <em>Mudita</em> (happy) = with friends; <em>Kshobhita</em> (agitated). <strong>Impact on you:</strong> Proud planets deliver results you can be proud of; ashamed planets create obstacles in their domain.</li>
                      <li><strong className="text-gold-light">Shayanadi (Activity Mode)</strong> — Is the planet active or resting? <em>Shayan</em> (sleeping/resting) = in a long resting phase, results come slowly; <em>Upaveshan</em> (seated) = stable; <em>Netrapani</em> (alert); <em>Prakashana</em> (radiant); <em>Gaman</em> (moving/active) = actively delivering results. <strong>Impact on you:</strong> Active (Gaman) planets are bringing their themes into your life right now.</li>
                    </ul>
                    <p className="text-text-secondary/70 text-xs"><strong>How to read the table:</strong> Green = positive/strong, Amber = mixed/moderate, Red = challenging. The AvasthaInterpretation section below gives you the combined personal meaning.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p><strong>अवस्थाएं</strong> प्रत्येक ग्रह का <em>मूड और ऊर्जा स्तर</em> हैं। एक शक्तिशाली ग्रह भी असहज तरीके से काम कर सकता है — जैसे एक ताकतवर व्यक्ति जो शर्मिंदा या नींद में हो। अवस्थाएं बताती हैं कि हर ग्रह ठीक कैसा महसूस कर रहा है।</p>
                    <p><strong>5 अवस्था पद्धतियाँ:</strong></p>
                    <ul className="list-disc ml-4 space-y-2 text-xs">
                      <li><strong className="text-gold-light">बालादि (आयु अवस्था)</strong> — बाल (शिशु) = क्षमता विकसित हो रही है; कुमार (युवा) = सक्रिय; युव (युवा वयस्क) = पूर्ण शक्ति; वृद्ध (वृद्ध) = धीमा; मृत = अवरुद्ध। <strong>आपके लिए:</strong> युव अवस्था में ग्रह आपकी सबसे बड़ी संपत्ति हैं।</li>
                      <li><strong className="text-gold-light">जागृतादि (सजगता)</strong> — जाग्रत = 100% परिणाम; स्वप्न = 50%; सुषुप्ति = केवल 25%। <strong>आपके लिए:</strong> जाग्रत ग्रह आपके जीवन को सक्रिय रूप से आकार देता है।</li>
                      <li><strong className="text-gold-light">दीप्तादि (प्रकाश)</strong> — दीप्त = पूरी तरह चमकता है; सुस्थ = सहज; मुदित = प्रसन्न; दीन = मंद; दुःखित = संघर्षशील। <strong>आपके लिए:</strong> दीप्त ग्रह आत्मविश्वास से परिणाम देते हैं।</li>
                      <li><strong className="text-gold-light">लज्जितादि (भावनात्मक)</strong> — गर्वित (गर्व) = उच्च/स्वगृह; लज्जित (शर्मिंदा) = शत्रु के साथ; मुदित (प्रसन्न) = मित्रों के साथ। <strong>आपके लिए:</strong> गर्वित ग्रह ऐसे परिणाम देते हैं जिन पर गर्व हो।</li>
                      <li><strong className="text-gold-light">शयनादि (गतिविधि)</strong> — गमन (सक्रिय) = अभी परिणाम दे रहा है; शयन (विश्राम) = परिणाम धीरे आते हैं। <strong>आपके लिए:</strong> गमन ग्रह अभी आपके जीवन में अपने विषय ला रहे हैं।</li>
                    </ul>
                    <p className="text-text-secondary/70 text-xs"><strong>तालिका पढ़ने का तरीका:</strong> हरा = सकारात्मक, पीला = मिश्रित, लाल = चुनौतीपूर्ण।</p>
                  </div>
                )}
              </InfoBlock>

              <p className="text-text-secondary text-xs text-center mb-4">
                {locale === 'en' || isTamil ? 'HOW each planet expresses its energy — 5 classification systems from BPHS Ch.44-45' : 'प्रत्येक ग्रह अपनी ऊर्जा कैसे व्यक्त करता है — BPHS अ.44-45 से 5 वर्गीकरण'}
              </p>
              <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gold-primary/15">
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' || isTamil ? 'Planet' : 'ग्रह'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' || isTamil ? 'Baladi (Age)' : 'बालादि'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' || isTamil ? 'Jagradadi (Wakefulness)' : 'जागृतादि'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' || isTamil ? 'Deeptadi (Luminosity)' : 'दीप्तादि'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' || isTamil ? 'Lajjitadi (Emotional)' : 'लज्जितादि'}</th>
                      <th className="text-left py-3 px-3 text-gold-dark">{locale === 'en' || isTamil ? 'Shayanadi (Activity)' : 'शयनादि'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-primary/5">
                    {kundali.avasthas.map((av) => {
                      const pName = kundali.planets.find(p => p.planet.id === av.planetId)?.planet.name[locale as Locale] || `P${av.planetId}`;
                      return (
                        <tr key={av.planetId} className="hover:bg-gold-primary/3">
                          <td className="py-2.5 px-3 text-gold-light font-bold" style={headingFont}>{pName}</td>
                          <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs ${av.baladi.strength >= 70 ? 'bg-emerald-500/10 text-emerald-300' : av.baladi.strength >= 40 ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-400'}`}>{av.baladi.name[locale as Locale] || av.baladi.name.en}</span></td>
                          <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs ${av.jagradadi.quality === 'full' ? 'bg-emerald-500/10 text-emerald-300' : av.jagradadi.quality === 'half' ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-400'}`}>{av.jagradadi.name[locale as Locale] || av.jagradadi.name.en}</span></td>
                          <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs ${av.deeptadi.luminosity >= 60 ? 'bg-emerald-500/10 text-emerald-300' : av.deeptadi.luminosity >= 30 ? 'bg-amber-500/10 text-amber-300' : 'bg-red-500/10 text-red-400'}`}>{av.deeptadi.name[locale as Locale] || av.deeptadi.name.en}</span></td>
                          <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded text-xs ${av.lajjitadi.effect === 'benefic' ? 'bg-emerald-500/10 text-emerald-300' : av.lajjitadi.effect === 'malefic' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-300'}`}>{av.lajjitadi.name[locale as Locale] || av.lajjitadi.name.en}</span></td>
                          <td className="py-2.5 px-3 text-text-secondary">{av.shayanadi.name[locale as Locale] || av.shayanadi.name.en}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <AvasthasInterpretation avasthas={kundali.avasthas} planets={kundali.planets} locale={locale} />
            </div>
          )}

          {/* ===== ARGALA TAB ===== */}
          {activeTab === 'argala' && kundali.argala && (<a href={`/${locale}/learn/argala`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">{locale === 'en' || isTamil ? 'Learn about Argala \u2192' : 'अर्गला के बारे में जानें \u2192'}</a>)}
          {activeTab === 'argala' && kundali.argala && (() => {
            const HOUSE_SIGNIFICATIONS: { en: string; hi: string }[] = [
              { en: 'Self, body, personality, health', hi: 'आत्म, शरीर, व्यक्तित्व, स्वास्थ्य' },
              { en: 'Wealth, family, speech, food', hi: 'धन, परिवार, वाणी, भोजन' },
              { en: 'Courage, siblings, communication', hi: 'साहस, भाई-बहन, संवाद' },
              { en: 'Home, mother, comfort, property', hi: 'घर, माता, सुख, सम्पत्ति' },
              { en: 'Children, intelligence, education', hi: 'सन्तान, बुद्धि, शिक्षा' },
              { en: 'Enemies, disease, debts, service', hi: 'शत्रु, रोग, ऋण, सेवा' },
              { en: 'Marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार' },
              { en: 'Longevity, transformation, occult', hi: 'दीर्घायु, परिवर्तन, गुप्त' },
              { en: 'Dharma, father, fortune, guru', hi: 'धर्म, पिता, भाग्य, गुरु' },
              { en: 'Career, status, authority, fame', hi: 'कैरियर, प्रतिष्ठा, अधिकार, यश' },
              { en: 'Gains, income, friends, wishes', hi: 'लाभ, आय, मित्र, इच्छाएँ' },
              { en: 'Expenses, liberation, foreign, loss', hi: 'व्यय, मोक्ष, विदेश, हानि' },
            ];
            const OBSTRUCTION_REMEDIES: { en: string; hi: string }[] = [
              { en: 'Strengthen lagna lord — wear its gemstone, chant its mantra', hi: 'लग्नेश को बलवान करें — रत्न धारण, मन्त्र जाप' },
              { en: 'Donate food and support family harmony', hi: 'भोजन दान करें, पारिवारिक सामंजस्य बनाएँ' },
              { en: 'Practice courage, support siblings, write/communicate more', hi: 'साहस का अभ्यास, भाई-बहनों का समर्थन, लेखन/संवाद' },
              { en: 'Serve mother, maintain home sanctity, perform Vastu puja', hi: 'माता की सेवा, घर की पवित्रता, वास्तु पूजा' },
              { en: 'Worship Saraswati/Jupiter, educate children, creative pursuits', hi: 'सरस्वती/गुरु पूजा, सन्तान शिक्षा, सृजनात्मक कार्य' },
              { en: 'Serve the sick/poor, chant Hanuman Chalisa, stay debt-free', hi: 'रोगी/गरीबों की सेवा, हनुमान चालीसा, ऋणमुक्त रहें' },
              { en: 'Strengthen Venus, respect spouse, practice compromise', hi: 'शुक्र को बलवान करें, जीवनसाथी का सम्मान, समझौता' },
              { en: 'Chant Maha Mrityunjaya, embrace change, study occult wisely', hi: 'महामृत्युंजय जाप, परिवर्तन स्वीकार, गुप्त विद्या' },
              { en: 'Respect guru/father, visit temples, practice dharma', hi: 'गुरु/पिता का सम्मान, मन्दिर दर्शन, धर्म आचरण' },
              { en: 'Work diligently, respect authority, perform Surya Namaskar', hi: 'परिश्रम, अधिकार का सम्मान, सूर्य नमस्कार' },
              { en: 'Donate to charities, network wisely, support friends', hi: 'दान, बुद्धिमत्ता से सम्बन्ध, मित्रों का समर्थन' },
              { en: 'Practice detachment, meditate, visit pilgrimages', hi: 'वैराग्य, ध्यान, तीर्थ यात्रा' },
            ];
            const supported = kundali.argala.filter(a => a.netEffect === 'supported');
            const obstructed = kundali.argala.filter(a => a.netEffect === 'obstructed');

            return (
            <div className="space-y-6">
              <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
                {locale === 'en' || isTamil ? 'Argala — Planetary Intervention' : 'अर्गला — ग्रह हस्तक्षेप'}
              </h3>

              <InfoBlock id="kundali-argala" title={locale === 'en' || isTamil ? 'What is Argala and how to read it?' : 'अर्गला क्या है और इसे कैसे पढ़ें?'}>
                {locale === 'en' || isTamil ? (
                  <div className="space-y-3">
                    <p><strong>Argala</strong> (from Jaimini Sutras, BPHS Ch.31) reveals which planets actively <strong>push</strong> or <strong>block</strong> each area of your life. Unlike Bhavabala (which measures a house&apos;s built-in strength), Argala shows <strong>external forces</strong> acting on each house.</p>
                    <p><strong>How it works:</strong> Planets positioned in the 2nd, 4th, 5th, 8th, and 11th houses from any house create <strong>Argala</strong> (support). Planets in the 12th, 10th, 9th, 6th, and 3rd houses respectively create <strong>Virodha</strong> (counter). Not all interventions carry equal weight — <strong>only strong support and strong opposition</strong> determine the verdict. A house can have more total opponents than supporters yet still be &quot;Supported&quot; if the supporters are stronger (well-placed, benefic, or in key positions). The bar chart below each house shows this effective balance, not just raw planet counts.</p>
                    <p><strong>Why Bhavabala and Argala can differ:</strong> A house can be inherently strong (high Bhavabala) yet face external obstruction (Argala). For example, a strong 7th house with Argala obstruction means: your marriage capacity is excellent, but outside circumstances create friction. Conversely, a weak house with strong Argala support means: external help compensates for inherent weakness.</p>
                    <p><strong>How to use it:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong className="text-emerald-400">Supported houses</strong> — Life areas where planets actively help you. Lean into these — efforts here get cosmic tailwind.</li>
                      <li><strong className="text-red-400">Obstructed houses</strong> — Life areas facing planetary resistance. Not blocked permanently — the upayas (remedies) shown can reduce friction.</li>
                      <li><strong className="text-amber-400">Neutral houses</strong> — Balanced forces. Results depend more on your own effort than planetary push/pull.</li>
                    </ul>
                    <p className="text-gold-primary/50 text-xs">Special rules: 3+ malefics in the 3rd create unobstructable Argala. For Ketu&apos;s house, the argala directions are reversed.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p><strong>अर्गला</strong> (जैमिनी सूत्र, BPHS अ.31) दर्शाती है कि कौन से ग्रह आपके जीवन के प्रत्येक क्षेत्र को सक्रिय रूप से <strong>बढ़ावा</strong> या <strong>अवरुद्ध</strong> करते हैं। भावबल (जो भाव की अन्तर्निहित शक्ति मापता है) से भिन्न, अर्गला <strong>बाह्य शक्तियों</strong> को दर्शाती है।</p>
                    <p><strong>कैसे काम करती है:</strong> किसी भाव से 2, 4, 5, 8, 11वें भाव के ग्रह <strong>अर्गला</strong> (समर्थन) बनाते हैं। 12, 10, 9, 6, 3वें भाव के ग्रह <strong>विरोध अर्गला</strong> बनाते हैं। सभी हस्तक्षेप समान नहीं — <strong>केवल बलवान समर्थन और बलवान विरोध</strong> निर्णय निर्धारित करते हैं। एक भाव में विरोधी अधिक हो सकते हैं फिर भी &quot;समर्थित&quot; हो यदि समर्थक अधिक बलवान हैं।</p>
                    <p><strong>भावबल और अर्गला में अन्तर क्यों:</strong> एक भाव अन्तर्निहित रूप से बलवान (उच्च भावबल) हो सकता है फिर भी बाह्य अवरोध (अर्गला) झेल सकता है। उदाहरण: बलवान 7वाँ भाव + अर्गला अवरोध = विवाह की क्षमता उत्कृष्ट, पर बाहरी परिस्थितियाँ बाधा डालती हैं।</p>
                    <p><strong>उपयोग:</strong></p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong className="text-emerald-400">समर्थित भाव</strong> — जहाँ ग्रह सक्रिय रूप से सहायता करते हैं। इन क्षेत्रों में प्रयास करें।</li>
                      <li><strong className="text-red-400">अवरुद्ध भाव</strong> — ग्रह प्रतिरोध। स्थायी नहीं — उपायों से घर्षण कम होता है।</li>
                      <li><strong className="text-amber-400">तटस्थ भाव</strong> — सन्तुलित। परिणाम आपके प्रयास पर निर्भर।</li>
                    </ul>
                  </div>
                )}
              </InfoBlock>

              {/* ── Narrative Synthesis ── */}
              {(() => {
                const neutral = kundali.argala.filter(a => a.netEffect === 'neutral');
                const LIFE_AREAS: Record<number, { en: string; hi: string }> = {
                  1: { en: 'health and personality', hi: 'स्वास्थ्य और व्यक्तित्व' },
                  2: { en: 'wealth and family', hi: 'धन और परिवार' },
                  3: { en: 'courage and communication', hi: 'साहस और संवाद' },
                  4: { en: 'home and emotional peace', hi: 'घर और मानसिक शान्ति' },
                  5: { en: 'children and education', hi: 'सन्तान और शिक्षा' },
                  6: { en: 'health challenges and competition', hi: 'स्वास्थ्य चुनौतियाँ और प्रतिस्पर्धा' },
                  7: { en: 'marriage and partnerships', hi: 'विवाह और साझेदारी' },
                  8: { en: 'longevity and transformation', hi: 'दीर्घायु और परिवर्तन' },
                  9: { en: 'fortune and spiritual growth', hi: 'भाग्य और आध्यात्मिक विकास' },
                  10: { en: 'career and public reputation', hi: 'कैरियर और सार्वजनिक प्रतिष्ठा' },
                  11: { en: 'income and fulfillment of desires', hi: 'आय और इच्छापूर्ति' },
                  12: { en: 'spiritual liberation and foreign connections', hi: 'मोक्ष और विदेश सम्बन्ध' },
                };
                const lk = locale === 'en' || isTamil ? 'en' : 'hi';
                const supportedAreas = supported.map(a => LIFE_AREAS[a.house][lk]).slice(0, 4);
                const obstructedAreas = obstructed.map(a => LIFE_AREAS[a.house][lk]).slice(0, 3);

                return (
                  <div className="rounded-xl border border-gold-primary/20 bg-gradient-to-br from-[#1a1040]/60 to-[#0a0e27] p-5 sm:p-6">
                    <h4 className="text-gold-light text-base font-bold mb-3" style={headingFont}>
                      {locale === 'en' || isTamil ? 'Your Argala Summary' : 'आपका अर्गला सारांश'}
                    </h4>

                    {/* Counts */}
                    <div className="flex justify-center gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-400">{supported.length}</div>
                        <div className="text-xs text-emerald-400/70">{locale === 'en' || isTamil ? 'Supported' : 'समर्थित'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-400">{neutral.length}</div>
                        <div className="text-xs text-amber-400/70">{locale === 'en' || isTamil ? 'Neutral' : 'तटस्थ'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-400">{obstructed.length}</div>
                        <div className="text-xs text-red-400/70">{locale === 'en' || isTamil ? 'Obstructed' : 'अवरुद्ध'}</div>
                      </div>
                    </div>

                    {/* Narrative */}
                    <div className="text-sm text-text-secondary leading-relaxed space-y-3" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {supported.length > 0 && (
                        <p>
                          {locale === 'en' || isTamil
                            ? <>Your chart shows <span className="text-emerald-400 font-semibold">strong planetary support</span> for {supportedAreas.join(', ')}. Planets positioned around these houses actively push energy toward them — efforts in these areas get natural cosmic momentum. These are your strengths; lean into them.</>
                            : <>आपकी कुण्डली में <span className="text-emerald-400 font-semibold">मजबूत ग्रह समर्थन</span> है — {supportedAreas.join(', ')} के लिए। इन भावों के आसपास स्थित ग्रह सक्रिय रूप से ऊर्जा देते हैं। ये आपकी शक्तियाँ हैं; इन पर ध्यान दें।</>
                          }
                        </p>
                      )}
                      {obstructed.length > 0 && (
                        <p>
                          {locale === 'en' || isTamil
                            ? <>However, <span className="text-red-400 font-semibold">{obstructedAreas.join(', ')}</span> face planetary resistance — counter-forces outweigh the support. This does not mean failure; it means these areas require <span className="text-gold-light">conscious effort, patience, and the specific remedies</span> listed below for each house.</>
                            : <>लेकिन <span className="text-red-400 font-semibold">{obstructedAreas.join(', ')}</span> को ग्रह प्रतिरोध का सामना है। इसका अर्थ विफलता नहीं; बल्कि इन क्षेत्रों में <span className="text-gold-light">सचेत प्रयास, धैर्य और नीचे दिए गए विशिष्ट उपायों</span> की आवश्यकता है।</>
                          }
                        </p>
                      )}
                      {obstructed.length === 0 && (
                        <p>
                          {locale === 'en' || isTamil
                            ? <><span className="text-emerald-400 font-semibold">No houses face net obstruction</span> — a rare and fortunate pattern. All life areas either receive active support or are neutrally balanced.</>
                            : <><span className="text-emerald-400 font-semibold">किसी भी भाव को शुद्ध अवरोध नहीं</span> — दुर्लभ और भाग्यशाली स्थिति। सभी जीवन क्षेत्र सक्रिय समर्थन या तटस्थता में हैं।</>
                          }
                        </p>
                      )}
                      <p className="text-text-tertiary text-xs">
                        {locale === 'en' || isTamil
                          ? 'Scroll down for house-by-house details with supporting/countering planets and specific remedies.'
                          : 'समर्थक/प्रतिकारक ग्रहों और विशिष्ट उपायों के साथ भाव-वार विवरण नीचे देखें।'}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Visual house cards with force balance bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {kundali.argala.map((ar) => {
                  const sig = HOUSE_SIGNIFICATIONS[ar.house - 1];
                  const remedy = OBSTRUCTION_REMEDIES[ar.house - 1];
                  const total = ar.argalas.length + ar.virodha.length;
                  const supportPct = total > 0 ? Math.round((ar.argalas.length / total) * 100) : 50;
                  const borderColor = ar.netEffect === 'supported' ? 'border-emerald-500/30' : ar.netEffect === 'obstructed' ? 'border-red-500/30' : 'border-gold-primary/15';
                  const glowColor = ar.netEffect === 'supported' ? 'shadow-emerald-500/5' : ar.netEffect === 'obstructed' ? 'shadow-red-500/5' : '';

                  return (
                  <motion.div key={ar.house}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ar.house * 0.04 }}
                    className={`rounded-xl border ${borderColor} ${glowColor} shadow-lg overflow-hidden bg-gradient-to-b from-[#1a1040]/60 to-[#0a0e27]`}
                  >
                    {/* House number + status badge */}
                    <div className="px-4 pt-4 pb-2 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${ar.netEffect === 'supported' ? 'text-emerald-400' : ar.netEffect === 'obstructed' ? 'text-red-400' : 'text-gold-light'}`}>
                            {ar.house}
                          </span>
                          <div>
                            <div className="text-gold-light text-sm font-semibold">{locale === 'en' || isTamil ? `House ${ar.house}` : `भाव ${ar.house}`}</div>
                            <div className="text-text-secondary/60 text-[10px] leading-tight" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                              {sig[locale === 'en' || isTamil ? 'en' : 'hi']}
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${ar.netEffect === 'supported' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' : ar.netEffect === 'obstructed' ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
                        {ar.netEffect === 'supported' ? '✓' : ar.netEffect === 'obstructed' ? '✗' : '='} {ar.netEffect === 'supported' ? (locale === 'en' || isTamil ? 'Supported' : 'समर्थित') : ar.netEffect === 'obstructed' ? (locale === 'en' || isTamil ? 'Blocked' : 'अवरुद्ध') : (locale === 'en' || isTamil ? 'Neutral' : 'तटस्थ')}
                      </span>
                    </div>

                    {/* Force balance bar — effective strength, not raw count */}
                    {total > 0 && (() => {
                      const effS = ar.argalas.filter(a => a.strength !== 'weak').length;
                      const effO = ar.virodha.filter(v => v.strength === 'strong').length;
                      const effT = effS + effO;
                      const effPct = effT > 0 ? Math.round((effS / effT) * 100) : 50;
                      return (
                      <div className="px-4 py-2">
                        <div className="flex items-center gap-2 text-[10px] text-text-secondary/50 mb-1">
                          <span className="text-emerald-400 font-semibold">{effS} {locale === 'en' || isTamil ? 'strong support' : 'बलवान समर्थन'}</span>
                          <span className="flex-1 text-center text-text-tertiary/40">{ar.argalas.length} vs {ar.virodha.length} {locale === 'en' || isTamil ? 'total' : 'कुल'}</span>
                          <span className="text-red-400 font-semibold">{effO} {locale === 'en' || isTamil ? 'strong oppose' : 'बलवान प्रतिकार'}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-red-500/20 overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500/60 transition-all duration-700" style={{ width: `${effPct}%` }} />
                        </div>
                      </div>
                      );
                    })()}

                    {/* Planet icons — support vs opposition */}
                    <div className="px-4 py-2 space-y-1.5">
                      {ar.argalas.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-emerald-500/50 text-[10px]">▲</span>
                          {ar.argalas.map((a, idx) => (
                            <span key={idx} className="inline-flex items-center gap-0.5">
                              <GrahaIconById id={a.planetId} size={16} />
                              <span className="text-emerald-300 text-[10px] font-medium">{(a.planetName[locale as Locale] || a.planetName.en).slice(0, 3)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      {ar.virodha.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-red-500/50 text-[10px]">▼</span>
                          {ar.virodha.map((v, idx) => (
                            <span key={idx} className="inline-flex items-center gap-0.5">
                              <GrahaIconById id={v.planetId} size={16} />
                              <span className="text-red-400/70 text-[10px] font-medium">{(v.planetName[locale as Locale] || v.planetName.en).slice(0, 3)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      {total === 0 && (
                        <div className="text-text-tertiary text-xs py-1">{locale === 'en' || isTamil ? 'No intervention' : 'कोई हस्तक्षेप नहीं'}</div>
                      )}
                    </div>

                    {/* Remedy for obstructed */}
                    {ar.netEffect === 'obstructed' && (
                      <div className="px-4 pb-3 pt-1 border-t border-red-500/10">
                        <p className="text-amber-400/60 text-[10px] leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          <span className="font-bold">{locale === 'en' || isTamil ? 'Remedy: ' : 'उपाय: '}</span>{remedy[locale === 'en' || isTamil ? 'en' : 'hi']}
                        </p>
                      </div>
                    )}
                  </motion.div>
                  );
                })}
              </div>
            </div>
            );
          })()}

          {/* ===== SPHUTAS TAB ===== */}
          {activeTab === 'sphutas' && kundali.sphutas && (<a href={`/${locale}/learn/sphutas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">{locale === 'en' || isTamil ? 'Learn about Sphutas \u2192' : 'स्फुट के बारे में जानें \u2192'}</a>)}
          {activeTab === 'sphutas' && kundali.sphutas && (
            <SphutasTab kundali={kundali} locale={locale as Locale} isDevanagari={isDevanagari} headingFont={headingFont} sphuataTransitData={sphuataTransitData} />
          )}

          {/* ===== CHAT TAB ===== */}
          {activeTab === 'chat' && (
            <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading...</div>}>
              <ChartChatTab kundali={kundali} locale={locale as Locale} headingFont={headingFont} />
            </Suspense>
          )}

          {/* ===== SADE SATI TAB ===== */}
          {activeTab === 'sadesati' && kundali.sadeSati && (
            <div className="space-y-6">
              <a href={`/${locale}/learn/sade-sati`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Sade Sati \u2192' : 'साढ़े साती के बारे में जानें \u2192'}
              </a>
              <InfoBlock id="kundali-sadesati" title={locale === 'en' || isTamil ? 'What is Sade Sati and why 7.5 years?' : 'साढ़े साती क्या है और 7.5 वर्ष क्यों?'}>
                {locale === 'en' || isTamil ? (
                  <div className="space-y-2">
                    <p><strong>Sade Sati</strong> (&quot;seven and a half&quot;) is the ~7.5-year period when Saturn transits three consecutive signs around your Moon — the 12th (before), 1st (over), and 2nd (after) from your natal Moon sign. Saturn takes ~2.5 years per sign, totaling ~7.5 years.</p>
                    <p><strong>Why the Moon?</strong> Your Moon sign represents your mind and emotions. Saturn&apos;s transit over it pressures your emotional foundation — not as punishment, but as deep maturation.</p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong>Rising (12th)</strong> — Financial pressures, hidden anxieties, sleep issues</li>
                      <li><strong>Peak (over Moon)</strong> — Most intense: mental pressure, relationship tests, but deepest growth</li>
                      <li><strong>Setting (2nd)</strong> — Easing strain, family/speech matters, Saturn leaves wisdom behind</li>
                    </ul>
                    <p className="text-xs text-gold-primary/50">Not always negative — effects depend on Saturn&apos;s natal position, Moon&apos;s strength, and current dasha. Many achieve breakthroughs during Sade Sati. Occurs 2-3 times in a lifetime (~every 30 years).</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p><strong>साढ़े साती</strong> वह ~7.5 वर्ष की अवधि है जब शनि चन्द्र राशि के आसपास तीन राशियों से गुजरता है — 12वीं, 1ली और 2री। शनि ~2.5 वर्ष प्रति राशि लेता है।</p>
                    <p><strong>चन्द्रमा क्यों?</strong> चन्द्र राशि मन और भावनाओं का प्रतिनिधित्व करती है। शनि का गोचर भावनात्मक नींव पर दबाव डालता है — दण्ड नहीं, गहन परिपक्वता।</p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
                      <li><strong>आरम्भ (12वाँ)</strong> — आर्थिक दबाव, छिपी चिन्ताएँ</li>
                      <li><strong>चरम (चन्द्र पर)</strong> — सबसे तीव्र: मानसिक दबाव, किन्तु सबसे गहन विकास</li>
                      <li><strong>अवसान (2रा)</strong> — दबाव कम, शनि ज्ञान छोड़कर जाता है</li>
                    </ul>
                    <p className="text-xs text-gold-primary/50">सदैव नकारात्मक नहीं — प्रभाव शनि की जन्म स्थिति और दशा पर निर्भर। जीवन में 2-3 बार आती है।</p>
                  </div>
                )}
              </InfoBlock>
              <SadeSatiTab sadeSati={kundali.sadeSati} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
            </div>
          )}

          {/* ===== JAIMINI TAB ===== */}
          {activeTab === 'jaimini' && kundali.jaimini && (<a href={`/${locale}/learn/jaimini`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">{locale === 'en' || isTamil ? 'Learn about Jaimini \u2192' : 'जैमिनी के बारे में जानें \u2192'}</a>)}
          {activeTab === 'jaimini' && kundali.jaimini && (
            <JaiminiTab kundali={kundali} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
          )}

          {/* ===== LIFE TIMELINE TAB ===== */}
          {activeTab === 'timeline' && (
            <>
              <a href={`/${locale}/learn/dashas`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">
                {locale === 'en' || isTamil ? 'Learn about Dashas \u2192' : 'दशा के बारे में जानें \u2192'}
              </a>
              <Suspense fallback={<div className="text-center py-8 text-text-secondary">Loading timeline...</div>}>
                <LifeTimeline
                  kundali={kundali}
                  locale={locale}
                  isDevanagari={isDevanagari}
                  headingFont={headingFont}
                />
              </Suspense>
            </>
          )}

          {/* ===== PATRIKA TAB ===== */}
          {activeTab === 'patrika' && (<a href={`/${locale}/learn/patrika`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-3">{locale === 'en' || isTamil ? 'Learn about Patrika \u2192' : 'पत्रिका के बारे में जानें \u2192'}</a>)}
          {activeTab === 'patrika' && (
            <Suspense fallback={<div className="text-center py-12 text-text-secondary">Loading...</div>}>
              <PatrikaTab kundali={kundali} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} tip={tip} chartStyle={chartStyle} retrogradeIds={retrogradeIds} combustIds={combustIds} />
            </Suspense>
          )}

        </motion.div>
      )}
    </div>
  );
}

function AshtakavargaTab({ ashtakavarga, locale, isDevanagari, headingFont, t }: {
  ashtakavarga: AshtakavargaData; locale: Locale; isDevanagari: boolean;
  headingFont: React.CSSProperties; t: (key: string) => string;
}) {
  const isTamil = String(locale) === 'ta';
  const [viewMode, setViewMode] = useState<'sav' | 'bpi'>('sav');

  // Compute insights from SAV
  const strongSigns = RASHIS.filter((_, i) => ashtakavarga.savTable[i] >= 28).map(r => tl(r.name, locale));
  const weakSigns = RASHIS.filter((_, i) => ashtakavarga.savTable[i] < 22).map(r => tl(r.name, locale));
  const strongSignIds = RASHIS.filter((_, i) => ashtakavarga.savTable[i] >= 28).map(r => r.id);
  const weakSignIds = RASHIS.filter((_, i) => ashtakavarga.savTable[i] < 22).map(r => r.id);

  // Compute transit windows for slow planets through strong AND weak signs
  type TransitEntry = { planet: string; planetId: number; sign: string; period: string; startYear: number; startMonth: number; endYear: number; endMonth: number; type: 'strong' | 'weak' };
  const allTransits = useMemo(() => {
    const targetIds = [...strongSignIds.map(id => ({ id, type: 'strong' as const })), ...weakSignIds.map(id => ({ id, type: 'weak' as const }))];
    if (targetIds.length === 0) return [] as TransitEntry[];
    const results: TransitEntry[] = [];
    const slowPlanets = [
      { id: 6, name: { en: 'Saturn', hi: 'शनि' } },
      { id: 4, name: { en: 'Jupiter', hi: 'बृहस्पति' } },
      { id: 7, name: { en: 'Rahu', hi: 'राहु' } },
    ];
    const now = new Date();
    const startJd = dateToJD(now.getFullYear(), now.getMonth() + 1, 15, 12);
    const monthsToScan = 180;

    for (const planet of slowPlanets) {
      for (const target of targetIds) {
        let entryMonth: string | null = null;
        let entryDate: Date | null = null;
        let lastInSign = false;

        for (let m = 0; m <= monthsToScan; m++) {
          const jd = startJd + m * 30.44;
          const positions = getPlanetaryPositions(jd);
          const pos = positions.find(p => p.id === planet.id);
          if (!pos) continue;
          const sidLon = toSidereal(pos.longitude, jd);
          const sign = Math.floor(sidLon / 30) + 1;
          const inSign = sign === target.id;

          if (inSign && !lastInSign) {
            entryDate = new Date(now.getTime() + m * 30.44 * 24 * 3600000);
            entryMonth = entryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          }
          if (!inSign && lastInSign && entryMonth && entryDate) {
            const exitDate = new Date(now.getTime() + m * 30.44 * 24 * 3600000);
            const exitMonth = exitDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            results.push({
              planet: planet.name[locale === 'en' || isTamil ? 'en' : 'hi'], planetId: planet.id,
              sign: tl(RASHIS[target.id - 1].name, locale), period: `${entryMonth} – ${exitMonth}`,
              startYear: entryDate.getFullYear(), startMonth: entryDate.getMonth(),
              endYear: exitDate.getFullYear(), endMonth: exitDate.getMonth(), type: target.type,
            });
            entryMonth = null; entryDate = null;
          }
          lastInSign = inSign;
        }
        if (lastInSign && entryMonth && entryDate) {
          const scanEnd = new Date(now.getTime() + monthsToScan * 30.44 * 24 * 3600000);
          results.push({
            planet: planet.name[locale === 'en' || isTamil ? 'en' : 'hi'], planetId: planet.id,
            sign: tl(RASHIS[target.id - 1].name, locale), period: `${entryMonth} – ...`,
            startYear: entryDate.getFullYear(), startMonth: entryDate.getMonth(),
            endYear: scanEnd.getFullYear(), endMonth: scanEnd.getMonth(), type: target.type,
          });
        }
      }
    }
    // Sort chronologically
    results.sort((a, b) => a.startYear * 12 + a.startMonth - b.startYear * 12 - b.startMonth);
    return results;
  }, [strongSignIds, weakSignIds, locale]);
  const weakTransits = allTransits.filter(t => t.type === 'weak');
  const strongTransits = allTransits.filter(t => t.type === 'strong');
  const totalBindu = ashtakavarga.savTable.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>{t('ashtakavarga')}</h3>

      {/* What is Ashtakavarga */}
      <InfoBlock
        id="kundali-ashtakavarga"
        title={locale === 'en' || isTamil ? 'What is Ashtakavarga and how does it affect you?' : 'अष्टकवर्ग क्या है और यह आपको कैसे प्रभावित करता है?'}
        defaultOpen={false}
      >
        {locale === 'en' || isTamil ? (
          <div className="space-y-3">
            <p><strong>Ashtakavarga</strong> is a point-based system that tells you which zodiac signs are <em>lucky zones</em> for transiting planets to pass through — and which are challenging. Every planet in your birth chart casts "votes" (called <strong>bindus</strong>) to every sign. The sign that gets the most votes is the most receptive for planetary transits.</p>
            <p><strong>Reading the score (what the numbers mean for YOU):</strong></p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-emerald-400">30+ bindus</strong> — Excellent zone. When a planet transits this sign, it brings its best results. Great time to launch ventures, make investments, or take action in that planet&apos;s domain.</li>
              <li><strong className="text-amber-300">25–29 bindus</strong> — Above average. Generally favourable transits with some friction.</li>
              <li><strong className="text-text-secondary">22–24 bindus</strong> — Average. Mixed results — modest gains, no major setbacks.</li>
              <li><strong className="text-red-400">Below 22 bindus</strong> — Weak zone. Planets transiting here underperform. Saturn or Rahu transiting a weak sign can be a difficult period — plan conservatively.</li>
            </ul>
            <p><strong>Practical examples:</strong></p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>Jupiter (wealth/wisdom) transiting a sign with 30+ bindus = excellent year for education, spiritual growth, and financial gains.</li>
              <li>Saturn transiting a sign with &lt;22 bindus = a challenging 2.5-year stretch — not a time to take on heavy debt or risky ventures.</li>
              <li>Your current transits page shows where planets are NOW — cross-reference with your bindus for precise timing.</li>
            </ul>
            <p><strong>SAV vs BPI:</strong> SAV (Sarvashtakavarga) = total votes for each sign from ALL planets combined — your general lucky/unlucky sign map. BPI (Bhinnashtakavarga) = each planet&apos;s individual score — more specific, used when checking a specific planet&apos;s transit.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>अष्टकवर्ग</strong> एक बिन्दु-आधारित पद्धति है जो बताती है कि गोचर ग्रहों के लिए कौन-सी राशियाँ <em>शुभ क्षेत्र</em> हैं। आपकी जन्म कुण्डली के प्रत्येक ग्रह प्रत्येक राशि को &quot;बिन्दु&quot; (शुभ अंक) देते हैं।</p>
            <p><strong>स्कोर का अर्थ (आपके लिए):</strong></p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-emerald-400">30+ बिन्दु</strong> — उत्कृष्ट क्षेत्र। जब कोई ग्रह इस राशि से गुजरे, तो नए कार्य, निवेश और उद्यम शुरू करें।</li>
              <li><strong className="text-amber-300">25–29 बिन्दु</strong> — औसत से ऊपर। सामान्यतः अनुकूल।</li>
              <li><strong className="text-text-secondary">22–24 बिन्दु</strong> — औसत। मिश्रित परिणाम।</li>
              <li><strong className="text-red-400">22 से कम बिन्दु</strong> — कमज़ोर क्षेत्र। यहाँ से गुजरने वाले ग्रह कम फल देते हैं। शनि/राहु का गोचर कठिन हो सकता है।</li>
            </ul>
            <p><strong>SAV बनाम BPI:</strong> SAV = सभी ग्रहों का कुल स्कोर (समग्र शुभ/अशुभ राशि नक्शा)। BPI = प्रत्येक ग्रह का व्यक्तिगत स्कोर — किसी विशेष ग्रह गोचर की जाँच हेतु।</p>
          </div>
        )}
      </InfoBlock>

      {/* Quick insight */}
      {(strongSigns.length > 0 || weakSigns.length > 0) && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
          <h4 className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-3">{locale === 'en' || isTamil ? 'Quick Insight' : 'संक्षिप्त अन्तर्दृष्टि'}</h4>
          <div className="space-y-2 text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {strongSigns.length > 0 && (
              <p className="text-emerald-400/80">
                {locale === 'en' || isTamil
                  ? `Strong signs (28+ bindu): ${strongSigns.join(', ')} — planets transiting these signs bring favorable results.`
                  : `बलवान राशियाँ (28+ बिन्दु): ${strongSigns.join(', ')} — इन राशियों में गोचर शुभ फल देते हैं।`}
              </p>
            )}
            {weakSigns.length > 0 && (
              <div>
                <p className="text-red-400/70">
                  {locale === 'en' || isTamil
                    ? `Weak signs (<22 bindu): ${weakSigns.join(', ')} — transits through these signs may bring challenges.`
                    : `दुर्बल राशियाँ (<22 बिन्दु): ${weakSigns.join(', ')} — इन राशियों में गोचर चुनौतीपूर्ण हो सकते हैं।`}
                </p>
                {/* Transit timeline is rendered below, outside the weak/strong text blocks */}
              </div>
            )}
            <p className="text-text-secondary/70 text-xs">
              {locale === 'en' || isTamil
                ? `Total SAV: ${totalBindu} (average: ${Math.round(totalBindu / 12)} per sign). Values above 28 are strong, below 22 are weak.`
                : `कुल SAV: ${totalBindu} (औसत: ${Math.round(totalBindu / 12)} प्रति राशि)। 28 से ऊपर बलवान, 22 से नीचे दुर्बल।`}
            </p>
          </div>
        </div>
      )}

      {/* Transit Timeline — strong + weak periods */}
      {allTransits.length > 0 && (() => {
        const minY = Math.min(...allTransits.map(t => t.startYear));
        const maxY = Math.max(...allTransits.map(t => t.endYear));
        const totalMonths = (maxY - minY) * 12 + 12;
        const toPercent = (y: number, m: number) => Math.max(0, Math.min(100, ((y - minY) * 12 + m) / totalMonths * 100));
        const years: number[] = [];
        for (let y = minY; y <= maxY; y++) years.push(y);
        // Group transits by planet for a cleaner layout
        const planetGroups = [
          { id: 4, name: locale === 'en' || isTamil ? 'Jupiter' : 'बृहस्पति' },
          { id: 6, name: locale === 'en' || isTamil ? 'Saturn' : 'शनि' },
          { id: 7, name: locale === 'en' || isTamil ? 'Rahu' : 'राहु' },
        ];
        const PLANET_TEXT: Record<number, string> = { 4: 'text-amber-300', 6: 'text-indigo-300', 7: 'text-slate-300' };
        return (
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-5">
            <h4 className="text-gold-light text-sm font-bold mb-1">{locale === 'en' || isTamil ? 'Transit Forecast — Next 15 Years' : 'गोचर पूर्वानुमान — अगले 15 वर्ष'}</h4>
            <p className="text-text-secondary/60 text-xs mb-4">
              {locale === 'en' || isTamil
                ? 'Green = transiting your strong signs (favorable). Red = transiting your weak signs (challenging).'
                : 'हरा = आपकी बलवान राशियों में गोचर (शुभ)। लाल = दुर्बल राशियों में गोचर (चुनौतीपूर्ण)।'}
            </p>
            {/* Year axis + swim lanes wrapper */}
            <div className="relative overflow-x-auto">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0a0e27] to-transparent sm:hidden z-10" />
            <div className="min-w-[320px] sm:min-w-[480px]">
            {/* Year axis */}
            <div className="relative h-5 mb-1 ml-14 sm:ml-16">
              {years.map(y => (
                <span key={y} className="absolute text-[9px] text-gray-600 font-mono -translate-x-1/2" style={{ left: `${toPercent(y, 0)}%` }}>
                  {`'${String(y).slice(2)}`}
                </span>
              ))}
            </div>
            {/* Per-planet swim lanes */}
            <div className="space-y-3">
              {planetGroups.map(pg => {
                const transits = allTransits.filter(t => t.planetId === pg.id);
                if (transits.length === 0) return null;
                return (
                  <div key={pg.id}>
                    <div className="flex items-center gap-0">
                      <div className="w-14 sm:w-16 shrink-0 text-right pr-2">
                        <span className={`text-[10px] font-bold ${PLANET_TEXT[pg.id] || 'text-gray-400'}`}>{pg.name}</span>
                      </div>
                      <div className="flex-1 relative h-6 bg-bg-tertiary/15 rounded-md overflow-hidden">
                        {/* Grid lines */}
                        {years.map(y => (
                          <div key={y} className="absolute top-0 bottom-0 border-l border-white/[0.03]" style={{ left: `${toPercent(y, 0)}%` }} />
                        ))}
                        {/* Transit bars with date tooltips */}
                        {transits.map((tr, idx) => {
                          const left = toPercent(tr.startYear, tr.startMonth);
                          const right = toPercent(tr.endYear, tr.endMonth);
                          const width = Math.max(right - left, 1);
                          const isStrong = tr.type === 'strong';
                          const barClass = isStrong ? 'bg-emerald-500/70 hover:bg-emerald-500/90' : 'bg-red-500/70 hover:bg-red-500/90';
                          return (
                            <div key={idx} className={`absolute top-0.5 bottom-0.5 rounded-sm ${barClass} cursor-default group/bar transition-colors`} style={{ left: `${left}%`, width: `${width}%` }} title={`${tr.sign}: ${tr.period}`}>
                              {width > 5 && (
                                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/90 truncate px-0.5">
                                  {tr.sign}
                                </span>
                              )}
                              {/* Hover tooltip with exact dates */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/bar:block z-10 pointer-events-none">
                                <div className="bg-bg-primary/95 border border-gold-primary/20 rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
                                  <span className={`text-[9px] font-bold ${isStrong ? 'text-emerald-400' : 'text-red-400'}`}>{tr.sign}</span>
                                  <span className="text-[9px] text-gray-400 ml-1">{tr.period}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {/* NOW marker */}
                        <div className="absolute top-0 bottom-0 w-px bg-gold-primary/80" style={{ left: `${toPercent(new Date().getFullYear(), new Date().getMonth())}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>{/* close min-w wrapper */}
            </div>{/* close overflow-x-auto wrapper */}
            {/* Legend + NOW label */}
            <div className="flex items-center justify-between mt-3 ml-14 sm:ml-16">
              <div className="flex items-center gap-4 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-emerald-500/70" /><span className="text-gray-500">{locale === 'en' || isTamil ? 'Favorable' : 'शुभ'}</span></span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-red-500/70" /><span className="text-gray-500">{locale === 'en' || isTamil ? 'Challenging' : 'चुनौतीपूर्ण'}</span></span>
                <span className="flex items-center gap-1"><span className="w-px h-3 bg-gold-primary/80" /><span className="text-gold-primary/70">NOW</span></span>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="flex justify-center gap-3 mb-6">
        <button onClick={() => setViewMode('sav')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'sav' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'}`}>
          {t('sarvashtakavarga')}
        </button>
        <button onClick={() => setViewMode('bpi')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'bpi' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'}`}>
          {t('bhinnashtakavarga')}
        </button>
      </div>

      {viewMode === 'sav' ? (
        <div className="space-y-6">
          {/* SAV — combined visual grid with integrated bars */}
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6">
            <h4 className="text-gold-light text-lg font-semibold mb-1" style={headingFont}>{t('sarvashtakavarga')}</h4>
            <p className="text-text-secondary/70 text-xs mb-4">
              {locale === 'en' || isTamil ? 'Total bindu per sign. ≥28 = strong (green), <22 = weak (red).' : 'प्रति राशि कुल बिन्दु। ≥28 = बलवान (हरा), <22 = दुर्बल (लाल)।'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
              {RASHIS.map((r, i) => {
                const val = ashtakavarga.savTable[i];
                const strong = val >= 28;
                const weak = val < 22;
                const pct = Math.round((val / 56) * 100);
                const barColor = strong ? 'bg-emerald-500/60' : weak ? 'bg-red-500/50' : 'bg-gold-primary/40';
                const borderColor = strong ? 'border-emerald-500/40' : weak ? 'border-red-500/30' : 'border-gold-primary/15';
                const bgColor = strong ? 'bg-emerald-500/8' : weak ? 'bg-red-500/5' : 'bg-bg-tertiary/30';
                return (
                  <motion.div key={r.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`rounded-xl p-3 text-center border ${borderColor} ${bgColor} relative overflow-hidden`}
                  >
                    {/* Background fill bar — proportional to bindu value */}
                    <div className={`absolute bottom-0 left-0 right-0 ${barColor} transition-all duration-700`} style={{ height: `${pct}%` }} />
                    {/* Content on top of bar */}
                    <div className="relative z-10">
                      <RashiIconById id={r.id} size={32} />
                      <div className="text-sm font-semibold text-text-secondary mt-1.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(r.name, locale)}</div>
                      <div className={`text-2xl font-bold mt-1 ${strong ? 'text-emerald-300' : weak ? 'text-red-300' : 'text-gold-light'}`}>{val}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-5 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500/60" />{locale === 'en' || isTamil ? '≥28 Strong' : '≥28 बलवान'}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gold-primary/40" />{locale === 'en' || isTamil ? '22–27 Average' : '22–27 औसत'}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500/50" />{locale === 'en' || isTamil ? '<22 Weak' : '<22 दुर्बल'}</span>
            </div>
            <div className="text-center text-text-secondary text-sm font-semibold mt-3">
              {t('totalBindu')}: {ashtakavarga.savTable.reduce((a, b) => a + b, 0)}
            </div>
          </div>

          {/* Trikona Shodhana */}
          {(() => {
            // Trikona Shodhana: subtract minimum of each trikona group (signs 1-5-9, 2-6-10, 3-7-11, 4-8-12)
            const sav = ashtakavarga.savTable;
            const trikonas = [[0,4,8],[1,5,9],[2,6,10],[3,7,11]];
            const afterTrikona = [...sav];
            trikonas.forEach(trio => {
              const mn = Math.min(sav[trio[0]], sav[trio[1]], sav[trio[2]]);
              trio.forEach(i => { afterTrikona[i] = sav[i] - mn; });
            });
            // Ekadhipatya Shodhana: signs with same lord
            // Mars: 1,8 | Venus: 2,7 | Mercury: 3,6 | Moon: 4 | Sun: 5 | Jupiter: 9,12 | Saturn: 10,11
            const SHARED_LORDS = [[0,7],[1,6],[2,5],[9,11]]; // 0-based sign pairs sharing a lord
            const shodhana = [...afterTrikona];
            SHARED_LORDS.forEach(([a, b]) => {
              const mn = Math.min(afterTrikona[a], afterTrikona[b]);
              shodhana[a] = afterTrikona[a] - mn;
              shodhana[b] = afterTrikona[b] - mn;
            });
            return (
              <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
                <h4 className="text-gold-light font-semibold text-sm mb-1" style={headingFont}>
                  {locale === 'en' || isTamil ? 'Trikona + Ekadhipatya Shodhana (Refined SAV)' : 'त्रिकोण + एकाधिपत्य शोधन (परिष्कृत SAV)'}
                </h4>
                <p className="text-text-secondary/70 text-xs mb-4">
                  {locale === 'en' || isTamil
                    ? 'After subtracting trikona minimums and ekadhipatya excess — the essential signal. Higher = genuinely strong for transits.'
                    : 'त्रिकोण न्यूनतम और एकाधिपत्य अधिक्य घटाने के बाद — मूल संकेत। अधिक = गोचर के लिए वास्तविक बलवान।'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5">
                  {RASHIS.map((r, i) => {
                    const val = shodhana[i];
                    const color = val >= 5 ? 'text-emerald-400' : val <= 1 ? 'text-red-400' : 'text-gold-primary/80';
                    return (
                      <div key={r.id} className="text-center p-2 rounded-lg bg-bg-secondary/30 border border-gold-primary/8">
                        <div className="text-[9px] text-text-secondary/65 mb-0.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(r.name, locale).slice(0, 3)}</div>
                        <div className={`text-lg font-bold font-mono ${color}`}>{val}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 overflow-x-auto">
          <h4 className="text-gold-light text-lg font-semibold mb-4" style={headingFont}>{t('bhinnashtakavarga')}</h4>
          <p className="text-text-secondary text-xs mb-4">
            {locale === 'en' || isTamil ? 'Individual planet bindu points per sign (max 8 per cell).' : 'प्रत्येक ग्रह के बिन्दु प्रति राशि (अधिकतम 8 प्रति कक्ष)।'}
          </p>
          <div className="min-w-[320px] sm:min-w-[640px]">
            <table className="w-full text-[10px] sm:text-xs md:text-sm">
              <thead>
                <tr>
                  <th className="text-left text-gold-dark text-xs p-2">{locale === 'en' || isTamil ? 'Planet' : 'ग्रह'}</th>
                  {RASHIS.map(r => (
                    <th key={r.id} className="text-center p-1">
                      <div className="flex flex-col items-center">
                        <RashiIconById id={r.id} size={16} />
                        <span className="text-xs text-text-secondary/75 mt-0.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(r.name, locale).slice(0, 3)}</span>
                      </div>
                    </th>
                  ))}
                  <th className="text-center text-gold-dark text-xs p-2">{locale === 'en' || isTamil ? 'Total' : 'कुल'}</th>
                </tr>
              </thead>
              <tbody>
                {ashtakavarga.bpiTable.map((row, pi) => {
                  const graha = GRAHAS[pi];
                  const total = row.reduce((a, b) => a + b, 0);
                  return (
                    <tr key={pi} className="border-t border-gold-primary/5">
                      <td className="p-2">
                        <div className="flex items-center gap-1.5">
                          <GrahaIconById id={pi} size={20} />
                          <span className="text-xs font-medium" style={{ color: graha.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}>{tl(graha.name, locale)}</span>
                        </div>
                      </td>
                      {row.map((val, si) => (
                        <td key={si} className="text-center p-1">
                          <span className={`text-xs font-mono ${val >= 5 ? 'text-emerald-400' : val <= 2 ? 'text-red-400/70' : 'text-text-secondary'}`}>{val}</span>
                        </td>
                      ))}
                      <td className="text-center p-2 font-bold text-gold-light text-xs">{total}</td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-gold-primary/20">
                  <td className="p-2 font-bold text-gold-dark text-xs">SAV</td>
                  {ashtakavarga.savTable.map((val, si) => (
                    <td key={si} className="text-center p-1">
                      <span className={`text-xs font-bold ${val >= 28 ? 'text-emerald-400' : val < 22 ? 'text-red-400' : 'text-gold-light'}`}>{val}</span>
                    </td>
                  ))}
                  <td className="text-center p-2 font-bold text-gold-primary text-sm">{ashtakavarga.savTable.reduce((a, b) => a + b, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function YearPredictionsSection({ tip, locale, isDevanagari, headingFont, tTip }: {
  tip: TippanniContent; locale: Locale; isDevanagari: boolean;
  headingFont: React.CSSProperties; tTip: (key: string) => string;
}) {
  const isTamil = String(locale) === 'ta';
  const [expandedRemedyIdx, setExpandedRemedyIdx] = useState<number | null>(null);
  const yp = tip.yearPredictions;

  const impactColors: Record<string, string> = {
    favorable: 'bg-emerald-500',
    mixed: 'bg-amber-500',
    challenging: 'bg-red-500',
  };
  const impactBadge: Record<string, string> = {
    favorable: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    mixed: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    challenging: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  const impactLabel = (impact: string) => tTip(impact);

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div className="text-center">
        <h3 className="text-2xl text-gold-gradient font-bold" style={headingFont}>
          {yp.year} {tTip('yearPredictions')}
        </h3>
      </div>

      {/* Overview card */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8 border-2 border-gold-primary/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-primary/0 via-gold-primary to-gold-primary/0" />
        <h4 className="text-gold-primary text-sm uppercase tracking-wider mb-3 font-semibold">{tTip('yearOverview')}</h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {yp.overview}
        </p>
      </div>

      {/* Events timeline */}
      {yp.events.length > 0 && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
          <h4 className="text-gold-light text-lg font-semibold mb-6" style={headingFont}>{tTip('majorEvents')}</h4>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-gold-primary/40 via-gold-primary/20 to-gold-primary/5" />

            <div className="space-y-6">
              {yp.events.map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative pl-9"
                >
                  {/* Impact dot */}
                  <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full ${impactColors[event.impact]} flex items-center justify-center`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-3 flex-wrap">
                      <h5 className="text-gold-light font-semibold text-sm flex-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                        {event.title}
                      </h5>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-text-secondary/75 text-xs font-mono">{event.period}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${impactBadge[event.impact]}`}>
                          {impactLabel(event.impact)}
                        </span>
                      </div>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {event.description}
                    </p>

                    {event.remedies && (
                      <div>
                        <button
                          onClick={() => setExpandedRemedyIdx(expandedRemedyIdx === i ? null : i)}
                          className="text-amber-400 text-xs hover:text-amber-300 transition-colors"
                        >
                          {expandedRemedyIdx === i ? tTip('hideRemedies') : tTip('showRemedies')}
                        </button>
                        <AnimatePresence>
                          {expandedRemedyIdx === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                                <p className="text-text-secondary text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                  {event.remedies}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quarterly forecast grid */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h4 className="text-gold-light text-lg font-semibold mb-6" style={headingFont}>{tTip('quarterlyOutlook')}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {yp.quarters.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg border ${
                q.outlook === 'favorable' ? 'border-emerald-500/20 bg-emerald-500/5'
                : q.outlook === 'challenging' ? 'border-red-500/20 bg-red-500/5'
                : 'border-amber-500/20 bg-amber-500/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gold-light text-sm font-semibold">{q.quarter}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${impactBadge[q.outlook]}`}>
                  {impactLabel(q.outlook)}
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {q.summary}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key advice */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8 border border-gold-primary/25 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <h4 className="text-gold-primary text-sm uppercase tracking-wider mb-3 font-semibold">{tTip('keyAdvice')}</h4>
        <p className="text-gold-light text-sm leading-relaxed font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {yp.keyAdvice}
        </p>
      </div>
    </section>
  );
}

function ClassicalReferencesBlock({ refs, locale, isDevanagari }: {
  refs: TippanniContent['planetInsights'][0]['classicalReferences'];
  locale: Locale;
  isDevanagari: boolean;
}) {
  const isTamil = String(locale) === 'ta';
  const [expanded, setExpanded] = useState(false);
  if (!refs) return null;

  const confidenceColors: Record<string, string> = {
    high: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    low: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  };

  return (
    <div className="mt-3 p-3 rounded-lg border-2 border-amber-600/20 bg-gradient-to-br from-amber-900/10 to-amber-800/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-amber-400 text-xs uppercase tracking-wider font-semibold">
            {locale === 'en' || isTamil ? 'Classical References' : locale === 'hi' ? 'शास्त्रीय सन्दर्भ' : 'शास्त्रीयसन्दर्भाः'}
          </span>
        </div>
        <span className={`text-xs px-1.5 py-0.5 rounded-full border ${confidenceColors[refs.confidence]}`}>
          {refs.confidence}
        </span>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
        {refs.summary}
      </p>
      {refs.citations.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-amber-400/70 text-xs hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {expanded
              ? (locale === 'en' || isTamil ? 'Hide citations' : 'सन्दर्भ छुपाएँ')
              : (locale === 'en' || isTamil ? `View ${refs.citations.length} citation${refs.citations.length > 1 ? 's' : ''}` : `${refs.citations.length} सन्दर्भ देखें`)
            }
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-2">
                  {refs.citations.map((cite, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-bg-primary/40 border border-amber-600/10">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-amber-400 text-xs font-bold">{cite.textName}</span>
                        {cite.verseRange && <span className="text-text-secondary/70 text-xs font-mono">{cite.verseRange}</span>}
                      </div>
                      {cite.sanskritExcerpt && (
                        <p className="text-amber-200/60 text-xs italic mb-1" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
                          {cite.sanskritExcerpt}
                        </p>
                      )}
                      <p className="text-text-secondary text-xs leading-relaxed">{cite.translationExcerpt}</p>
                      {cite.relevanceNote && (
                        <p className="text-amber-500/50 text-xs mt-1 italic">{cite.relevanceNote}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function VargaAnalysisTab({ kundali, locale, headingFont }: {
  kundali: KundaliData; locale: Locale; headingFont: React.CSSProperties;
}) {
  const synthesis = useMemo(() => generateVargaTippanni(kundali, locale), [kundali, locale]);
  const isHi = locale === 'hi';
  const [selectedVarga, setSelectedVarga] = useState<string | null>(null);
  const sC: Record<string, string> = { strong: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/20', weak: 'text-red-400 bg-red-500/10 border-red-500/20' };
  const sL: Record<string, { en: string; hi: string }> = { strong: { en: 'Strong', hi: 'बलवान' }, moderate: { en: 'Moderate', hi: 'मध्यम' }, weak: { en: 'Weak', hi: 'दुर्बल' } };
  const PLANET_NAMES_EN = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
  const PLANET_NAMES_HI = ['सूर्य','चन्द्र','मंगल','बुध','गुरु','शुक्र','शनि','राहु','केतु'];
  const selectedInsight = synthesis.vargaInsights.find(v => v.chart === selectedVarga);

  return (
    <div className="space-y-8">
      {/* Overall Synthesis */}
      <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
          {isHi ? 'वर्ग संश्लेषण — समस्त विभागीय चार्ट' : 'Varga Synthesis — All Divisional Charts'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{isHi ? synthesis.overall.hi : synthesis.overall.en}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {synthesis.strongAreas.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-2">{isHi ? 'बलवान क्षेत्र' : 'Strong Areas'}</div>
              {synthesis.strongAreas.map((a, i) => (
                <div key={i} className="text-emerald-300 text-xs mb-1">+ {isHi ? a.hi : a.en}</div>
              ))}
            </div>
          )}
          {synthesis.weakAreas.length > 0 && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
              <div className="text-red-400 text-xs uppercase tracking-wider font-bold mb-2">{isHi ? 'ध्यान देने योग्य' : 'Needs Attention'}</div>
              {synthesis.weakAreas.map((a, i) => (
                <div key={i} className="text-red-300 text-xs mb-1">- {isHi ? a.hi : a.en}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clickable strength grid */}
      <div>
        <h3 className="text-gold-light text-lg font-bold mb-2 text-center" style={headingFont}>
          {isHi ? 'वर्ग बल अवलोकन' : 'Varga Strength Overview'}
        </h3>
        <p className="text-text-secondary/60 text-xs text-center mb-4">
          {isHi ? 'विस्तृत विश्लेषण के लिए किसी चार्ट पर क्लिक करें' : 'Click any chart for detailed analysis'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-1.5">
          {synthesis.vargaInsights.map((v, i) => (
            <button key={i}
              onClick={() => setSelectedVarga(prev => prev === v.chart ? null : v.chart)}
              className={`rounded-lg p-2 border text-center transition-all cursor-pointer ${sC[v.strength]} ${selectedVarga === v.chart ? 'ring-2 ring-gold-primary/50 scale-105' : 'hover:scale-[1.03] hover:brightness-110'}`}
            >
              <div className="font-bold text-xs">{v.chart}</div>
              <div className="text-xs text-text-tertiary leading-tight mt-0.5">{isHi ? v.meaning.hi : v.meaning.en}</div>
              <div className="text-xs font-medium mt-0.5">{isHi ? sL[v.strength].hi : sL[v.strength].en}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected chart detailed commentary */}
      <AnimatePresence mode="wait">
        {selectedInsight && (
          <motion.div key={selectedInsight.chart}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-3 border-b border-gold-primary/10 ${sC[selectedInsight.strength].split(' ').slice(1).join(' ')}`}>
                <div className="flex items-center gap-3">
                  <span className="text-gold-light font-bold text-lg">{selectedInsight.chart}</span>
                  <span className="text-text-secondary text-xs">{isHi ? selectedInsight.label.hi : selectedInsight.label.en}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${sC[selectedInsight.strength]}`}>
                  {isHi ? sL[selectedInsight.strength].hi : sL[selectedInsight.strength].en}
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Overall Commentary */}
                <div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
                    {isHi ? 'समग्र टिप्पणी' : 'Overall Commentary'}
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed whitespace-pre-line">
                    {isHi ? selectedInsight.overallCommentary.hi : selectedInsight.overallCommentary.en}
                  </div>
                </div>

                {/* Key Findings */}
                {selectedInsight.keyFindings.length > 0 && (
                  <div>
                    <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
                      {isHi ? 'प्रमुख निष्कर्ष' : 'Key Findings'}
                    </div>
                    <div className="space-y-1">
                      {selectedInsight.keyFindings.map((f, j) => (
                        <div key={j} className="text-text-secondary text-xs leading-relaxed flex gap-2">
                          <span className="text-gold-dark mt-0.5 shrink-0">•</span>
                          <span>{isHi ? f.hi : f.en}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prognosis */}
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                  <div className="text-indigo-400 text-xs uppercase tracking-widest font-bold mb-2">
                    {isHi ? '1-2 वर्ष की प्रगति' : '1-2 Year Prognosis'}
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed">
                    {isHi ? selectedInsight.prognosis.hi : selectedInsight.prognosis.en}
                  </div>
                </div>
              </div>
            </div>

            {/* Deep-dive sections — only shown for the selected chart */}

            {/* D2 Hora */}
            {selectedVarga === 'D2' && (
              <>
      {/* P2-09: D2 Hora Chart — Full Classical Interpretation */}
      {(() => {
        const lagnaSign = kundali.ascendant.sign;
        // In Hora: odd signs (Ar,Ge,Le,Li,Sa,Aq) = Sun's hora; even signs = Moon's hora
        // Planet's Hora sign: degree 0-14.99 → same-sign hora; 15-29.99 → next-sign hora
        // Actually classical rule: Sun hora = Leo (odd signs for first half, even signs for second half)
        // Standard: degree 0-15 of odd sign = Sun; 15-30 = Moon. Even sign = opposite.
        const getHora = (planet: { planet: { id: number }; sign: number; longitude: number; isRetrograde: boolean }): 'sun' | 'moon' => {
          const signIsOdd = planet.sign % 2 === 1; // 1=Ar, 3=Ge etc
          const degInSign = planet.longitude % 30;
          const firstHalf = degInSign < 15;
          // Odd sign first half = Sun hora; second half = Moon hora
          // Even sign first half = Moon hora; second half = Sun hora
          return (signIsOdd && firstHalf) || (!signIsOdd && !firstHalf) ? 'sun' : 'moon';
        };

        const SUN_HORA_RESULTS: Record<number, { en: string; hi: string }> = {
          0: { en: 'Soul purpose and authority manifest strongly. Father benefits. Government or leadership gains. Right-side body energy is amplified.', hi: 'आत्म उद्देश्य और अधिकार प्रबल। पिता लाभान्वित। सरकार/नेतृत्व से लाभ।' },
          1: { en: 'Mental resources and maternal wealth. Income through public or emotional intelligence. Female gains through Sun hora create ambition.', hi: 'मानसिक संसाधन और मातृ धन। सार्वजनिक बुद्धि से आय।' },
          2: { en: 'Earned through courage, real estate, or siblings. Property from masculine effort. Mars energy drives income.', hi: 'साहस, सम्पत्ति या भाई-बहन से धन। मर्दाना प्रयास से सम्पत्ति।' },
          3: { en: 'Intellectual wealth and communication income. Business, media, and trade are strongly supported. Mercury doubles Sun power.', hi: 'बौद्धिक धन और संचार आय। व्यापार, मीडिया दृढ़ता से समर्थित।' },
          4: { en: 'Wisdom, children, and dharmic wealth. Speculative gains strongly supported. Wealth from Jupiter\'s benevolence here.', hi: 'ज्ञान, संतान और धार्मिक धन। सट्टा लाभ प्रबल।' },
          5: { en: 'Luxury, arts, and relationship wealth. Income through beauty, entertainment, or spouse. Feminine wealth through masculine hora.', hi: 'विलासिता, कला और सम्बन्ध धन। सौन्दर्य/मनोरंजन से आय।' },
          6: { en: 'Career and authority-driven income. Discipline and hard work yield Saturn\'s slow-but-certain wealth.', hi: 'कैरियर और अधिकार से आय। अनुशासन और परिश्रम से सतत् धन।' },
          7: { en: 'Unconventional or foreign wealth. Ambition and technology drive income. Rahu intensifies Sun hora.', hi: 'असामान्य या विदेशी धन। महत्वाकांक्षा और प्रौद्योगिकी से आय।' },
          8: { en: 'Spiritual detachment from material. Ketu in Sun hora = income through knowledge or past-life merit. Intermittent gains.', hi: 'भौतिक से आध्यात्मिक वैराग्य। ज्ञान या पूर्व जन्म के पुण्य से आय।' },
        };
        const MOON_HORA_RESULTS: Record<number, { en: string; hi: string }> = {
          0: { en: 'Authority serving others — income through public service or maternal care. Soul wealth through giving. Leadership gains lunar quality (popular, fluctuating).', hi: 'सार्वजनिक सेवा से आय। मातृ देखभाल। नेतृत्व लोकप्रिय पर अस्थिर।' },
          1: { en: 'Emotional wealth and intuition. Moon in Moon hora = excellent for maternal inheritance, public income, and emotional business. Most powerful Moon placement.', hi: 'भावनात्मक धन और अन्तर्ज्ञान। मातृ विरासत और सार्वजनिक आय के लिए उत्तम।' },
          2: { en: 'Property and courage nurtured. Real estate through feminine resources. Siblings support emotionally. Nurturing mother income.', hi: 'सम्पत्ति और साहस का पोषण। स्त्री संसाधनों से अचल सम्पत्ति।' },
          3: { en: 'Communication wealth from emotional intelligence. Writing, teaching, counselling. Mercury in Moon hora amplifies empathetic commerce.', hi: 'भावनात्मक बुद्धि से व्यापारिक धन। लेखन, शिक्षण, परामर्श।' },
          4: { en: 'Dharmic wealth through emotional wisdom. Children, charity, spiritual growth. Jupiter in Moon hora = abundant nurturing wealth.', hi: 'धार्मिक धन। बच्चे, दान, आध्यात्मिक विकास। प्रचुर पोषण धन।' },
          5: { en: 'Love, beauty, and relationship wealth fully expressed. Venus in Moon hora = supreme luxury, arts, and marital wealth. Most natural placement for Venus.', hi: 'प्रेम, सौन्दर्य और सम्बन्ध धन पूर्ण। विलासिता, कला और वैवाहिक धन।' },
          6: { en: 'Disciplined earning through persistence. Saturn in Moon hora = slow, consistent wealth through service, farming, or mass industries.', hi: 'दृढ़ता से अनुशासित कमाई। सेवा, कृषि या जन उद्योग से धन।' },
          7: { en: 'Foreign or unconventional income. Rahu in Moon hora = wealthy through international dealings, technology, or unusual means. Fluctuating but large.', hi: 'विदेशी या असामान्य आय। अंतर्राष्ट्रीय व्यापार या प्रौद्योगिकी से बड़ा धन।' },
          8: { en: 'Ketu in Moon hora = spiritual renunciation of material. Gains through healing, meditation, or moksha-oriented work. Minimal material attachment.', hi: 'आध्यात्मिक वैराग्य। उपचार, ध्यान से आय। भौतिक आसक्ति न्यूनतम।' },
        };

        const planetHoras = kundali.planets.map(p => ({
          planet: p,
          hora: getHora(p),
          interpretation: getHora(p) === 'sun' ? SUN_HORA_RESULTS[p.planet.id] : MOON_HORA_RESULTS[p.planet.id],
        }));

        const sunHoraCount = planetHoras.filter(ph => ph.hora === 'sun').length;
        const moonHoraCount = planetHoras.filter(ph => ph.hora === 'moon').length;
        // Wealth timing: planet with most planets in its hora rules
        const dominantHora = sunHoraCount >= moonHoraCount ? 'sun' : 'moon';

        return (
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/20 p-6">
            <h3 className="text-gold-gradient text-xl font-bold mb-1 text-center" style={headingFont}>
              {isHi ? 'D2 होरा — धन व संसाधन विश्लेषण' : 'D2 Hora — Wealth & Resource Analysis'}
            </h3>
            <p className="text-text-secondary/70 text-xs text-center mb-5" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {isHi
                ? 'होरा चार्ट सूर्य होरा (सिंह) और चन्द्र होरा (कर्क) के बीच ग्रहों को विभाजित करता है। स्रोत: बृहज्जातक, BPHS अ. 6'
                : 'Hora chart divides planets between Sun hora (Leo) and Moon hora (Cancer). Source: Brihat Jataka, BPHS Ch. 6'}
            </p>
            {/* Dominant Hora */}
            <div className={`rounded-xl p-4 mb-4 text-center border ${dominantHora === 'sun' ? 'bg-amber-500/10 border-amber-500/25' : 'bg-blue-500/10 border-blue-500/25'}`}>
              <div className={`font-bold text-lg mb-1 ${dominantHora === 'sun' ? 'text-amber-300' : 'text-blue-300'}`} style={headingFont}>
                {dominantHora === 'sun'
                  ? (isHi ? 'सूर्य होरा प्रबल' : 'Sun Hora Dominant')
                  : (isHi ? 'चन्द्र होरा प्रबल' : 'Moon Hora Dominant')}
              </div>
              <p className="text-text-secondary/70 text-xs" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {dominantHora === 'sun'
                  ? (isHi ? 'धन सूर्य होरा से आता है — अधिकार, स्वतन्त्र प्रयास, पिता, और सरकारी स्रोतों से। मर्दाना, दृढ़, और प्रत्यक्ष।' : 'Wealth comes through Sun hora — authority, independent effort, paternal sources, and government. Income is direct, assertive, and masculine in quality.')
                  : (isHi ? 'धन चन्द्र होरा से आता है — जनता, भावनात्मक बुद्धि, माता, और सेवा से। स्त्री, पोषणकारी, और उतार-चढ़ाव वाला।' : 'Wealth comes through Moon hora — public, emotional intelligence, maternal sources, and service. Income fluctuates but nurtures. Feminine quality dominates.')}
              </p>
            </div>
            {/* Planet grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planetHoras.map((ph, i) => (
                <div key={i} className={`rounded-xl p-3 border ${ph.hora === 'sun' ? 'border-amber-500/15 bg-amber-500/5' : 'border-blue-500/15 bg-blue-500/5'}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${ph.hora === 'sun' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {ph.hora === 'sun' ? (isHi ? 'सूर्य' : 'Sun') : (isHi ? 'चन्द्र' : 'Moon')}
                    </span>
                    <span className="text-gold-light font-semibold text-sm" style={headingFont}>{ph.planet.planet.name[locale as Locale] || ph.planet.planet.name.en}</span>
                    <span className="text-text-secondary/65 text-xs">H{ph.planet.house} · {ph.planet.signName[locale as Locale] || ph.planet.signName.en}</span>
                  </div>
                  {ph.interpretation && (
                    <p className="text-text-secondary/75 text-xs leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {ph.interpretation[isHi ? 'hi' : 'en']}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-text-secondary/55 text-xs text-center mt-4">
              {isHi
                ? `सूर्य होरा: ${sunHoraCount} ग्रह | चन्द्र होरा: ${moonHoraCount} ग्रह | लग्न राशि: ${RASHIS[lagnaSign-1]?.name?.hi || lagnaSign}`
                : `Sun Hora: ${sunHoraCount} planets | Moon Hora: ${moonHoraCount} planets | Lagna: ${RASHIS[lagnaSign-1]?.name?.en || lagnaSign}`}
            </p>
          </div>
        );
      })()}
              </>
            )}

            {/* D9 Navamsha */}
            {selectedVarga === 'D9' && kundali.divisionalCharts?.D9 && (() => {
        const d9 = kundali.divisionalCharts.D9;
        const d9Asc = d9.ascendantSign;
        const d9AscName = RASHIS[(d9Asc - 1) % 12]?.name;
        const d1Asc = kundali.ascendant.sign;
        const isVargottamaLagna = d9Asc === d1Asc;

        // Map planets to their D9 sign
        const planetD9 = kundali.planets.map(p => {
          let d9Sign = 0;
          for (let h = 0; h < 12; h++) {
            if (d9.houses[h]?.includes(p.planet.id)) { d9Sign = ((d9Asc - 1 + h) % 12) + 1; break; }
          }
          const isVgm = d9Sign === p.sign;
          return { planet: p, d9Sign, isVargottama: isVgm };
        });

        const D9_PLANET_MEANING: Record<number, { en: string; hi: string }> = {
          0: { en: 'Soul purpose and dharma — how your inner authority and father-karma truly manifest after maturity.', hi: 'आत्मा का उद्देश्य और धर्म — आपका आंतरिक अधिकार और पिता-कर्म परिपक्वता के बाद कैसे प्रकट होता है।' },
          1: { en: 'Inner emotional nature — how your mind and feelings truly operate beneath the surface. Spouse\'s emotional quality.', hi: 'आंतरिक भावनात्मक स्वभाव — मन और भावनाएं सतह के नीचे कैसे कार्य करती हैं। जीवनसाथी का भावनात्मक गुण।' },
          2: { en: 'Courage and initiative in marriage/dharma — how drive and energy express in partnerships and spiritual pursuits.', hi: 'विवाह/धर्म में साहस और पहल — भागीदारी और आध्यात्मिक साधना में ऊर्जा की अभिव्यक्ति।' },
          3: { en: 'Communication in relationships — how intellect and expression function in marriage and spiritual life.', hi: 'रिश्तों में संवाद — विवाह और आध्यात्मिक जीवन में बुद्धि और अभिव्यक्ति कैसे कार्य करती है।' },
          4: { en: 'Wisdom and dharma — Jupiter\'s D9 placement is crucial for spiritual evolution, children\'s destiny, and guru connections.', hi: 'ज्ञान और धर्म — गुरु की D9 स्थिति आध्यात्मिक विकास, संतान भाग्य और गुरु संबंध के लिए महत्वपूर्ण।' },
          5: { en: 'Marriage quality — Venus\'s D9 sign is the PRIMARY indicator of spouse nature, marital happiness, and partnership quality.', hi: 'विवाह गुणवत्ता — शुक्र की D9 राशि जीवनसाथी के स्वभाव, वैवाहिक सुख और साझेदारी की प्राथमिक सूचक है।' },
          6: { en: 'Karmic discipline in relationships — how Saturn\'s lessons manifest in marriage and dharmic responsibilities.', hi: 'रिश्तों में कार्मिक अनुशासन — शनि के पाठ विवाह और धार्मिक जिम्मेदारियों में कैसे प्रकट होते हैं।' },
          7: { en: 'Obsessive desires in partnerships — Rahu\'s D9 sign shows what you crave most in relationships and spiritual path.', hi: 'साझेदारी में तीव्र इच्छा — राहु की D9 राशि बताती है कि रिश्तों और आध्यात्मिक मार्ग में आप सबसे अधिक क्या चाहते हैं।' },
          8: { en: 'Spiritual detachment — Ketu\'s D9 placement shows where past-life mastery exists and what you naturally release in relationships.', hi: 'आध्यात्मिक वैराग्य — केतु की D9 स्थिति पूर्वजन्म की महारत और रिश्तों में स्वाभाविक विरक्ति दर्शाती है।' },
        };

        const DIGNITY_IN_D9: Record<string, { en: string; hi: string }> = {
          exalted: { en: 'Exalted in D9 — this planet\'s marriage/dharma results are exceptionally strong. Its promises in D1 are confirmed and amplified.', hi: 'D9 में उच्च — इस ग्रह के विवाह/धर्म परिणाम असाधारण रूप से बलवान। D1 के वादे निश्चित और प्रवर्धित।' },
          own: { en: 'Own sign in D9 — comfortable and natural expression in marriage/dharma. Reliable, self-sufficient results.', hi: 'D9 में स्वगृह — विवाह/धर्म में सहज और प्राकृतिक अभिव्यक्ति। विश्वसनीय, आत्मनिर्भर परिणाम।' },
          debilitated: { en: 'Debilitated in D9 — this planet\'s marriage/dharma results face challenges. May need Neecha Bhanga or remedies to unlock potential.', hi: 'D9 में नीच — विवाह/धर्म में चुनौतियां। नीच भंग या उपायों से क्षमता मुक्त हो सकती है।' },
          vargottama: { en: 'Vargottama — same sign in D1 and D9. Considered equal to exaltation strength. This planet\'s results are doubly confirmed.', hi: 'वर्गोत्तम — D1 और D9 में एक ही राशि। उच्च बल के समान। इस ग्रह के परिणाम दोहरे निश्चित।' },
        };

        const EXALTATION_SIGNS: Record<number, number> = { 0: 1, 1: 2, 2: 10, 3: 6, 4: 4, 5: 12, 6: 7 };
        const DEBILITATION_SIGNS: Record<number, number> = { 0: 7, 1: 8, 2: 4, 3: 12, 4: 10, 5: 6, 6: 1 };
        const OWN_SIGNS: Record<number, number[]> = { 0: [5], 1: [4], 2: [1, 8], 3: [3, 6], 4: [9, 12], 5: [2, 7], 6: [10, 11] };

        function getDignity(pid: number, sign: number, isVgm: boolean): string | null {
          if (isVgm) return 'vargottama';
          if (EXALTATION_SIGNS[pid] === sign) return 'exalted';
          if (DEBILITATION_SIGNS[pid] === sign) return 'debilitated';
          if (OWN_SIGNS[pid]?.includes(sign)) return 'own';
          return null;
        }

        return (
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/20 p-6 mt-8">
            <h3 className="text-gold-gradient text-xl font-bold mb-1 text-center" style={headingFont}>
              {isHi ? 'D9 नवांश — विवाह, धर्म और आत्म स्वरूप' : 'D9 Navamsha — Marriage, Dharma & Soul Nature'}
            </h3>
            <p className="text-text-secondary/70 text-xs text-center mb-5">
              {isHi
                ? 'नवांश D1 के बाद सबसे महत्वपूर्ण चार्ट है। यह विवाह, आध्यात्मिक विकास और आपके आंतरिक स्व को दर्शाता है। स्रोत: BPHS अ. 6'
                : 'Navamsha is the most important chart after D1. It reveals marriage quality, spiritual evolution, and your inner self. Source: BPHS Ch. 6'}
            </p>

            {/* D9 Lagna */}
            <div className={`rounded-xl p-4 mb-4 text-center border ${isVargottamaLagna ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-purple-500/10 border-purple-500/25'}`}>
              <div className={`font-bold text-lg mb-1 ${isVargottamaLagna ? 'text-emerald-300' : 'text-purple-300'}`} style={headingFont}>
                {isHi ? 'D9 लग्न: ' : 'D9 Ascendant: '}{d9AscName?.[locale] || d9AscName?.en}
              </div>
              <p className="text-text-secondary/70 text-xs">
                {isVargottamaLagna
                  ? (isHi ? 'वर्गोत्तम लग्न — D1 और D9 में एक ही राशि। आपका बाहरी व्यक्तित्व और आंतरिक आत्मा एक ही दिशा में हैं। अत्यंत शुभ।' : 'Vargottama Lagna — same sign in D1 and D9. Your outer personality and inner soul are aligned. Extremely auspicious.')
                  : (isHi ? `D1 लग्न ${RASHIS[(d1Asc-1)%12]?.name?.hi} से D9 लग्न ${d9AscName?.hi} में — यह आपका आंतरिक स्व है, जो विशेषतः 36 वर्ष के बाद प्रमुख होता है।` : `D1 Ascendant ${RASHIS[(d1Asc-1)%12]?.name?.en} shifts to D9 ${d9AscName?.en} — this is your inner self, which becomes dominant especially after age 36.`)}
              </p>
            </div>

            {/* Planet grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planetD9.map((pd, i) => {
                const pid = pd.planet.planet.id;
                const d9SignName = RASHIS[(pd.d9Sign - 1) % 12]?.name;
                const dignity = getDignity(pid, pd.d9Sign, pd.isVargottama);
                const dignityInfo = dignity ? DIGNITY_IN_D9[dignity] : null;
                const meaning = D9_PLANET_MEANING[pid];

                return (
                  <div key={i} className={`rounded-xl p-3 border ${
                    dignity === 'exalted' || dignity === 'vargottama' ? 'border-emerald-500/15 bg-emerald-500/5' :
                    dignity === 'debilitated' ? 'border-red-500/15 bg-red-500/5' :
                    dignity === 'own' ? 'border-sky-500/15 bg-sky-500/5' :
                    'border-purple-500/15 bg-purple-500/5'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-gold-light font-semibold text-sm" style={headingFont}>{pd.planet.planet.name[locale] || pd.planet.planet.name.en}</span>
                      <span className="text-text-secondary/65 text-xs">
                        {isHi ? 'D9 राशि:' : 'D9 Sign:'} {d9SignName?.[locale] || d9SignName?.en}
                      </span>
                      {dignity && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          dignity === 'exalted' ? 'bg-emerald-500/20 text-emerald-300' :
                          dignity === 'vargottama' ? 'bg-gold-primary/20 text-gold-light' :
                          dignity === 'own' ? 'bg-sky-500/20 text-sky-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {dignity === 'vargottama' ? 'Vgm' : dignity === 'exalted' ? (isHi ? 'उच्च' : 'Exalted') : dignity === 'own' ? (isHi ? 'स्वगृह' : 'Own') : (isHi ? 'नीच' : 'Debil.')}
                        </span>
                      )}
                    </div>
                    {meaning && (
                      <p className="text-text-secondary/75 text-xs leading-relaxed">{meaning[isHi ? 'hi' : 'en']}</p>
                    )}
                    {dignityInfo && (
                      <p className={`text-xs leading-relaxed mt-1 italic ${
                        dignity === 'exalted' || dignity === 'vargottama' ? 'text-emerald-400/80' :
                        dignity === 'debilitated' ? 'text-red-400/80' : 'text-sky-400/80'
                      }`}>{dignityInfo[isHi ? 'hi' : 'en']}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 7th house of D9 = spouse nature */}
            {(() => {
              const h7planets = d9.houses[6] || [];
              const h7Sign = ((d9Asc - 1 + 6) % 12) + 1;
              const h7SignName = RASHIS[(h7Sign - 1) % 12]?.name;
              return (
                <div className="mt-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="text-purple-300 text-xs uppercase tracking-wider font-bold mb-2">
                    {isHi ? 'D9 7वां भाव — जीवनसाथी संकेत' : 'D9 7th House — Spouse Indicator'}
                  </div>
                  <p className="text-text-secondary/75 text-xs leading-relaxed">
                    {isHi ? `7वां भाव ${h7SignName?.hi} में` : `7th house in ${h7SignName?.en}`}
                    {h7planets.length > 0
                      ? (isHi ? ` — ग्रह: ${h7planets.map(p => PLANET_NAMES_HI[p] || '').join(', ')}। ये ग्रह जीवनसाथी के स्वभाव और विवाह गुणवत्ता को सीधे प्रभावित करते हैं।` : ` — planets: ${h7planets.map(p => PLANET_NAMES_EN[p] || '').join(', ')}. These planets directly influence spouse nature and marriage quality.`)
                      : (isHi ? '। कोई ग्रह नहीं — जीवनसाथी का स्वभाव 7वें भावेश और उसके D9 स्थान से निर्धारित।' : '. No planets — spouse nature determined by 7th lord and its D9 placement.')}
                  </p>
                </div>
              );
            })()}
          </div>
        );
      })()}

            {/* D10 Dashamsha */}
            {selectedVarga === 'D10' && kundali.divisionalCharts?.D10 && (() => {
        const d10 = kundali.divisionalCharts.D10;
        const d10Asc = d10.ascendantSign;
        const d10AscName = RASHIS[(d10Asc - 1) % 12]?.name;

        const planetD10 = kundali.planets.map(p => {
          let d10House = 0;
          for (let h = 0; h < 12; h++) {
            if (d10.houses[h]?.includes(p.planet.id)) { d10House = h + 1; break; }
          }
          return { planet: p, d10House };
        });

        const D10_PLANET_MEANING: Record<number, { en: string; hi: string }> = {
          0: { en: 'Authority and leadership in career — government, executive roles, public visibility. Sun in kendras of D10 gives commanding professional presence.', hi: 'करियर में अधिकार और नेतृत्व — सरकार, कार्यकारी भूमिकाएं, सार्वजनिक दृश्यता।' },
          1: { en: 'Public-facing career — popularity, emotional intelligence in work, changing roles. Moon in D10 kendras suits public service, hospitality, healthcare.', hi: 'सार्वजनिक करियर — लोकप्रियता, कार्य में भावनात्मक बुद्धि। जनसेवा, आतिथ्य, स्वास्थ्य सेवा।' },
          2: { en: 'Technical and action-oriented career — engineering, military, surgery, sports, real estate. Mars in D10 kendras gives dominant professional drive.', hi: 'तकनीकी और क्रियाशील करियर — इंजीनियरिंग, सैन्य, शल्य, खेल, रियल एस्टेट।' },
          3: { en: 'Communication and analytical career — business, writing, media, accounting, IT. Mercury in D10 kendras excels in commerce and information work.', hi: 'संचार और विश्लेषणात्मक करियर — व्यापार, लेखन, मीडिया, लेखा, आईटी।' },
          4: { en: 'Wisdom and advisory career — teaching, law, finance, religion, counselling. Jupiter in D10 kendras is one of the strongest career indicators.', hi: 'ज्ञान और सलाहकार करियर — शिक्षण, कानून, वित्त, धर्म, परामर्श। D10 केंद्र में गुरु सबसे शक्तिशाली करियर संकेत।' },
          5: { en: 'Creative and luxury career — arts, entertainment, fashion, beauty, hospitality. Venus in D10 kendras brings success through aesthetics and relationships.', hi: 'रचनात्मक और विलासिता करियर — कला, मनोरंजन, फैशन, सौंदर्य, आतिथ्य।' },
          6: { en: 'Structured and disciplined career — management, administration, agriculture, mining, manufacturing. Saturn in D10 kendras gives lasting but slow-building career success.', hi: 'संरचित और अनुशासित करियर — प्रबंधन, प्रशासन, कृषि, खनन, विनिर्माण।' },
          7: { en: 'Unconventional career — technology, foreign companies, research, aviation, innovation. Rahu in D10 kendras drives ambitious, boundary-breaking career moves.', hi: 'अपारंपरिक करियर — प्रौद्योगिकी, विदेशी कंपनियां, अनुसंधान, विमानन, नवाचार।' },
          8: { en: 'Spiritual or research career — healing, astrology, occult sciences, renunciation-oriented work. Ketu in D10 gives expertise through intuition rather than formal training.', hi: 'आध्यात्मिक या अनुसंधान करियर — उपचार, ज्योतिष, गुप्त विज्ञान। केतु औपचारिक प्रशिक्षण के बजाय अंतर्ज्ञान से विशेषज्ञता देता है।' },
        };

        const KENDRAS_SET = new Set([1, 4, 7, 10]);
        const TRIKONAS_SET = new Set([1, 5, 9]);

        return (
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-sky-500/20 p-6 mt-8">
            <h3 className="text-gold-gradient text-xl font-bold mb-1 text-center" style={headingFont}>
              {isHi ? 'D10 दशांश — करियर और व्यावसायिक जीवन' : 'D10 Dashamsha — Career & Professional Life'}
            </h3>
            <p className="text-text-secondary/70 text-xs text-center mb-5">
              {isHi
                ? 'दशांश चार्ट करियर, व्यवसाय और सार्वजनिक जीवन का विशिष्ट सूचक है। केंद्र में ग्रह करियर को शक्तिशाली बनाते हैं। स्रोत: BPHS अ. 6'
                : 'Dashamsha chart is the specific indicator of career, profession, and public life. Planets in kendras powerfully shape career. Source: BPHS Ch. 6'}
            </p>

            {/* D10 Lagna */}
            <div className="rounded-xl p-4 mb-4 text-center border bg-sky-500/10 border-sky-500/25">
              <div className="font-bold text-lg mb-1 text-sky-300" style={headingFont}>
                {isHi ? 'D10 लग्न: ' : 'D10 Ascendant: '}{d10AscName?.[locale] || d10AscName?.en}
              </div>
              <p className="text-text-secondary/70 text-xs">
                {isHi
                  ? 'D10 लग्न आपके करियर के स्वरूप और पेशेवर व्यक्तित्व को दर्शाता है — आप कार्यस्थल पर कैसे दिखते हैं।'
                  : 'D10 ascendant shows the nature of your professional persona — how you appear in the workplace and your career\'s fundamental character.'}
              </p>
            </div>

            {/* Planet grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planetD10.map((pd, i) => {
                const pid = pd.planet.planet.id;
                const meaning = D10_PLANET_MEANING[pid];
                const isInKendra = KENDRAS_SET.has(pd.d10House);
                const isInTrikona = TRIKONAS_SET.has(pd.d10House);
                const isInDusthana = new Set([6, 8, 12]).has(pd.d10House);

                return (
                  <div key={i} className={`rounded-xl p-3 border ${
                    isInKendra ? 'border-emerald-500/15 bg-emerald-500/5' :
                    isInTrikona ? 'border-sky-500/15 bg-sky-500/5' :
                    isInDusthana ? 'border-amber-500/15 bg-amber-500/5' :
                    'border-sky-500/10 bg-sky-500/3'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-gold-light font-semibold text-sm" style={headingFont}>{pd.planet.planet.name[locale] || pd.planet.planet.name.en}</span>
                      <span className="text-text-secondary/65 text-xs">
                        {isHi ? 'D10 भाव:' : 'D10 House:'} {pd.d10House}
                      </span>
                      {isInKendra && (
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {isHi ? 'केंद्र' : 'Kendra'}
                        </span>
                      )}
                      {isInTrikona && !isInKendra && (
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                          {isHi ? 'त्रिकोण' : 'Trikona'}
                        </span>
                      )}
                      {isInDusthana && (
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          {isHi ? 'दुःस्थान' : 'Dusthana'}
                        </span>
                      )}
                    </div>
                    {meaning && (
                      <p className="text-text-secondary/75 text-xs leading-relaxed">{meaning[isHi ? 'hi' : 'en']}</p>
                    )}
                    {isInKendra && (
                      <p className="text-emerald-400/80 text-xs mt-1 italic">
                        {isHi ? 'केंद्र स्थान — करियर में प्रत्यक्ष, शक्तिशाली प्रभाव।' : 'Kendra placement — direct, powerful career influence.'}
                      </p>
                    )}
                    {isInDusthana && (
                      <p className="text-amber-400/80 text-xs mt-1 italic">
                        {isHi ? 'दुःस्थान — करियर में चुनौतियां, लेकिन इनसे पार पाने पर विशेष शक्ति मिलती है।' : 'Dusthana placement — career challenges exist, but overcoming them builds unique professional strength.'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 10th house summary */}
            {(() => {
              const h10planets = d10.houses[9] || [];
              const h10Sign = ((d10Asc - 1 + 9) % 12) + 1;
              const h10SignName = RASHIS[(h10Sign - 1) % 12]?.name;
              return (
                <div className="mt-4 p-4 rounded-xl bg-sky-500/5 border border-sky-500/15">
                  <div className="text-sky-300 text-xs uppercase tracking-wider font-bold mb-2">
                    {isHi ? 'D10 10वां भाव — करियर शिखर' : 'D10 10th House — Career Zenith'}
                  </div>
                  <p className="text-text-secondary/75 text-xs leading-relaxed">
                    {isHi ? `10वां भाव ${h10SignName?.hi} में` : `10th house in ${h10SignName?.en}`}
                    {h10planets.length > 0
                      ? (isHi ? ` — ग्रह: ${h10planets.map(p => PLANET_NAMES_HI[p] || '').join(', ')}। ये ग्रह सीधे करियर के उच्चतम बिंदु को प्रभावित करते हैं — आपकी सबसे दृश्यमान व्यावसायिक उपलब्धियां।` : ` — planets: ${h10planets.map(p => PLANET_NAMES_EN[p] || '').join(', ')}. These planets directly influence your career zenith — your most visible professional achievements.`)
                      : (isHi ? '। कोई ग्रह नहीं — करियर शिखर 10वें भावेश और उसकी D10 स्थिति से निर्धारित।' : '. No planets — career zenith determined by 10th lord and its placement in D10.')}
                  </p>
                </div>
              );
            })()}
          </div>
        );
      })()}

            {/* D7 Saptamsha */}
            {selectedVarga === 'D7' && kundali.divisionalCharts?.D7 && (() => {
        const d7 = kundali.divisionalCharts.D7;
        const d7Asc = d7.ascendantSign;
        const d7AscName = RASHIS[(d7Asc - 1) % 12]?.name;

        const h5planets = d7.houses[4] || []; // 5th house = first child
        const h5Sign = ((d7Asc - 1 + 4) % 12) + 1;
        const jupHouse = (() => { for (let h = 0; h < 12; h++) { if (d7.houses[h]?.includes(4)) return h + 1; } return 0; })();

        return (
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-teal-500/20 p-6 mt-8">
            <h3 className="text-gold-gradient text-xl font-bold mb-1 text-center" style={headingFont}>
              {isHi ? 'D7 सप्तांश — संतान और वंश' : 'D7 Saptamsha — Children & Progeny'}
            </h3>
            <p className="text-text-secondary/70 text-xs text-center mb-5">
              {isHi
                ? 'सप्तांश चार्ट संतान का प्राथमिक सूचक है — संख्या, स्वभाव, जातक से संबंध और उनकी सफलता। स्रोत: BPHS अ. 6'
                : 'Saptamsha is the primary children indicator — number, nature, relationship with you, and their success. Source: BPHS Ch. 6'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Jupiter placement — most important for children */}
              <div className={`rounded-xl p-4 border ${jupHouse && new Set([1,4,5,7,9,10]).has(jupHouse) ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-teal-500/15 bg-teal-500/5'}`}>
                <div className="text-teal-300 text-xs uppercase tracking-wider font-bold mb-2">
                  {isHi ? 'गुरु स्थिति (सबसे महत्वपूर्ण)' : 'Jupiter Placement (Most Important)'}
                </div>
                <p className="text-text-secondary/75 text-xs leading-relaxed">
                  {jupHouse
                    ? (isHi ? `D7 में गुरु ${jupHouse}वें भाव में — ${new Set([1,4,5,7,9,10]).has(jupHouse) ? 'शुभ स्थान — संतान सुख और उनकी सफलता का बलवान संकेत।' : new Set([6,8,12]).has(jupHouse) ? 'चुनौतीपूर्ण स्थान — संतान में विलंब या कठिनाई संभव। गुरु उपाय सहायक।' : 'मध्यम स्थान — सामान्य संतान सुख।'}` : `Jupiter in ${jupHouse}th house of D7 — ${new Set([1,4,5,7,9,10]).has(jupHouse) ? 'Auspicious position — strong indicator of children\'s happiness and success.' : new Set([6,8,12]).has(jupHouse) ? 'Challenging position — delay or difficulty with children possible. Jupiter remedies help.' : 'Moderate position — normal children fortune.'}`)
                    : (isHi ? 'D7 में गुरु की स्थिति अनिर्धारित।' : 'Jupiter position in D7 undetermined.')}
                </p>
              </div>

              {/* 5th house — first child */}
              <div className="rounded-xl p-4 border border-teal-500/15 bg-teal-500/5">
                <div className="text-teal-300 text-xs uppercase tracking-wider font-bold mb-2">
                  {isHi ? '5वां भाव — प्रथम संतान' : '5th House — First Child'}
                </div>
                <p className="text-text-secondary/75 text-xs leading-relaxed">
                  {isHi ? `${RASHIS[(h5Sign-1)%12]?.name?.hi} में` : `In ${RASHIS[(h5Sign-1)%12]?.name?.en}`}
                  {h5planets.length > 0
                    ? (isHi ? ` — ग्रह: ${h5planets.map(p => PLANET_NAMES_HI[p] || '').join(', ')}। ${h5planets.some(p => new Set([1,3,4,5]).has(p)) ? 'शुभ ग्रह — प्रथम संतान से सुख।' : 'पाप ग्रह — प्रथम संतान में चुनौतियां संभव।'}` : ` — planets: ${h5planets.map(p => PLANET_NAMES_EN[p] || '').join(', ')}. ${h5planets.some(p => new Set([1,3,4,5]).has(p)) ? 'Benefic influence — happiness from first child.' : 'Malefic influence — challenges possible with first child.'}`)
                    : (isHi ? '। कोई ग्रह नहीं — 5वें भावेश की स्थिति से आकलन।' : '. No planets — assess from 5th lord placement.')}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TippanniTab({ kundali, locale, isDevanagari, headingFont, tTip }: {
  kundali: KundaliData; locale: Locale; isDevanagari: boolean;
  headingFont: React.CSSProperties; tTip: (key: string) => string;
}) {
  const isTamil = String(locale) === 'ta';
  const [expandedPlanet, setExpandedPlanet] = useState<number | null>(null);
  const [expandedYoga, setExpandedYoga] = useState<number | null>(null);
  const [expandedAntar, setExpandedAntar] = useState<number | null>(null);
  const [expandedPratyantar, setExpandedPratyantar] = useState<string | null>(null);
  const [selectedMahaTimeline, setSelectedMahaTimeline] = useState<number | null>(null);

  // Client-side base tippanni (renders immediately, memoized)
  const baseTip = useMemo(() => generateTippanni(kundali, locale), [kundali, locale]);

  // Server-side RAG-enhanced tippanni (loads async)
  const [ragTip, setRagTip] = useState<TippanniContent | null>(null);
  const [ragLoading, setRagLoading] = useState(false);

  // Stable key for useCallback dependency (avoid object reference issues)
  const kundaliKey = useMemo(
    () => `${kundali.ascendant.sign}-${kundali.planets.map(p => `${p.planet.id}:${p.house}:${p.sign}`).join(',')}`,
    [kundali]
  );

  const fetchRagTippanni = useCallback(async () => {
    setRagLoading(true);
    try {
      const res = await authedFetch('/api/tippanni', {
        method: 'POST',
        body: JSON.stringify({ kundali, locale, ragEnabled: true }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ragEnabled) {
          setRagTip(data);
        }
      }
    } catch (err) {
      console.error('RAG tippanni fetch failed:', err);
    }
    setRagLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kundaliKey, locale]);

  useEffect(() => {
    fetchRagTippanni();
  }, [fetchRagTippanni]);

  // Use RAG-enhanced data if available, otherwise fall back to base
  const tip = ragTip || baseTip;

  // Detect afflicted planets for graha shanti recommendations
  const afflictedPlanets = useMemo<AfflictedPlanet[]>(() => {
    if (!kundali.planets) return [];
    const strengthMap = new Map<number, number>();
    tip.strengthOverview.forEach(s => {
      const planet = kundali.planets.find(p => p.planet.name[locale] === s.planetName || p.planet.name.en === s.planetName);
      if (planet) strengthMap.set(planet.planet.id, s.strength);
    });
    const planetInputs = kundali.planets.map(p => ({
      id: p.planet.id,
      name: p.planet.name.en,
      house: p.house,
      isDebilitated: p.isDebilitated,
      isCombust: p.isCombust,
      isRetrograde: p.isRetrograde,
      shadbalaPercent: strengthMap.get(p.planet.id),
    }));
    return detectAfflictedPlanets(planetInputs);
  }, [kundali.planets, tip.strengthOverview, locale]);

  const severityColors: Record<string, string> = {
    severe: 'bg-red-500/20 text-red-400',
    moderate: 'bg-orange-500/20 text-orange-400',
    mild: 'bg-yellow-500/20 text-yellow-400',
    none: 'bg-green-500/20 text-green-400',
  };

  // Convergence synthesis — only available from server-side API response
  const convergence = (ragTip || tip)?.convergence || null;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>{tTip('title')}</h2>

      {/* ===== CONVERGENCE SYNTHESIS (hero card) ===== */}
      {convergence && (
        <ConvergenceSummary convergence={convergence} locale={locale} headingFont={headingFont} />
      )}

      {/* ===== AI READING (premium, below convergence) ===== */}
      <AIReadingButton kundali={kundali} locale={locale} headingFont={headingFont} />

      {/* RAG status indicator */}
      {tip.ragEnabled && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-amber-400/60 text-xs">
            {locale === 'en' || isTamil ? 'Enhanced with classical Jyotish text references' : 'शास्त्रीय ज्योतिष ग्रन्थ सन्दर्भों से समृद्ध'}
          </span>
        </div>
      )}
      {ragLoading && !tip.ragEnabled && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
          <span className="text-amber-400/40 text-xs">
            {locale === 'en' || isTamil ? 'Loading classical references...' : 'शास्त्रीय सन्दर्भ लोड हो रहे हैं...'}
          </span>
        </div>
      )}

      {/* ===== YEAR PREDICTIONS (at top — most immediately relevant) ===== */}
      <YearPredictionsSection tip={tip} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} tTip={tTip} />

      <GoldDivider />

      {/* ===== PERSONALITY PROFILE ===== */}
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('personality')}</h3>
        <div className="space-y-6">
          {[tip.personality.lagna, tip.personality.moonSign, tip.personality.sunSign].map((block, i) => (
            block.content && (
              <div key={i} className="border-l-2 border-gold-primary/20 pl-4">
                <h4 className="text-gold-primary font-semibold mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{block.title}</h4>
                <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{block.content}</div>
                {block.implications && (
                  <div className="mt-3 p-3 bg-gold-primary/5 rounded-lg border border-gold-primary/10">
                    <p className="text-gold-dark text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Implications & Prognosis' : 'प्रभाव और पूर्वानुमान'}</p>
                    <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{block.implications}</div>
                  </div>
                )}
              </div>
            )
          ))}
          {tip.personality.summary && (
            <div className="p-4 bg-gold-primary/10 rounded-lg border border-gold-primary/20">
              <p className="text-gold-light text-sm font-medium leading-relaxed">{tip.personality.summary}</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== PLANET PLACEMENT ANALYSIS ===== */}
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>
          {locale === 'en' || isTamil ? 'Planet Placement Analysis' : locale === 'hi' ? 'ग्रह स्थिति विश्लेषण' : 'ग्रहस्थितिविश्लेषणम्'}
        </h3>
        <div className="space-y-3">
          {tip.planetInsights.map((pi) => (
            <div key={pi.planetId}>
              <motion.div
                onClick={() => setExpandedPlanet(expandedPlanet === pi.planetId ? null : pi.planetId)}
                className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10 hover:border-gold-primary/25 cursor-pointer transition-all"
                whileHover={{ scale: 1.005 }}
              >
                <GrahaIconById id={pi.planetId} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: pi.planetColor, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>{pi.planetName}</span>
                    <span className="text-text-secondary/70 text-xs">
                      {locale === 'en' || isTamil ? `House ${pi.house}` : `भाव ${pi.house}`} &middot; {pi.signName}
                    </span>
                    {pi.dignity && <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">{pi.dignity.split(' ')[2] === '—' ? '' : pi.dignity.includes('exalted') || pi.dignity.includes('उच्च') ? (locale === 'en' || isTamil ? 'Exalted' : 'उच्च') : pi.dignity.includes('debilitated') || pi.dignity.includes('नीच') ? (locale === 'en' || isTamil ? 'Debilitated' : 'नीच') : (locale === 'en' || isTamil ? 'Own Sign' : 'स्वगृह')}</span>}
                    {pi.retrogradeEffect && <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">R</span>}
                  </div>
                </div>
                <svg className={`w-4 h-4 text-gold-dark/50 transition-transform ${expandedPlanet === pi.planetId ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </motion.div>
              <AnimatePresence>
                {expandedPlanet === pi.planetId && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-4 ml-11 space-y-3 border-l border-gold-primary/10">
                      <p className="text-text-secondary text-sm leading-relaxed">{pi.description}</p>
                      {pi.dignity && (
                        <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                          <p className="text-emerald-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Dignity Status' : 'गरिमा स्थिति'}</p>
                          <p className="text-text-secondary text-sm">{pi.dignity}</p>
                        </div>
                      )}
                      {pi.retrogradeEffect && (
                        <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                          <p className="text-red-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Retrograde Effect' : 'वक्री प्रभाव'}</p>
                          <p className="text-text-secondary text-sm">{pi.retrogradeEffect}</p>
                        </div>
                      )}
                      {pi.implications && (
                        <div className="p-3 bg-gold-primary/5 rounded-lg border border-gold-primary/10">
                          <p className="text-gold-dark text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Practical Implications' : 'व्यावहारिक प्रभाव'}</p>
                          <p className="text-text-secondary text-sm">{pi.implications}</p>
                        </div>
                      )}
                      {pi.prognosis && (
                        <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                          <p className="text-indigo-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Life Prognosis' : 'जीवन पूर्वानुमान'}</p>
                          <p className="text-text-secondary text-sm">{pi.prognosis}</p>
                        </div>
                      )}
                      {pi.classicalReferences ? (
                        <ClassicalReferencesBlock refs={pi.classicalReferences} locale={locale} isDevanagari={isDevanagari} />
                      ) : ragLoading ? (
                        <div className="mt-3 p-3 rounded-lg border border-amber-600/10 bg-amber-900/5 flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
                          <span className="text-amber-400/50 text-xs">{locale === 'en' || isTamil ? 'Loading classical references...' : 'शास्त्रीय सन्दर्भ लोड हो रहे हैं...'}</span>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ===== YOGAS ===== */}
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('yogas')}</h3>
        <div className="space-y-3">
          {tip.yogas.filter(y => y.present).map((yoga, i) => {
            const isInauspicious = yoga.type === 'Arishta' || yoga.type === 'Dosha';
            const borderColor = isInauspicious ? 'border-rose-500/20 bg-rose-500/5 hover:border-rose-500/30' : 'border-green-500/20 bg-green-500/5 hover:border-green-500/30';
            const badgeColor = isInauspicious ? 'bg-rose-500/20 text-rose-400' : 'bg-green-500/20 text-green-400';
            const strengthColor = yoga.strength === 'Strong' ? 'bg-green-500/20 text-green-400' : yoga.strength === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-orange-500/20 text-orange-400';
            return (
            <div key={i}>
              <motion.div
                onClick={() => setExpandedYoga(expandedYoga === i ? null : i)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${borderColor}`}
                whileHover={{ scale: 1.005 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gold-light font-semibold">{yoga.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${strengthColor}`}>{yoga.strength}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>
                      {isInauspicious ? (locale === 'en' || isTamil ? 'Inauspicious' : 'अशुभ') : (locale === 'en' || isTamil ? 'Auspicious' : 'शुभ')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-gold-primary/15 text-gold-primary/70`}>{yoga.type}</span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm">{yoga.description}</p>
              </motion.div>
              <AnimatePresence>
                {expandedYoga === i && yoga.implications && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="ml-4 mt-1 space-y-2">
                      <div className={`p-3 rounded-lg border ${isInauspicious ? 'bg-rose-500/5 border-rose-500/10' : 'bg-green-500/5 border-green-500/10'}`}>
                        <p className={`text-xs uppercase tracking-wider mb-1 ${isInauspicious ? 'text-rose-400' : 'text-green-400'}`}>{locale === 'en' || isTamil ? 'What This Means For You' : 'आपके लिए इसका अर्थ'}</p>
                        <p className="text-text-secondary text-sm">{yoga.implications}</p>
                      </div>
                      {yoga.classicalReferences && (
                        <ClassicalReferencesBlock refs={yoga.classicalReferences} locale={locale} isDevanagari={isDevanagari} />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );})}
        </div>
      </section>

      {/* ===== DOSHAS ===== */}
      {/* Ganda Mula Banner — prominent alert if detected */}
      {tip.doshas.some(d => d.name.includes('Ganda Mula') && d.present) && (
        <div className="rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-red-500/5 to-amber-500/10 p-5 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-amber-400 text-lg font-bold">!</span>
            </div>
            <div>
              <h4 className="text-amber-300 font-bold text-base mb-1">
                {locale === 'en' || isTamil ? 'Ganda Mula Nakshatra Detected' : 'गण्ड मूल नक्षत्र पाया गया'}
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed">
                {locale === 'en' || isTamil
                  ? 'The Moon at birth is in a Ganda Mula nakshatra — one of 6 nakshatras at the water-fire sign junctions. This requires a Ganda Mula Shanti Puja. See the dosha details below for specific remedies.'
                  : 'जन्म के समय चन्द्रमा गण्ड मूल नक्षत्र में है — जल-अग्नि राशि सन्धि के 6 नक्षत्रों में से एक। गण्ड मूल शान्ति पूजा आवश्यक है। विशिष्ट उपायों के लिए नीचे दोष विवरण देखें।'}
              </p>
              <Link href="/learn/modules/24-1" className="inline-block mt-2 text-xs text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2" tabIndex={-1}>
                {locale === 'en' || isTamil ? 'Learn about Ganda Mula Nakshatras →' : 'गण्ड मूल नक्षत्रों के बारे में जानें →'}
              </Link>
            </div>
          </div>
        </div>
      )}
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('doshas')}</h3>
        <div className="space-y-4">
          {tip.doshas.filter(d => d.present).map((dosha, i) => {
            const effectiveColor = dosha.effectiveSeverity === 'cancelled' ? 'border-green-500/20 bg-green-500/5' : dosha.effectiveSeverity === 'partial' ? 'border-yellow-500/20 bg-yellow-500/5' : dosha.present ? 'border-red-500/20 bg-red-500/5' : 'border-green-500/10 bg-bg-primary/30';
            return (
            <div key={i} className={`p-4 rounded-lg border ${effectiveColor}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gold-light font-semibold">{dosha.name}</span>
                <div className="flex items-center gap-2">
                  {dosha.present && <span className={`text-xs px-2 py-0.5 rounded-full ${severityColors[dosha.severity]}`}>{dosha.severity}</span>}
                  {dosha.effectiveSeverity && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${dosha.effectiveSeverity === 'cancelled' ? 'bg-green-500/20 text-green-400' : dosha.effectiveSeverity === 'partial' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {dosha.effectiveSeverity === 'cancelled' ? (locale === 'en' || isTamil ? 'Cancelled' : 'निरस्त') : dosha.effectiveSeverity === 'partial' ? (locale === 'en' || isTamil ? 'Partial' : 'आंशिक') : (locale === 'en' || isTamil ? 'Full' : 'पूर्ण')}
                    </span>
                  )}
                  {!dosha.effectiveSeverity && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${dosha.present ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {dosha.present ? tTip('present') : tTip('absent')}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{dosha.description}</p>
              {dosha.activeDasha && (
                <p className="text-purple-400 text-xs mt-2">{dosha.activeDasha}</p>
              )}
              {dosha.present && dosha.cancellationConditions && dosha.cancellationConditions.length > 0 && (
                <div className="mt-3 p-3 bg-bg-primary/40 rounded-lg border border-gold-primary/10">
                  <p className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' || isTamil ? 'Cancellation Conditions (BPHS)' : 'निरसन शर्तें (बृहत्पाराशरहोराशास्त्र)'}</p>
                  <div className="space-y-1.5">
                    {dosha.cancellationConditions.map((cc, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm">
                        <span className={`mt-0.5 w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full text-xs ${cc.met ? 'bg-green-500/20 text-green-400' : 'bg-red-500/10 text-red-400/60'}`}>
                          {cc.met ? '✓' : '✗'}
                        </span>
                        <span className={`${cc.met ? 'text-green-400' : 'text-text-tertiary'}`}>{cc.condition}</span>
                        {cc.source && <span className="text-text-tertiary/50 text-xs ml-auto flex-shrink-0">{cc.source}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {dosha.present && dosha.remedies && (
                <div className="mt-3 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                  <p className="text-amber-400 text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Remedial Measures' : 'उपचारात्मक उपाय'}</p>
                  <p className="text-text-secondary text-sm">{dosha.remedies}</p>
                </div>
              )}
              {dosha.classicalReferences && (
                <ClassicalReferencesBlock refs={dosha.classicalReferences} locale={locale} isDevanagari={isDevanagari} />
              )}
            </div>
            );
          })}
        </div>
      </section>

      {/* ===== LIFE AREA PROGNOSIS ===== */}
      <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
        <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>
          {locale === 'en' || isTamil ? 'Life Area Prognosis' : locale === 'hi' ? 'जीवन क्षेत्र पूर्वानुमान' : 'जीवनक्षेत्रपूर्वानुमानम्'}
        </h3>
        <div className="space-y-4">
          {(['career', 'wealth', 'marriage', 'health', 'education'] as const).map((key) => {
            const area = tip.lifeAreas[key];
            return (
              <div key={key} className="p-4 rounded-lg bg-bg-primary/30 border border-gold-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-gold-primary font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{area.label}</h4>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < area.rating ? 'bg-gold-primary' : 'bg-gold-primary/10'}`} />
                    ))}
                    <span className="text-gold-light text-xs ml-1 font-mono">{area.rating}/10</span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mb-2">{area.summary}</p>
                {area.details && <p className="text-text-secondary/70 text-xs leading-relaxed">{area.details}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== DASHA SYNTHESIS (new) ===== */}
      {tip.dashaSynthesis?.currentMaha && (() => {
        const ds = tip.dashaSynthesis!;
        const cm = ds.currentMaha!;
        const NAME_TO_ID: Record<string, number> = { Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8 };
        const ASSESSMENT_COLORS: Record<PeriodAssessment, { bg: string; border: string; text: string; bar: string }> = {
          very_favorable: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/25', text: 'text-emerald-400', bar: 'bg-emerald-500' },
          favorable: { bg: 'bg-green-500/15', border: 'border-green-500/25', text: 'text-green-400', bar: 'bg-green-500' },
          mixed: { bg: 'bg-amber-500/15', border: 'border-amber-500/25', text: 'text-amber-400', bar: 'bg-amber-500' },
          challenging: { bg: 'bg-orange-500/15', border: 'border-orange-500/25', text: 'text-orange-400', bar: 'bg-orange-500' },
          difficult: { bg: 'bg-rose-500/15', border: 'border-rose-500/25', text: 'text-rose-400', bar: 'bg-rose-500' },
        };
        const ASSESSMENT_LABELS: Record<PeriodAssessment, { en: string; hi: string }> = {
          very_favorable: { en: 'Very Favorable', hi: 'अत्यन्त शुभ' },
          favorable: { en: 'Favorable', hi: 'शुभ' },
          mixed: { en: 'Mixed', hi: 'मिश्रित' },
          challenging: { en: 'Challenging', hi: 'चुनौतीपूर्ण' },
          difficult: { en: 'Difficult', hi: 'कठिन' },
        };
        const lifeAreaArrow = (text: string): string => {
          if (/favorable|strong|excellent|growth|success|gains|flourish|prosper|expand/i.test(text)) return '\u2191';
          if (/challenge|difficult|obstacle|strain|loss|conflict|stress|caution|decline/i.test(text)) return '\u2193';
          return '\u2192';
        };
        const lifeAreaColor = (arrow: string) => arrow === '\u2191' ? 'text-emerald-400' : arrow === '\u2193' ? 'text-rose-400' : 'text-amber-400';
        const fmtYear = (d: string) => d.slice(0, 4);
        const fmtDate = (d: string) => { const p = d.split('-'); return `${p[2]}/${p[1]}/${p[0].slice(2)}`; };
        const loc = (locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const;

        return (
          <section className="space-y-6">
            {/* ── Section 1: Lifetime Timeline ── */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
              <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>
                {locale === 'en' || isTamil ? 'Dasha Period Analysis' : locale === 'hi' ? 'दशा काल विश्लेषण' : 'दशाकालविश्लेषणम्'}
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gold-primary/30">
                {ds.lifetimeSummary.map((md, i) => {
                  const pid = NAME_TO_ID[md.planet] ?? 0;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedMahaTimeline(selectedMahaTimeline === i ? null : i)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all duration-200 ${
                        md.isCurrent
                          ? 'bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border-gold-primary/50 scale-105 shadow-lg shadow-gold-primary/10'
                          : md.isPast
                            ? 'bg-bg-primary/20 border-gold-primary/10 opacity-40'
                            : 'bg-bg-primary/30 border-gold-primary/15 hover:border-gold-primary/30'
                      } ${selectedMahaTimeline === i ? 'ring-1 ring-gold-primary/40' : ''}`}
                    >
                      <GrahaIconById id={pid} size={16} />
                      <span className={`text-xs font-medium whitespace-nowrap ${md.isCurrent ? 'text-gold-light' : 'text-text-secondary'}`}
                        style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {tl(md.planetName, locale)}
                      </span>
                      <span className="text-xs text-text-secondary/75 whitespace-nowrap">
                        {fmtYear(md.startDate)}-{fmtYear(md.endDate).slice(2)}
                      </span>
                      {md.isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-gold-primary animate-pulse" />}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                {selectedMahaTimeline !== null && ds.lifetimeSummary[selectedMahaTimeline] && (
                  <motion.div
                    key={selectedMahaTimeline}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 rounded-lg bg-bg-primary/30 border border-gold-primary/10 overflow-hidden"
                  >
                    <p className="text-text-secondary text-sm leading-relaxed">{ds.lifetimeSummary[selectedMahaTimeline].theme}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Section 2: Current Mahadasha Card ── */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <GrahaIconById id={NAME_TO_ID[cm.planet] ?? 0} size={40} />
                <div>
                  <h3 className="text-xl text-gold-light font-bold" style={headingFont}>
                    {tl(cm.planetName, locale)} {locale === 'en' || isTamil ? 'Mahadasha' : 'महादशा'}
                  </h3>
                  <p className="text-text-secondary text-sm">{fmtDate(cm.startDate)} — {fmtDate(cm.endDate)} ({cm.years} {locale === 'en' || isTamil ? 'years' : 'वर्ष'})</p>
                </div>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-6 whitespace-pre-line">{cm.overview}</p>

              {/* Activated Yogas */}
              {cm.yogasActivated.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' || isTamil ? 'Activated Yogas' : 'सक्रिय योग'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {cm.yogasActivated.map((y, i) => {
                      const isAuspicious = /raja|dhana|mahapurusha|pancha|lakshmi|saraswati|budhaditya|gajakesari/i.test(y.type);
                      return (
                        <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          isAuspicious ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`} title={y.effect}>
                          {y.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Activated Doshas */}
              {cm.doshasActivated.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' || isTamil ? 'Activated Doshas' : 'सक्रिय दोष'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {cm.doshasActivated.map((d, i) => (
                      <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        d.severity === 'high' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`} title={d.effect}>
                        {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Divisional Insights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['D1', 'D9', 'D10', 'D2'] as const).map((key) => (
                  <div key={key} className="p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10">
                    <span className="text-gold-primary text-xs font-bold">{key}</span>
                    <p className="text-text-secondary text-xs mt-1 leading-relaxed">{cm.divisionalInsights[key]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section 3: Antardasha Stack ── */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
              <h3 className="text-lg text-gold-light font-semibold mb-5" style={headingFont}>
                {locale === 'en' || isTamil ? 'Antardasha Periods' : locale === 'hi' ? 'अन्तर्दशा काल' : 'अन्तर्दशाकालाः'}
              </h3>
              <div className="space-y-3 max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-gold-primary/20 pr-1">
                {cm.antardashas.map((ad, ai) => {
                  const aColors = ASSESSMENT_COLORS[ad.netAssessment];
                  const aLabel = ASSESSMENT_LABELS[ad.netAssessment];
                  const isExpanded = expandedAntar === ai;
                  const adPlanetId = NAME_TO_ID[ad.planet] ?? 0;
                  const lifeKeys = ['career', 'relationships', 'health', 'finance', 'spirituality'] as const;
                  const LIFE_ICONS: Record<string, string> = { career: '\u{1F4BC}', relationships: '\u2764', health: '\u2695', finance: '\u{1F4B0}', spirituality: '\u2728' };
                  const LIFE_LABELS: Record<string, { en: string; hi: string }> = {
                    career: { en: 'Career', hi: 'करियर' },
                    relationships: { en: 'Relations', hi: 'सम्बन्ध' },
                    health: { en: 'Health', hi: 'स्वास्थ्य' },
                    finance: { en: 'Finance', hi: 'वित्त' },
                    spirituality: { en: 'Spirit', hi: 'आध्यात्म' },
                  };

                  return (
                    <div key={ai} className={`rounded-xl border transition-all duration-200 ${
                      ad.isCurrent ? 'border-gold-primary/40 shadow-lg shadow-gold-primary/5' : 'border-gold-primary/10'
                    } ${aColors.bg}`}>
                      {/* Collapsed Header */}
                      <button
                        onClick={() => { setExpandedAntar(isExpanded ? null : ai); setExpandedPratyantar(null); }}
                        className="w-full p-4 text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <GrahaIconById id={adPlanetId} size={28} />
                            <div>
                              <span className="text-gold-light font-semibold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                                {tl(ad.planetName, locale)}
                              </span>
                              {ad.isCurrent && <span className="ml-2 w-1.5 h-1.5 inline-block rounded-full bg-gold-primary animate-pulse" />}
                              <p className="text-text-secondary/75 text-xs">
                                {fmtDate(ad.startDate)} — {fmtDate(ad.endDate)} ({ad.durationMonths} {locale === 'en' || isTamil ? 'mo' : 'मा'})
                              </p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${aColors.bg} ${aColors.border} ${aColors.text}`}>
                            {aLabel[loc as 'en' | 'hi']}
                          </span>
                        </div>
                        {/* Life area arrows */}
                        <div className="flex gap-3 mt-1">
                          {lifeKeys.map(k => {
                            const arrow = lifeAreaArrow(ad.lifeAreas[k]);
                            return (
                              <span key={k} className="flex items-center gap-0.5 text-xs">
                                <span className="text-text-secondary/70">{LIFE_LABELS[k][loc as 'en' | 'hi']}</span>
                                <span className={`font-bold ${lifeAreaColor(arrow)}`}>{arrow}</span>
                              </span>
                            );
                          })}
                        </div>
                        <p className="text-text-secondary text-xs mt-2 line-clamp-1">{ad.summary}</p>
                      </button>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' as const }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-4 border-t border-gold-primary/10 pt-4">
                              {/* Lord Analysis */}
                              <div>
                                <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Lord Analysis' : 'स्वामी विश्लेषण'}</h5>
                                <p className="text-text-secondary text-sm leading-relaxed">{ad.lordAnalysis}</p>
                              </div>

                              {/* Interaction */}
                              <div>
                                <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Interaction' : 'परस्पर सम्बन्ध'}</h5>
                                <p className="text-text-secondary text-sm leading-relaxed">{ad.interaction}</p>
                              </div>

                              {/* Yogas & Doshas */}
                              {ad.yogasTriggered.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Yogas Triggered' : 'योग सक्रिय'}</h5>
                                  <p className="text-emerald-400/80 text-xs">{ad.yogasTriggered.join(', ')}</p>
                                </div>
                              )}
                              {ad.doshasTriggered.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Doshas Triggered' : 'दोष सक्रिय'}</h5>
                                  <p className="text-rose-400/80 text-xs">{ad.doshasTriggered.join(', ')}</p>
                                </div>
                              )}

                              {/* Houses Activated */}
                              {ad.housesActivated.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Houses Activated' : 'भाव सक्रिय'}</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {ad.housesActivated.map((h, hi) => (
                                      <span key={hi} className="px-2 py-0.5 rounded bg-bg-primary/40 border border-gold-primary/10 text-xs text-text-secondary">
                                        <span className="text-gold-light font-medium">H{h.house}</span> {h.theme}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Transit Context */}
                              {ad.transitContext && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Transit Context' : 'गोचर सन्दर्भ'}</h5>
                                  <p className="text-text-secondary text-sm">{ad.transitContext}</p>
                                </div>
                              )}

                              {/* Life Areas */}
                              <div>
                                <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' || isTamil ? 'Life Areas' : 'जीवन क्षेत्र'}</h5>
                                <div className="space-y-2">
                                  {lifeKeys.map(k => {
                                    const arrow = lifeAreaArrow(ad.lifeAreas[k]);
                                    return (
                                      <div key={k} className="flex items-start gap-2">
                                        <span className={`font-bold mt-0.5 ${lifeAreaColor(arrow)}`}>{arrow}</span>
                                        <div>
                                          <span className="text-gold-light text-xs font-medium">{LIFE_LABELS[k][loc as 'en' | 'hi']}</span>
                                          <p className="text-text-secondary text-xs leading-relaxed">{ad.lifeAreas[k]}</p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Divisional Insights */}
                              <div>
                                <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' || isTamil ? 'Divisional Insights' : 'वर्ग दृष्टि'}</h5>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {(['D1', 'D9', 'D10', 'D2'] as const).map(dk => (
                                    <div key={dk} className="p-2 rounded bg-bg-primary/40 border border-gold-primary/10">
                                      <span className="text-gold-primary text-xs font-bold">{dk}</span>
                                      <p className="text-text-secondary text-xs mt-0.5">{ad.divisionalInsights[dk]}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Advice */}
                              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                                <h5 className="text-amber-400 text-xs font-semibold mb-1">{locale === 'en' || isTamil ? 'Advice' : 'सलाह'}</h5>
                                <p className="text-text-secondary text-sm leading-relaxed">{ad.advice}</p>
                              </div>

                              {/* Key Dates */}
                              {ad.keyDates.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-1">{locale === 'en' || isTamil ? 'Key Dates' : 'महत्त्वपूर्ण तिथियाँ'}</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {ad.keyDates.map((kd, ki) => (
                                      <span key={ki} className="px-2 py-0.5 rounded bg-bg-primary/40 border border-gold-primary/10 text-xs text-text-secondary font-mono">{kd}</span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Section 4: Pratyantardasha Blocks */}
                              {ad.pratyantardashas.length > 0 && (
                                <div>
                                  <h5 className="text-gold-primary text-xs uppercase tracking-wider mb-2">{locale === 'en' || isTamil ? 'Pratyantardasha Periods' : 'प्रत्यन्तर्दशा'}</h5>
                                  <div className="flex flex-wrap gap-1.5">
                                    {ad.pratyantardashas.map((pd, pi) => {
                                      const pColors = ASSESSMENT_COLORS[pd.netAssessment];
                                      const ppid = NAME_TO_ID[pd.planet] ?? 0;
                                      const abbr = GRAHA_ABBREVIATIONS[ppid] || pd.planet.slice(0, 2);
                                      const pratyKey = `${ai}-${pi}`;
                                      const isPratyExpanded = expandedPratyantar === pratyKey;

                                      return (
                                        <div key={pi} className="flex flex-col items-center">
                                          <button
                                            onClick={(e) => { e.stopPropagation(); setExpandedPratyantar(isPratyExpanded ? null : pratyKey); }}
                                            className={`relative w-10 h-10 rounded-lg flex items-center justify-center border text-xs font-bold transition-all ${pColors.bg} ${pColors.border} ${pColors.text} hover:scale-110`}
                                            title={`${tl(pd.planetName, locale)} | ${fmtDate(pd.startDate)}-${fmtDate(pd.endDate)} | ${pd.keyTheme}`}
                                          >
                                            {abbr}
                                            {pd.isCritical && (
                                              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold-primary" />
                                            )}
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  {/* Expanded pratyantardasha detail */}
                                  <AnimatePresence>
                                    {expandedPratyantar?.startsWith(`${ai}-`) && (() => {
                                      const pIdx = parseInt(expandedPratyantar.split('-')[1]);
                                      const pd = ad.pratyantardashas[pIdx];
                                      if (!pd) return null;
                                      const pColors = ASSESSMENT_COLORS[pd.netAssessment];
                                      const pLabel = ASSESSMENT_LABELS[pd.netAssessment];
                                      return (
                                        <motion.div
                                          key={expandedPratyantar}
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden"
                                        >
                                          <div className={`mt-3 p-3 rounded-lg border ${pColors.bg} ${pColors.border}`}>
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <GrahaIconById id={NAME_TO_ID[pd.planet] ?? 0} size={20} />
                                                <span className="text-gold-light text-sm font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                                                  {tl(pd.planetName, locale)}
                                                </span>
                                                <span className="text-text-secondary/70 text-xs">{fmtDate(pd.startDate)} — {fmtDate(pd.endDate)} ({pd.durationDays}d)</span>
                                              </div>
                                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pColors.text}`}>{pLabel[loc as 'en' | 'hi']}</span>
                                            </div>
                                            <p className="text-text-secondary text-xs mb-1"><span className="text-gold-primary font-medium">{locale === 'en' || isTamil ? 'Theme' : 'विषय'}:</span> {pd.keyTheme}</p>
                                            <p className="text-text-secondary text-xs"><span className="text-gold-primary font-medium">{locale === 'en' || isTamil ? 'Advice' : 'सलाह'}:</span> {pd.advice}</p>
                                            {pd.expanded && (
                                              <div className="mt-2 pt-2 border-t border-gold-primary/10 space-y-1">
                                                <p className="text-text-secondary text-xs">{pd.expanded.lordAnalysis}</p>
                                                <div className="flex gap-2">
                                                  <span className="text-xs text-text-secondary/75"><span className="text-gold-primary">D1:</span> {pd.expanded.divisionalInsights.D1}</span>
                                                  {pd.expanded.divisionalInsights.D9 && <span className="text-xs text-text-secondary/75"><span className="text-gold-primary">D9:</span> {pd.expanded.divisionalInsights.D9}</span>}
                                                  {pd.expanded.divisionalInsights.D10 && <span className="text-xs text-text-secondary/75"><span className="text-gold-primary">D10:</span> {pd.expanded.divisionalInsights.D10}</span>}
                                                </div>
                                                {pd.expanded.warning && (
                                                  <p className="text-rose-400 text-xs mt-1 p-2 rounded bg-rose-500/5 border border-rose-500/10">{pd.expanded.warning}</p>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </motion.div>
                                      );
                                    })()}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ===== DASHA INSIGHT (fallback when synthesis unavailable) ===== */}
      {!tip.dashaSynthesis && tip.dashaInsight.currentMaha && (() => {
        // Extract planet name from "Mercury Mahadasha" or "बुध महादशा"
        const mahaText = tip.dashaInsight.currentMaha;
        const PLANET_NAME_TO_ID: Record<string, number> = { Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8, सूर्य: 0, चन्द्र: 1, मंगल: 2, बुध: 3, बृहस्पति: 4, शुक्र: 5, शनि: 6, राहु: 7, केतु: 8 };
        const mahaPlanetId = Object.entries(PLANET_NAME_TO_ID).find(([name]) => mahaText.includes(name))?.[1] ?? 0;
        const antarText = tip.dashaInsight.currentAntar || '';
        const antarPlanetId = Object.entries(PLANET_NAME_TO_ID).find(([name]) => antarText.includes(name))?.[1] ?? 0;
        const mahaGraha = GRAHAS[mahaPlanetId];
        const antarGraha = GRAHAS[antarPlanetId];

        return (
        <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
          {/* Header with planet icon */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-primary/20 to-gold-dark/10 border border-gold-primary/25 flex items-center justify-center shadow-lg shadow-gold-primary/10">
              <GrahaIconById id={mahaPlanetId} size={32} />
            </div>
            <div>
              <h3 className="text-xl text-gold-light font-bold" style={headingFont}>{tTip('dashaAnalysis')}</h3>
              <p className="text-text-secondary/60 text-xs">{locale === 'en' || isTamil ? 'Your current planetary period' : 'आपका वर्तमान ग्रह काल'}</p>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4">
            {/* Current Mahadasha — mega card */}
            <div className="rounded-xl p-5 border-2 border-gold-primary/20 bg-gradient-to-r from-gold-primary/8 via-transparent to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: mahaGraha?.color || '#d4a853' }} />
                <span className="text-gold-light font-bold text-lg" style={headingFont}>{tip.dashaInsight.currentMaha}</span>
              </div>
              <p className="text-text-primary/80 text-sm leading-relaxed whitespace-pre-line" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tip.dashaInsight.currentMahaAnalysis}</p>
            </div>

            {/* Current Antardasha */}
            {tip.dashaInsight.currentAntar && (
              <div className="rounded-xl p-4 border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] ml-2 sm:ml-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center bg-bg-primary/50">
                    <GrahaIconById id={antarPlanetId} size={18} />
                  </div>
                  <div>
                    <span className="font-semibold text-sm" style={{ color: antarGraha?.color || '#e6e2d8' }}>{tip.dashaInsight.currentAntar}</span>
                    <p className="text-text-secondary/50 text-[10px]">{locale === 'en' || isTamil ? 'Sub-period within the main period' : 'मुख्य काल के भीतर उपकाल'}</p>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed ml-11" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tip.dashaInsight.currentAntarAnalysis}</p>
              </div>
            )}

            {/* Next Transition */}
            {tip.dashaInsight.upcoming && (
              <div className="rounded-xl p-4 border border-indigo-500/15 bg-indigo-500/5 ml-2 sm:ml-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-indigo-400 text-xs uppercase tracking-wider font-bold">{tTip('upcoming')}</span>
                  <span className="w-4 h-px bg-indigo-500/30 flex-1" />
                </div>
                <p className="text-text-secondary/80 text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tip.dashaInsight.upcoming}</p>
              </div>
            )}
          </div>
        </section>
        );
      })()}

      {/* ===== TRANSIT RADAR ===== */}
      {kundali.ashtakavarga && (
        <>
        <a href={`/${locale}/learn/transits`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1 mb-2">
          {locale === 'en' || isTamil ? 'Learn about Transits \u2192' : 'गोचर के बारे में जानें \u2192'}
        </a>
        <Suspense fallback={<div className="text-center py-8 text-text-secondary">Loading...</div>}>
          <TransitRadar
            ascendantSign={kundali.ascendant.sign}
            savTable={kundali.ashtakavarga.savTable}
            locale={locale}
          />
        </Suspense>
        </>
      )}

      {/* ===== PLANETARY STRENGTH ===== */}
      {tip.strengthOverview.length > 0 && (
        <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
          <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>
            {locale === 'en' || isTamil ? 'Planetary Strength (Shadbala)' : locale === 'hi' ? 'ग्रह बल (षड्बल)' : 'ग्रहबलम् (षड्बलम्)'}
          </h3>
          <p className="text-text-secondary/60 text-xs mb-4">
            {locale === 'en' || isTamil
              ? 'Ratio = actual Rupas ÷ minimum required (BPHS Ch.27). ≥1.5× = Strong, ≥1.0× = Adequate, <1.0× = Weak.'
              : 'अनुपात = वास्तविक रूपा ÷ न्यूनतम आवश्यक (BPHS अ.27)। ≥1.5× = बलवान, ≥1.0× = पर्याप्त, <1.0× = दुर्बल।'}
          </p>
          <div className="space-y-3">
            {tip.strengthOverview.map((s, i) => {
              const ratio = (s as any).ratio as number | undefined;
              const rupas = (s as any).rupas as number | undefined;
              const ratioColor = ratio !== undefined
                ? (ratio >= 1.5 ? 'text-green-400' : ratio >= 1.0 ? 'text-amber-300' : 'text-red-400')
                : (s.strength >= 80 ? 'text-green-400' : s.strength >= 60 ? 'text-amber-300' : 'text-red-400');
              return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm w-20 text-right font-medium" style={{ color: s.planetColor, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}>{s.planetName}</span>
                <div className="flex-1 bg-gold-primary/10 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.strength}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: s.planetColor, opacity: 0.7 }}
                  />
                </div>
                <span className={`text-xs w-28 text-right font-mono ${ratioColor}`}>
                  {ratio !== undefined ? `${ratio.toFixed(2)}×` : `${s.strength}%`}
                  {rupas !== undefined && <span className="text-text-secondary/40 ml-1">({rupas.toFixed(1)}R)</span>}
                  <span className="ml-1 font-sans">{s.status}</span>
                </span>
              </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== REMEDIES ===== */}
      {(tip.remedies.gemstones.length > 0 || tip.remedies.mantras.length > 0) && (
        <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
          <h3 className="text-xl text-gold-light font-semibold mb-6" style={headingFont}>{tTip('remedies')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tip.remedies.gemstones.length > 0 && (
              <div>
                <h4 className="text-gold-dark text-sm uppercase tracking-wider mb-3">{locale === 'en' || isTamil ? 'Gemstones' : 'रत्न'}</h4>
                <div className="space-y-2">
                  {tip.remedies.gemstones.map((g, i) => (
                    <div key={i} className="p-3 rounded-lg bg-bg-primary/30 border border-gold-primary/5">
                      <p className="text-gold-light text-sm font-semibold">{g.name}</p>
                      <p className="text-text-secondary/70 text-xs">{locale === 'en' || isTamil ? 'For' : 'के लिए'}: {g.planet}</p>
                      <p className="text-text-secondary text-xs mt-1">{g.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tip.remedies.mantras.length > 0 && (
              <div>
                <h4 className="text-gold-dark text-sm uppercase tracking-wider mb-3">{locale === 'en' || isTamil ? 'Mantras' : 'मन्त्र'}</h4>
                <div className="space-y-2">
                  {tip.remedies.mantras.map((m, i) => (
                    <div key={i} className="p-3 rounded-lg bg-bg-primary/30 border border-gold-primary/5">
                      <p className="text-gold-light text-sm font-semibold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{m.name}</p>
                      <p className="text-text-secondary/70 text-xs">{locale === 'en' || isTamil ? 'For' : 'के लिए'}: {m.planet}</p>
                      <p className="text-text-secondary text-xs mt-1">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tip.remedies.practices.length > 0 && (
              <div>
                <h4 className="text-gold-dark text-sm uppercase tracking-wider mb-3">{locale === 'en' || isTamil ? 'Charitable Practices' : 'दानशील कार्य'}</h4>
                <div className="space-y-2">
                  {tip.remedies.practices.map((p, i) => (
                    <div key={i} className="p-3 rounded-lg bg-bg-primary/30 border border-gold-primary/5">
                      <p className="text-gold-light text-sm font-semibold">{p.name}</p>
                      <p className="text-text-secondary text-xs mt-1">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== GRAHA SHANTI PUJA RECOMMENDATIONS ===== */}
      {afflictedPlanets.length > 0 && (
        <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
          <h3 className="text-xl text-gold-light font-semibold mb-2" style={headingFont}>
            {locale === 'en' || isTamil ? 'Recommended Graha Shanti Pujas' : locale === 'hi' ? 'अनुशंसित ग्रह शान्ति पूजा' : 'अनुशंसित ग्रहशान्तिपूजाः'}
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            {locale === 'en' || isTamil
              ? 'Based on your chart analysis, the following planets are afflicted and may benefit from graha shanti rituals.'
              : 'आपकी कुण्डली विश्लेषण के अनुसार, निम्नलिखित ग्रह पीड़ित हैं और ग्रह शान्ति पूजा से लाभ हो सकता है।'}
          </p>
          <div className="space-y-4">
            {afflictedPlanets.map((ap) => {
              const severityConfig = {
                severe: { border: 'border-rose-500/20', bg: 'bg-rose-500/8', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-400', label: locale === 'en' || isTamil ? 'Severe' : 'गम्भीर' },
                moderate: { border: 'border-amber-500/20', bg: 'bg-amber-500/8', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400', label: locale === 'en' || isTamil ? 'Moderate' : 'मध्यम' },
                mild: { border: 'border-blue-500/20', bg: 'bg-blue-500/8', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-400', label: locale === 'en' || isTamil ? 'Mild' : 'साधारण' },
              }[ap.severity];
              const planetData = kundali.planets.find(p => p.planet.id === ap.planetId);
              const planetName = tl(planetData?.planet.name, locale) || ap.planetName;
              return (
                <div key={ap.planetId} className={`p-4 rounded-xl border ${severityConfig.border} ${severityConfig.bg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <GrahaIconById id={ap.planetId} size={32} />
                      <span className={`text-lg font-bold ${severityConfig.text}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' }}>
                        {planetName}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${severityConfig.badge}`}>
                      {severityConfig.label}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">{ap.reasons.join(', ')}</p>
                  <a
                    href={`/${locale}/puja/${ap.remedySlug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gold-primary hover:text-gold-light transition-colors"
                  >
                    {locale === 'en' || isTamil
                      ? `${planetName} Graha Shanti Puja`
                      : `${planetName} ग्रह शान्ति पूजा`}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// ===== GRAHA TAB COMPONENT =====
function GrahaTab({ grahaDetails, upagrahas, locale, isDevanagari, headingFont, planetInsights }: {
  grahaDetails: GrahaDetail[];
  upagrahas: UpagrahaPosition[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
  planetInsights?: PlanetInsight[];
}) {
  const isTamil = String(locale) === 'ta';
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' || isTamil ? 'Graha Details' : 'ग्रह विवरण'}
      </h3>

      {/* Graha Table */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="text-text-secondary border-b border-gold-primary/15 text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' || isTamil ? 'Graha' : 'ग्रह'}</th>
              <th className="text-center py-3 px-1">R</th>
              <th className="text-center py-3 px-1">C</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' || isTamil ? 'Longitude' : 'भोगांश'}</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' || isTamil ? 'Nakshatra / Swami' : 'नक्षत्र / स्वामी'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Raw L.' : 'कच्चा अं.'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Latitude' : 'अक्षांश'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'R.A.' : 'विषु.अं.'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Declination' : 'क्रान्ति'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Speed °/day' : 'गति °/दि'}</th>
            </tr>
          </thead>
          <tbody>
            {grahaDetails.map((g) => (
              <tr key={g.planetId} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <GrahaIconById id={g.planetId} size={20} />
                    <span className="text-gold-light font-medium" style={bodyFont}>{tl(g.planetName, locale)}</span>
                  </div>
                </td>
                <td className="text-center py-2.5 px-1">
                  {g.isRetrograde && <span className="text-red-400 font-bold text-xs">R</span>}
                </td>
                <td className="text-center py-2.5 px-1">
                  {g.isCombust && <span className="text-orange-400 font-bold text-xs">C</span>}
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-text-primary">{tl(g.signName, locale)}</span>
                  <span className="text-text-secondary ml-1">{g.signDegree}</span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-text-primary" style={bodyFont}>{tl(g.nakshatraName, locale)}</span>
                  <span className="text-gold-dark ml-1 text-xs">P{g.nakshatraPada}</span>
                  <span className="text-text-secondary/75 ml-1 text-xs">/ {tl(g.nakshatraLord, locale)}</span>
                </td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.longitude.toFixed(2)}°</td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.latitude.toFixed(4)}°</td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.rightAscension.toFixed(2)}°</td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.declination.toFixed(2)}°</td>
                <td className="py-2.5 px-2 text-right font-mono text-xs">
                  <span className={g.speed < 0 ? 'text-red-400' : 'text-text-secondary'}>{g.speed.toFixed(4)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Planetary Interpretations */}
      {planetInsights && planetInsights.length > 0 && (() => {
        const PLANET_PALETTE: Record<number, { border: string; glow: string; badge: string; label: string }> = {
          0: { border: 'border-amber-500/30',  glow: 'bg-amber-500/5',   badge: 'bg-amber-500/15 border-amber-500/25 text-amber-300',   label: 'text-amber-200' },  // Sun
          1: { border: 'border-slate-400/30',  glow: 'bg-slate-400/5',   badge: 'bg-slate-400/15 border-slate-400/25 text-slate-300',   label: 'text-slate-200' },  // Moon
          2: { border: 'border-red-500/30',    glow: 'bg-red-500/5',     badge: 'bg-red-500/15 border-red-500/25 text-red-300',         label: 'text-red-200'   },  // Mars
          3: { border: 'border-emerald-500/30',glow: 'bg-emerald-500/5', badge: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300', label: 'text-emerald-200' }, // Mercury
          4: { border: 'border-yellow-500/30', glow: 'bg-yellow-500/5',  badge: 'bg-yellow-500/15 border-yellow-500/25 text-yellow-300', label: 'text-yellow-200' }, // Jupiter
          5: { border: 'border-rose-400/30',   glow: 'bg-rose-400/5',    badge: 'bg-rose-400/15 border-rose-400/25 text-rose-300',       label: 'text-rose-200'  },  // Venus
          6: { border: 'border-indigo-400/30', glow: 'bg-indigo-400/5',  badge: 'bg-indigo-400/15 border-indigo-400/25 text-indigo-300', label: 'text-indigo-200' }, // Saturn
          7: { border: 'border-violet-500/30', glow: 'bg-violet-500/5',  badge: 'bg-violet-500/15 border-violet-500/25 text-violet-300', label: 'text-violet-200' }, // Rahu
          8: { border: 'border-orange-700/30', glow: 'bg-orange-700/5',  badge: 'bg-orange-700/15 border-orange-700/25 text-orange-300', label: 'text-orange-200' }, // Ketu
        };
        return (
          <div className="mt-8">
            <h4 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
              {locale === 'en' || isTamil ? 'Planetary Interpretations' : 'ग्रह व्याख्या'}
            </h4>
            <div className="space-y-3">
              {grahaDetails.map((g) => {
                const insight = planetInsights.find(pi => pi.planetId === g.planetId);
                if (!insight) return null;
                const pal = PLANET_PALETTE[g.planetId] ?? PLANET_PALETTE[0];
                return (
                  <div key={g.planetId} className={`relative overflow-hidden rounded-xl border ${pal.border} bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4`}>
                    <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full ${pal.glow} blur-2xl pointer-events-none`} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <GrahaIconById id={g.planetId} size={22} />
                        <span className={`font-bold text-sm ${pal.label}`} style={bodyFont}>{tl(g.planetName, locale)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${pal.badge}`} style={bodyFont}>
                          {tl(g.signName, locale)}
                        </span>
                        <span className="text-text-secondary/70 text-xs" style={bodyFont}>
                          {locale === 'en' || isTamil ? `House ${insight.house}` : `भाव ${insight.house}`}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>{insight.description}</p>
                      {insight.implications && (
                        <p className="text-text-secondary/65 text-sm mt-2 leading-relaxed border-t border-white/5 pt-2" style={bodyFont}>{insight.implications}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Upagrahas */}
      {upagrahas.length > 0 && (() => {
        const UPAGRAHA_NOTES: Record<string, { en: string; hi: string }> = {
          'Dhuma': { en: 'Smoke of the Sun — indicates obstacles and hidden enemies when afflicted', hi: 'सूर्य का धूम — पीड़ित होने पर बाधाएँ और छिपे शत्रु' },
          'Vyatipata': { en: 'Calamity point — sensitive degree that can trigger sudden events', hi: 'आपत्ति बिन्दु — अचानक घटनाओं को उत्प्रेरित करने वाला संवेदनशील अंश' },
          'Parivesha': { en: 'Halo of the Moon — spiritual awareness and intuitive perception', hi: 'चन्द्र का परिवेश — आध्यात्मिक जागरूकता और अन्तर्ज्ञान' },
          'Indrachapa': { en: 'Indra\'s bow — rainbow point indicating divine grace and protection', hi: 'इन्द्रचाप — दिव्य कृपा और सुरक्षा का सूचक इन्द्रधनुष बिन्दु' },
          'Upaketu': { en: 'Sub-Ketu — deepens Ketu\'s spiritual and detachment effects', hi: 'उपकेतु — केतु के आध्यात्मिक और वैराग्य प्रभावों को गहन करता है' },
          'Kala': { en: 'Time — indicates karmic timing and fateful periods in life', hi: 'काल — कार्मिक समय और जीवन के भाग्यपूर्ण काल का सूचक' },
          'Mrityu': { en: 'Death point — sensitive degree related to health vulnerabilities', hi: 'मृत्यु बिन्दु — स्वास्थ्य कमजोरियों से सम्बन्धित संवेदनशील अंश' },
          'Ardhaprahara': { en: 'Half-watch — indicates midpoint energy and balance in the chart', hi: 'अर्धप्रहर — कुण्डली में मध्यबिन्दु ऊर्जा और सन्तुलन का सूचक' },
          'Gulika': { en: 'Son of Saturn — malefic point indicating chronic issues and karmic debts', hi: 'शनि पुत्र — दीर्घकालिक समस्याओं और कार्मिक ऋणों का अशुभ बिन्दु' },
          'Mandi': { en: 'Son of Saturn — similar to Gulika, indicates delays and karmic blocks', hi: 'शनि पुत्र — गुलिक के समान, विलम्ब और कार्मिक अवरोधों का सूचक' },
        };
        return (
          <div>
            <h3 className="text-xl font-bold text-gold-gradient text-center mb-4" style={headingFont}>
              {locale === 'en' || isTamil ? 'Upagraha Positions' : 'उपग्रह स्थिति'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {upagrahas.map((u, i) => (
                <div key={i} className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 text-center">
                  <p className="text-gold-light font-bold text-sm mb-1" style={bodyFont}>{tl(u.name, locale)}</p>
                  <RashiIconById id={u.sign} size={28} />
                  <p className="text-text-primary text-sm mt-1" style={bodyFont}>{tl(u.signName, locale)} {u.degree}</p>
                  <p className="text-text-secondary/75 text-xs mt-0.5" style={bodyFont}>{tl(u.nakshatra, locale)}</p>
                  <p className="text-text-secondary/70 text-xs mt-1 leading-relaxed">{UPAGRAHA_NOTES[u.name.en]?.[locale === 'en' || isTamil ? 'en' : 'hi'] || ''}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ===== YOGAS TAB COMPONENT =====
function YogasTab({ yogas, locale, isDevanagari, headingFont }: {
  yogas: YogaComplete[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const isTamil = String(locale) === 'ta';
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const [filter, setFilter] = useState<'all' | 'present' | 'auspicious' | 'inauspicious'>('all');
  const [expandedYoga, setExpandedYoga] = useState<string | null>(null);

  // Deduplicate yogas by ID — keep the one that's present, or first occurrence
  const deduped = useMemo(() => {
    const seen = new Map<string, YogaComplete>();
    for (const y of yogas) {
      const existing = seen.get(y.id);
      if (!existing || (y.present && !existing.present)) {
        seen.set(y.id, y);
      }
    }
    return [...seen.values()];
  }, [yogas]);

  const filtered = deduped.filter(y => {
    if (filter === 'present') return y.present;
    if (filter === 'auspicious') return y.isAuspicious;
    if (filter === 'inauspicious') return !y.isAuspicious;
    return true;
  });

  const presentCount = deduped.filter(y => y.present).length;
  const auspiciousPresent = deduped.filter(y => y.present && y.isAuspicious).length;
  const inauspiciousPresent = deduped.filter(y => y.present && !y.isAuspicious).length;

  const CATEGORY_LABELS: Record<string, { en: string; hi: string }> = {
    dosha: { en: 'Doshas', hi: 'दोष' },
    mahapurusha: { en: 'Pancha Mahapurusha', hi: 'पंच महापुरुष' },
    moon_based: { en: 'Moon-Based Yogas', hi: 'चन्द्र आधारित योग' },
    sun_based: { en: 'Sun-Based Yogas', hi: 'सूर्य आधारित योग' },
    raja: { en: 'Raja Yogas', hi: 'राजयोग' },
    wealth: { en: 'Wealth Yogas', hi: 'धनयोग' },
    inauspicious: { en: 'Inauspicious Yogas', hi: 'अशुभ योग' },
    other: { en: 'Other Yogas', hi: 'अन्य योग' },
  };

  const categories = ['dosha', 'mahapurusha', 'moon_based', 'sun_based', 'raja', 'wealth', 'inauspicious', 'other'];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' || isTamil ? 'Yogas Analysis' : 'योग विश्लेषण'}
      </h3>

      {/* Summary badges */}
      <div className="flex justify-center gap-4 text-sm">
        <span className="px-3 py-1 rounded-full bg-gold-primary/10 text-gold-light border border-gold-primary/20">
          {locale === 'en' || isTamil ? `${presentCount} Present` : `${presentCount} उपस्थित`}
        </span>
        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
          {locale === 'en' || isTamil ? `${auspiciousPresent} Auspicious` : `${auspiciousPresent} शुभ`}
        </span>
        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          {locale === 'en' || isTamil ? `${inauspiciousPresent} Inauspicious` : `${inauspiciousPresent} अशुभ`}
        </span>
      </div>

      <InfoBlock
        id="kundali-yogas"
        title={locale === 'hi' ? 'योग क्या हैं?' : 'What are Yogas?'}
        defaultOpen={false}
      >
        {locale === 'hi'
          ? 'वैदिक ज्योतिष में "योग" एक विशिष्ट ग्रह संयोजन है जो एक निश्चित परिणाम उत्पन्न करता है — जैसे एक ब्रह्मांडीय नुस्खा। राजयोग शक्ति और अधिकार लाते हैं, धनयोग धन लाते हैं, महापुरुष योग असाधारण व्यक्तित्व बनाते हैं (केवल 5 होते हैं), और अशुभ योग चुनौतियाँ लाते हैं जो चरित्र निर्माण करती हैं। "उपस्थित" का अर्थ है कि यह संयोजन आपकी कुण्डली में विद्यमान है। "शक्ति" दिखाती है कि यह कितनी प्रभावशाली ढंग से काम करता है। हरा = शुभ, लाल = चुनौतीपूर्ण किंतु प्रायः परिवर्तनकारी।'
          : 'In Vedic astrology, a \'Yoga\' is a specific planetary combination that produces a defined result — like a cosmic recipe. Raja Yogas bring power and authority, Dhana Yogas bring wealth, Mahapurusha Yogas create exceptional personalities (only 5 exist), and Inauspicious Yogas bring challenges that build character. \'Present\' means the combination exists in your chart. \'Strength\' shows how powerfully it operates. Green = auspicious, Red = challenging but often transformative.'}
      </InfoBlock>

      {/* Filters */}
      <div className="flex justify-center gap-2 flex-wrap">
        {([
          { key: 'all' as const, label: locale === 'en' || isTamil ? 'All' : 'सभी' },
          { key: 'present' as const, label: locale === 'en' || isTamil ? 'Present' : 'उपस्थित' },
          { key: 'auspicious' as const, label: locale === 'en' || isTamil ? 'Auspicious' : 'शुभ' },
          { key: 'inauspicious' as const, label: locale === 'en' || isTamil ? 'Inauspicious' : 'अशुभ' },
        ]).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Yogas grouped by category */}
      {categories.map(cat => {
        const catYogas = filtered.filter(y => y.category === cat);
        if (catYogas.length === 0) return null;
        const catLabel = CATEGORY_LABELS[cat] || { en: cat, hi: cat };
        return (
          <div key={cat}>
            <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-3 font-bold" style={bodyFont}>
              {catLabel[(locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const]}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {catYogas.map(y => (
                <div key={y.id}
                  className={`rounded-xl p-3 border transition-all cursor-pointer ${
                    y.present
                      ? 'border-gold-primary/30 bg-gold-primary/5'
                      : 'border-gold-primary/5 bg-bg-primary/20 opacity-50'
                  }`}
                  onClick={() => setExpandedYoga(expandedYoga === y.id ? null : y.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gold-light font-medium text-sm" style={bodyFont}>{tl(y.name, locale)}</span>
                      {y.present && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                          y.strength === 'Strong' ? 'bg-green-500/20 text-green-400' :
                          y.strength === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {y.strength}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                        y.isAuspicious ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {y.isAuspicious ? (locale === 'en' || isTamil ? 'Auspicious' : 'शुभ') : (locale === 'en' || isTamil ? 'Inauspicious' : 'अशुभ')}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${y.present ? 'bg-gold-primary/20 text-gold-light' : 'bg-bg-primary/50 text-text-secondary/70'}`}>
                        {y.present ? (locale === 'en' || isTamil ? 'Present' : 'है') : (locale === 'en' || isTamil ? 'Absent' : 'नहीं')}
                      </span>
                    </div>
                  </div>
                  {expandedYoga === y.id && (
                    <div className="mt-2 pt-2 border-t border-gold-primary/10 space-y-1">
                      <p className="text-text-secondary text-xs" style={bodyFont}>{tl(y.description, locale)}</p>
                      <p className="text-gold-dark text-xs italic" style={bodyFont}>
                        {locale === 'en' || isTamil ? 'Rule' : 'नियम'}: {tl(y.formationRule, locale)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== SHADBALA TAB COMPONENT =====
function ShadbalaTab({ shadbala, locale, isDevanagari, headingFont }: {
  shadbala: ShadBalaComplete[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const isTamil = String(locale) === 'ta';
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const PLANET_LABELS: Record<string, { en: string; hi: string }> = {
    Sun: { en: 'Sun', hi: 'सूर्य' }, Moon: { en: 'Moon', hi: 'चन्द्र' },
    Mars: { en: 'Mars', hi: 'मंगल' }, Mercury: { en: 'Mercury', hi: 'बुध' },
    Jupiter: { en: 'Jupiter', hi: 'बृहस्पति' }, Venus: { en: 'Venus', hi: 'शुक्र' },
    Saturn: { en: 'Saturn', hi: 'शनि' },
  };

  const ROW_LABELS: { key: string; en: string; hi: string }[] = [
    { key: 'rank', en: 'Relative Rank', hi: 'सापेक्ष क्रम' },
    { key: 'sthana', en: 'Sthana Bala', hi: 'स्थान बल' },
    { key: 'disha', en: 'Dig Bala', hi: 'दिग्बल' },
    { key: 'kala', en: 'Kala Bala', hi: 'कालबल' },
    { key: 'chesta', en: 'Chesta Bala', hi: 'चेष्टाबल' },
    { key: 'naisargika', en: 'Naisargika Bala', hi: 'नैसर्गिक बल' },
    { key: 'drishti', en: 'Drik Bala', hi: 'दृक्बल' },
    { key: 'divider1', en: '', hi: '' },
    { key: 'total', en: 'Total Pinda', hi: 'कुल पिण्ड' },
    { key: 'rupas', en: 'Rupas', hi: 'रूप' },
    { key: 'minReq', en: 'Min. Required', hi: 'न्यूनतम' },
    { key: 'ratio', en: 'Strength Ratio', hi: 'बल अनुपात' },
    { key: 'divider2', en: '', hi: '' },
    { key: 'ishta', en: 'Ishta Phala', hi: 'इष्ट फल' },
    { key: 'kashta', en: 'Kashta Phala', hi: 'कष्ट फल' },
  ];

  function getValue(s: ShadBalaComplete, key: string): string {
    switch (key) {
      case 'rank': return String(s.rank);
      case 'sthana': return s.sthanaBala.toFixed(2);
      case 'disha': return s.digBala.toFixed(2);
      case 'kala': return s.kalaBala.toFixed(2);
      case 'chesta': return s.cheshtaBala.toFixed(2);
      case 'naisargika': return s.naisargikaBala.toFixed(2);
      case 'drishti': return (s.drikBala >= 0 ? '+' : '') + s.drikBala.toFixed(2);
      case 'total': return s.totalPinda.toFixed(2);
      case 'rupas': return s.rupas.toFixed(2);
      case 'minReq': return s.minRequired.toFixed(2);
      case 'ratio': return s.strengthRatio.toFixed(4);
      case 'ishta': return s.ishtaPhala.toFixed(2);
      case 'kashta': return s.kashtaPhala.toFixed(2);
      default: return '';
    }
  }

  function getColor(s: ShadBalaComplete, key: string): string {
    if (key === 'ratio') {
      return s.strengthRatio >= 1.5 ? 'text-green-400' : s.strengthRatio >= 1.0 ? 'text-gold-light' : 'text-red-400';
    }
    if (key === 'drishti') return s.drikBala >= 0 ? 'text-green-400' : 'text-red-400';
    if (key === 'rank') return s.rank <= 2 ? 'text-green-400 font-bold' : 'text-text-secondary';
    return 'text-text-secondary';
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' || isTamil ? 'Shadbala — Six-Fold Strength' : 'षड्बल — छह प्रकार का बल'}
      </h3>
      <p className="text-text-secondary text-xs text-center max-w-2xl mx-auto" style={bodyFont}>
        {locale === 'en' || isTamil
          ? 'Classical six-component planetary strength calculation. Values in Shashtiamshas (60ths of a Rupa). Strength Ratio above 1.0 indicates adequate strength.'
          : 'शास्त्रीय षड्बल गणना। मान षष्ट्यंशों में। बल अनुपात 1.0 से अधिक पर्याप्त बल दर्शाता है।'}
      </p>

      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold-primary/20">
              <th className="text-left py-3 px-2 text-text-secondary text-xs" style={bodyFont}></th>
              {shadbala.map(s => {
                const label = PLANET_LABELS[s.planet] || { en: s.planet, hi: s.planet };
                return (
                  <th key={s.planetId} className="text-center py-3 px-2 min-w-[70px]">
                    <GrahaIconById id={s.planetId} size={20} />
                    <p className="text-gold-light text-xs font-medium mt-1" style={bodyFont}>{label[(locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const]}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ROW_LABELS.map(row => {
              if (row.key.startsWith('divider')) {
                return <tr key={row.key}><td colSpan={8} className="py-1"><div className="border-t border-gold-primary/15" /></td></tr>;
              }
              const isSummary = ['total', 'rupas', 'ratio'].includes(row.key);
              return (
                <tr key={row.key} className={isSummary ? 'bg-gold-primary/5' : 'hover:bg-gold-primary/3'}>
                  <td className={`py-2 px-2 text-xs ${isSummary ? 'text-gold-light font-bold' : 'text-text-secondary'}`} style={bodyFont}>
                    {row[(locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const]}
                  </td>
                  {shadbala.map(s => (
                    <td key={s.planetId} className={`py-2 px-2 text-center font-mono text-xs ${isSummary ? 'font-bold ' : ''}${getColor(s, row.key)}`}>
                      {getValue(s, row.key)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ===== BHAVABALA TAB COMPONENT =====
function BhavabalaTab({ bhavabala, locale, isDevanagari, headingFont }: {
  bhavabala: BhavaBalaResult[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const isTamil = String(locale) === 'ta';
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const HOUSE_NAMES: Record<number, { en: string; hi: string }> = {
    1: { en: 'Self / Lagna', hi: 'तनु / लग्न' },
    2: { en: 'Wealth / Dhana', hi: 'धन' },
    3: { en: 'Siblings / Sahaja', hi: 'सहज' },
    4: { en: 'Mother / Sukha', hi: 'सुख / मातृ' },
    5: { en: 'Children / Putra', hi: 'पुत्र / संतान' },
    6: { en: 'Enemies / Ripu', hi: 'रिपु / शत्रु' },
    7: { en: 'Spouse / Yuvati', hi: 'युवती / जाया' },
    8: { en: 'Longevity / Randhra', hi: 'रन्ध्र / आयु' },
    9: { en: 'Fortune / Dharma', hi: 'धर्म / भाग्य' },
    10: { en: 'Career / Karma', hi: 'कर्म / राज्य' },
    11: { en: 'Gains / Labha', hi: 'लाभ' },
    12: { en: 'Loss / Vyaya', hi: 'व्यय' },
  };

  const maxTotal = Math.max(...bhavabala.map(b => b.total));

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' || isTamil ? 'Bhavabala — House Strength' : 'भावबल — भाव शक्ति'}
      </h3>

      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-secondary border-b border-gold-primary/15 text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' || isTamil ? 'Bhava' : 'भाव'}</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' || isTamil ? 'Signification' : 'कारकत्व'}</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' || isTamil ? 'Lord' : 'स्वामी'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Lord Bala' : 'स्वामी बल'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Dig Bala' : 'दिग्बल'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Drishti' : 'दृष्टि'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Total' : 'कुल'}</th>
              <th className="text-right py-3 px-2">%</th>
            </tr>
          </thead>
          <tbody>
            {bhavabala.map(b => {
              const houseName = HOUSE_NAMES[b.bhava] || { en: `House ${b.bhava}`, hi: `भाव ${b.bhava}` };
              const pct = b.strengthPercent;
              const color = pct >= 120 ? 'text-green-400' : pct >= 90 ? 'text-gold-light' : 'text-red-400';
              return (
                <tr key={b.bhava} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                  <td className="py-2.5 px-2 text-gold-light font-bold">{b.bhava}</td>
                  <td className="py-2.5 px-2 text-text-secondary text-xs" style={bodyFont}>{houseName[(locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const]}</td>
                  <td className="py-2.5 px-2">
                    {b.lordId <= 6 && <GrahaIconById id={b.lordId} size={16} />}
                    <span className="text-text-primary text-xs ml-1">{b.lordName}</span>
                  </td>
                  <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{b.bhavadhipatiBala.toFixed(0)}</td>
                  <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{b.bhavaDigBala.toFixed(0)}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-xs">
                    <span className={b.bhavaDrishtiBala >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {b.bhavaDrishtiBala >= 0 ? '+' : ''}{b.bhavaDrishtiBala.toFixed(0)}
                    </span>
                  </td>
                  <td className={`py-2.5 px-2 text-right font-mono text-xs font-bold ${color}`}>{b.total.toFixed(0)}</td>
                  <td className={`py-2.5 px-2 text-right font-mono text-xs font-bold ${color}`}>{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Visual bar chart */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
        <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-4 font-bold text-center" style={bodyFont}>
          {locale === 'en' || isTamil ? 'House Strength Distribution' : 'भाव बल वितरण'}
        </h4>
        <div className="space-y-2">
          {bhavabala.map(b => {
            const pct = Math.min(100, (b.total / maxTotal) * 100);
            const color = b.strengthPercent >= 120 ? '#4ade80' : b.strengthPercent >= 90 ? '#d4a853' : '#f87171';
            const houseName = HOUSE_NAMES[b.bhava] || { en: `H${b.bhava}`, hi: `भा${b.bhava}` };
            return (
              <div key={b.bhava} className="flex items-center gap-3">
                <div className="w-6 text-right text-xs text-gold-light font-bold">{b.bhava}</div>
                <div className="w-16 sm:w-24 text-right text-xs text-text-secondary truncate" style={bodyFont}>{houseName[(locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const]}</div>
                <div className="flex-1 bg-gold-primary/10 rounded-full h-4 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
                <div className="w-12 text-right text-xs font-mono" style={{ color }}>{b.strengthPercent}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Sade Sati Helpers ──────────────────────────────────────────────────────

function intensityColor(v: number): string {
  if (v < 3) return 'text-green-400';
  if (v < 5) return 'text-gold-light';
  if (v < 7) return 'text-orange-400';
  return 'text-red-400';
}

function intensityLabel(v: number): { en: string; hi: string } {
  if (v < 3) return { en: 'Mild', hi: 'हल्का' };
  if (v < 5) return { en: 'Moderate', hi: 'मध्यम' };
  if (v < 7) return { en: 'Challenging', hi: 'चुनौतीपूर्ण' };
  return { en: 'Intense', hi: 'तीव्र' };
}

function intensityStrokeColor(v: number): string {
  if (v < 3) return '#4ade80';
  if (v < 5) return '#d4a853';
  if (v < 7) return '#fb923c';
  return '#f87171';
}

const SECTION_LABELS: Record<string, { en: string; hi: string }> = {
  summary: { en: 'Summary', hi: 'सारांश' },
  phaseEffect: { en: 'Phase Effect', hi: 'चरण प्रभाव' },
  saturnNature: { en: "Saturn's Nature for Your Ascendant", hi: 'आपके लग्न के लिए शनि का स्वभाव' },
  moonStrength: { en: 'Moon Strength', hi: 'चन्द्र बल' },
  dashaInterplay: { en: 'Dasha Interplay', hi: 'दशा अन्तर्क्रिया' },
  ashtakavargaInsight: { en: 'Ashtakavarga Insight', hi: 'अष्टकवर्ग अंतर्दृष्टि' },
  nakshatraTransit: { en: 'Nakshatra Transit', hi: 'नक्षत्र गोचर' },
  houseEffect: { en: 'House Effects', hi: 'भाव प्रभाव' },
};

const PHASE_LABELS: Record<string, { en: string; hi: string }> = {
  rising: { en: 'Rising (12th House Transit)', hi: 'उदय (द्वादश भाव गोचर)' },
  peak: { en: 'Peak (1st House Transit)', hi: 'शिखर (प्रथम भाव गोचर)' },
  setting: { en: 'Setting (2nd House Transit)', hi: 'अस्त (द्वितीय भाव गोचर)' },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  essential: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  recommended: { bg: 'bg-gold-primary/10', text: 'text-gold-light', border: 'border-gold-primary/20' },
  optional: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
};

const PRIORITY_LABELS: Record<string, { en: string; hi: string }> = {
  essential: { en: 'Essential', hi: 'अनिवार्य' },
  recommended: { en: 'Recommended', hi: 'अनुशंसित' },
  optional: { en: 'Optional', hi: 'वैकल्पिक' },
};

function SadeSatiTab({ sadeSati, locale, isDevanagari, headingFont }: {
  sadeSati: SadeSatiAnalysis;
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const isTamil = String(locale) === 'ta';
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const lk = (locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const;
  const [expandedSection, setExpandedSection] = useState<string>('summary');

  const interp = sadeSati.interpretation;
  const interpretationKeys = Object.keys(SECTION_LABELS).filter(k => {
    const val = interp[k as keyof typeof interp];
    return val && (val as { en: string; hi: string })[lk]?.trim();
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' || isTamil ? 'Sade Sati Analysis' : 'साढ़े साती विश्लेषण'}
      </h3>

      {/* ── Status Banner ── */}
      {sadeSati.isActive ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 border border-red-500/30 bg-red-500/5"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-500/15 border-2 border-red-500/40 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="text-red-400 text-lg font-bold uppercase tracking-wider" style={headingFont}>
                {locale === 'en' || isTamil ? 'Sade Sati Active' : 'साढ़े साती सक्रिय'}
              </div>
              <div className="text-text-secondary text-sm mt-1" style={bodyFont}>
                {sadeSati.cycleStart} &mdash; {sadeSati.cycleEnd}
                {sadeSati.currentPhase && (
                  <span className="ml-2 text-gold-light">
                    ({PHASE_LABELS[sadeSati.currentPhase]?.[lk] || sadeSati.currentPhase})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Timeline progress — shows elapsed vs remaining years */}
          {(() => {
            const startYr = parseInt(String(sadeSati.cycleStart));
            const endYr = parseInt(String(sadeSati.cycleEnd));
            const totalYrs = endYr - startYr;
            const currentYr = new Date().getFullYear();
            const elapsedYrs = Math.min(totalYrs, Math.max(0, currentYr - startYr));
            const remainingYrs = totalYrs - elapsedYrs;
            return (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-text-secondary mb-1">
                <span>{sadeSati.cycleStart}</span>
                <span className="text-gold-light font-semibold">
                  {locale === 'en' || isTamil ? `${elapsedYrs} of ${totalYrs} years` : `${totalYrs} में से ${elapsedYrs} वर्ष`}
                  {remainingYrs > 0 && <span className="text-text-tertiary ml-1">({locale === 'en' || isTamil ? `${remainingYrs} remaining` : `${remainingYrs} शेष`})</span>}
                </span>
                <span>{sadeSati.cycleEnd}</span>
              </div>
              <div className="h-2.5 rounded-full bg-gold-primary/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sadeSati.phaseProgress * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' as const }}
                  className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-gold-primary"
                />
              </div>
            </div>
            );
          })()}
        </motion.div>
      ) : (
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 border border-green-500/30 bg-green-500/5 text-center">
          <div className="text-green-400 text-lg font-bold uppercase tracking-wider" style={headingFont}>
            {locale === 'en' || isTamil ? 'Not in Sade Sati' : 'साढ़े साती नहीं'}
          </div>
          {sadeSati.allCycles.length > 0 && (() => {
            const nextCycle = sadeSati.allCycles.find(c => !c.isActive && c.startYear > new Date().getFullYear());
            if (!nextCycle) return null;
            return (
              <div className="text-text-secondary text-sm mt-2" style={bodyFont}>
                {locale === 'en' || isTamil ? `Next cycle: ${nextCycle.startYear} — ${nextCycle.endYear}` : `अगला चक्र: ${nextCycle.startYear} — ${nextCycle.endYear}`}
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Intensity Gauge (only if active) ── */}
      {sadeSati.isActive && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6"
        >
          <h4 className="text-gold-primary text-xs uppercase tracking-wider font-bold text-center mb-6" style={bodyFont}>
            {locale === 'en' || isTamil ? 'Intensity Gauge' : 'तीव्रता मापक'}
          </h4>

          <div className="flex flex-col items-center gap-6">
            {/* Circular SVG gauge */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                {/* Background circle */}
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-bg-primary/60" strokeLinecap="round"
                  strokeDasharray="235.6 78.5" transform="rotate(135 60 60)" />
                {/* Value arc */}
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke={intensityStrokeColor(sadeSati.overallIntensity)}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(sadeSati.overallIntensity / 10) * 235.6} ${314.16 - (sadeSati.overallIntensity / 10) * 235.6}`}
                  transform="rotate(135 60 60)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold font-mono ${intensityColor(sadeSati.overallIntensity)}`}>
                  {sadeSati.overallIntensity.toFixed(1)}<span className="text-base text-text-secondary/50">/10</span>
                </span>
                <span className="text-text-secondary text-xs uppercase tracking-wider" style={bodyFont}>
                  {intensityLabel(sadeSati.overallIntensity)[lk]}
                </span>
              </div>
            </div>

            {/* Intensity factors as bars */}
            {sadeSati.intensityFactors.length > 0 && (
              <div className="w-full max-w-md space-y-2.5">
                {sadeSati.intensityFactors.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-28 text-right text-xs text-text-secondary truncate" style={bodyFont}>
                      {f.description[lk]}
                    </div>
                    <div className="flex-1 bg-gold-primary/10 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(f.score / 10) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.1 * i, ease: 'easeOut' as const }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: intensityStrokeColor(f.score) }}
                      />
                    </div>
                    <span className={`w-6 text-right text-xs font-mono font-bold ${intensityColor(f.score)}`}>
                      {f.score.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Interpretation Sections (expandable cards) ── */}
      {interpretationKeys.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-gold-primary text-xs uppercase tracking-wider font-bold text-center mb-2" style={bodyFont}>
            {locale === 'en' || isTamil ? 'Detailed Interpretation' : 'विस्तृत व्याख्या'}
          </h4>
          {interpretationKeys.map((key) => {
            const label = SECTION_LABELS[key];
            const text = (interp[key as keyof typeof interp] as { en: string; hi: string })[lk];
            const isOpen = expandedSection === key;
            return (
              <motion.div
                key={key}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden"
                layout
              >
                <button
                  onClick={() => setExpandedSection(isOpen ? '' : key)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gold-primary/5 transition-colors"
                >
                  <span className="text-gold-light text-sm font-bold" style={headingFont}>
                    {label[lk]}
                  </span>
                  <svg className={`w-4 h-4 text-gold-dark/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                        {text}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Timeline ── */}
      {sadeSati.allCycles.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
          <h4 className="text-gold-primary text-xs uppercase tracking-wider font-bold text-center mb-5" style={bodyFont}>
            {locale === 'en' || isTamil ? 'Sade Sati Timeline' : 'साढ़े साती समयरेखा'}
          </h4>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gold-primary/20" />
            <div className="space-y-4">
              {sadeSati.allCycles.map((cycle, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`flex items-start gap-4 pl-2 ${cycle.isActive ? '' : 'opacity-60'}`}
                >
                  <div className={`mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    cycle.isActive ? 'border-gold-primary bg-gold-primary/20' : 'border-gold-primary/30 bg-bg-primary/40'
                  }`}>
                    {cycle.isActive && <div className="w-2.5 h-2.5 rounded-full bg-gold-primary animate-pulse" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold font-mono text-sm ${cycle.isActive ? 'text-gold-light' : 'text-text-secondary'}`}>
                        {cycle.startYear} &mdash; {cycle.endYear}
                      </span>
                      {cycle.isActive && (
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-primary/15 text-gold-light border border-gold-primary/30">
                          {locale === 'en' || isTamil ? 'Active' : 'सक्रिय'}
                        </span>
                      )}
                    </div>
                    {cycle.phases.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {cycle.phases.map((ph, j) => (
                          <span key={j} className={`text-xs px-2 py-0.5 rounded border ${
                            cycle.isActive && sadeSati.currentPhase === ph.phase
                              ? 'bg-gold-primary/15 text-gold-light border-gold-primary/30 font-bold'
                              : 'text-text-tertiary border-gold-primary/10'
                          }`}>
                            {ph.phase === 'rising' ? (locale === 'en' || isTamil ? 'Rising' : 'उदय') :
                             ph.phase === 'peak' ? (locale === 'en' || isTamil ? 'Peak' : 'शिखर') :
                             (locale === 'en' || isTamil ? 'Setting' : 'अस���त')}
                            {' '}{ph.startYear}-{ph.endYear}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Nakshatra transit sub-items for active cycle */}
                    {cycle.isActive && sadeSati.nakshatraTimeline.length > 0 && (
                      <div className="mt-3 ml-1 space-y-1">
                        <div className="text-xs text-text-tertiary uppercase tracking-wider mb-1.5">
                          {locale === 'en' || isTamil ? 'Nakshatra Transits' : 'नक्षत्र गोचर'}
                        </div>
                        {sadeSati.nakshatraTimeline.map((nt, k) => {
                          const nak = NAKSHATRAS[nt.nakshatra - 1];
                          const nakName = nak?.name?.[locale as 'en' | 'hi' | 'sa'] || nak?.name?.en || '';
                          const yearLabel = nt.firstYear === nt.lastYear ? String(nt.firstYear) : `${nt.firstYear}–${nt.lastYear}`;
                          return (
                            <div
                              key={k}
                              className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border ${
                                nt.isBirthNakshatra
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 font-bold'
                                  : nt.isCurrent
                                    ? 'bg-gold-primary/10 border-gold-primary/25 text-gold-light'
                                    : 'border-transparent text-text-secondary'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                nt.isCurrent ? 'bg-gold-primary animate-pulse' : nt.isBirthNakshatra ? 'bg-amber-400' : 'bg-text-tertiary/40'
                              }`} />
                              <span className="flex-1">{nakName}</span>
                              <span className="font-mono text-xs opacity-70">{yearLabel}</span>
                              {nt.isBirthNakshatra && (
                                <span className="text-xs uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/25 text-amber-300">
                                  {locale === 'en' || isTamil ? 'Birth' : 'जन्म'}
                                </span>
                              )}
                              {nt.isCurrent && !nt.isBirthNakshatra && (
                                <span className="text-xs uppercase tracking-wider px-1.5 py-0.5 rounded bg-gold-primary/15 border border-gold-primary/25 text-gold-light">
                                  {locale === 'en' || isTamil ? 'Now' : 'अभी'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Remedies (only if active) ── */}
      {sadeSati.isActive && sadeSati.remedies.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
          <h4 className="text-gold-primary text-xs uppercase tracking-wider font-bold text-center mb-5" style={bodyFont}>
            {locale === 'en' || isTamil ? 'Remedies' : 'उपाय'}
          </h4>
          {(['essential', 'recommended', 'optional'] as const).map(priority => {
            const items = sadeSati.remedies.filter(r => r.priority === priority);
            if (items.length === 0) return null;
            const pc = PRIORITY_COLORS[priority];
            return (
              <div key={priority} className="mb-5 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
                    {PRIORITY_LABELS[priority][lk]}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {items.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className={`rounded-xl p-4 border ${pc.border} ${pc.bg}`}
                    >
                      <div className={`font-bold text-sm mb-1 ${pc.text}`} style={headingFont}>
                        {r.title[lk]}
                      </div>
                      <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                        {r.description[lk]}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

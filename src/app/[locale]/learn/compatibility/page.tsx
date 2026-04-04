'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, Sparkles, Moon, Timer, Flame, ListChecks } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ── Trilingual Labels ──────────────────────────────────────────────── */
type Tri = { en: string; hi: string; sa: string };
const L: Record<string, Tri> = {
  title:    { en: 'Advanced Compatibility Analysis', hi: 'उन्नत अनुकूलता विश्लेषण', sa: 'उन्नतानुकूलताविश्लेषणम्' },
  subtitle: { en: 'Beyond Ashta Kuta --- chart-level factors that determine real compatibility', hi: 'अष्ट कूट से परे --- वास्तविक अनुकूलता निर्धारित करने वाले कुण्डली-स्तरीय कारक', sa: 'अष्टकूटात् परं --- वास्तविकानुकूलतां निर्धारयन्तः कुण्डलीस्तरीयकारकाः' },
  s1Title:  { en: 'Beyond Ashta Kuta --- Chart-Level Analysis', hi: 'अष्ट कूट से परे --- कुण्डली-स्तरीय विश्लेषण', sa: 'अष्टकूटात् परम् --- कुण्डलीस्तरीयविश्लेषणम्' },
  s1Desc:   { en: 'Ashta Kuta (36 points) is the SCREENING test --- necessary but not sufficient. Many couples with 28+ points have troubled marriages; some with 18 points thrive. The difference: chart-level factors that Kuta Milan doesn\'t capture.', hi: 'अष्ट कूट (36 अंक) छानबीन परीक्षा है --- आवश्यक किन्तु पर्याप्त नहीं। 28+ अंक वाले अनेक दम्पतियों का विवाह कठिन होता है; 18 अंक वाले कुछ सफल होते हैं। अन्तर: कूट मिलान में न आने वाले कुण्डली-स्तरीय कारक।', sa: 'अष्टकूटः (36 अङ्काः) परीक्षणम् --- आवश्यकं किन्तु न पर्याप्तम्। 28+ अङ्कयुक्तानां बहूनां दम्पतीनां विवाहः कठिनः; 18 अङ्कयुक्ताः केचित् सफलाः।' },
  s2Title:  { en: '7th House Comparison', hi: 'सप्तम भाव तुलना', sa: 'सप्तमभावतुलना' },
  s3Title:  { en: 'Venus Assessment', hi: 'शुक्र मूल्यांकन', sa: 'शुक्रमूल्याङ्कनम्' },
  s4Title:  { en: 'Navamsha (D9) Compatibility', hi: 'नवांश (D9) अनुकूलता', sa: 'नवांशः (D9) अनुकूलता' },
  s5Title:  { en: 'Dasha Compatibility', hi: 'दशा अनुकूलता', sa: 'दशानुकूलता' },
  s6Title:  { en: 'Mangal Dosha --- The Full Picture', hi: 'मंगल दोष --- सम्पूर्ण चित्र', sa: 'मङ्गलदोषः --- सम्पूर्णचित्रम्' },
  s7Title:  { en: 'Practical Matching Approach', hi: 'व्यावहारिक मिलान दृष्टिकोण', sa: 'व्यावहारिकमिलानदृष्टिकोणः' },
  relLinks: { en: 'Related Pages', hi: 'सम्बन्धित पृष्ठ', sa: 'सम्बद्धपृष्ठानि' },
};

/* ── Section data ───────────────────────────────────────────────────── */
const SECTIONS = [
  { id: 'beyond',   icon: Eye,        color: '#d4a853', titleKey: 's1Title' as const },
  { id: 'house7',   icon: Heart,      color: '#f472b6', titleKey: 's2Title' as const },
  { id: 'venus',    icon: Sparkles,   color: '#e8e6e3', titleKey: 's3Title' as const },
  { id: 'navamsha', icon: Moon,        color: '#a78bfa', titleKey: 's4Title' as const },
  { id: 'dasha',    icon: Timer,      color: '#34d399', titleKey: 's5Title' as const },
  { id: 'mangal',   icon: Flame,      color: '#f87171', titleKey: 's6Title' as const },
  { id: 'approach', icon: ListChecks, color: '#fbbf24', titleKey: 's7Title' as const },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

/* ── Shared Glass Card ──────────────────────────────────────────────── */
function Glass({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gold-primary/10 bg-card-dark/60 backdrop-blur-md shadow-lg shadow-black/20 ${className}`}>
      {children}
    </div>
  );
}

function Bullet({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-text-secondary text-sm leading-relaxed">{children}</span>
    </div>
  );
}

function KeyInsight({ children, color = '#d4a853' }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="mt-3 p-3 rounded-xl border text-sm leading-relaxed" style={{ borderColor: `${color}30`, backgroundColor: `${color}08`, color }}>
      {children}
    </div>
  );
}

/* ── 7th House Points ───────────────────────────────────────────────── */
const HOUSE7_POINTS: { en: string; hi: string; sa: string }[] = [
  { en: 'Compare both charts\' 7th house signs, lords, and occupants for harmony or friction.', hi: 'दोनों कुण्डलियों के 7वें भाव की राशि, स्वामी और ग्रहों की तुलना करें।', sa: 'उभयोः कुण्डल्योः सप्तमभावराशिं, स्वामिनं, ग्रहान् च तुलयतु।' },
  { en: 'His 7th lord in her Lagna (or vice versa) = strong natural attraction.', hi: 'उसका 7वाँ स्वामी उसके लग्न में (या इसके विपरीत) = प्रबल स्वाभाविक आकर्षण।', sa: 'तस्य सप्तमस्वामी तस्याः लग्ने (विपरीतं वा) = प्रबलं स्वाभाविकम् आकर्षणम्।' },
  { en: 'Malefics in 7th of BOTH charts = shared friction zone requiring conscious effort.', hi: 'दोनों कुण्डलियों के 7वें में पाप ग्रह = साझा घर्षण क्षेत्र, सचेत प्रयास आवश्यक।', sa: 'उभयोः कुण्डल्योः सप्तमे पापग्रहाः = साझं घर्षणक्षेत्रम्।' },
  { en: '7th lord in 6/8/12 in EITHER chart = area of concern for partnership longevity.', hi: 'किसी भी कुण्डली में 7वाँ स्वामी 6/8/12 में = साझेदारी दीर्घायु के लिए चिन्ता।', sa: 'कस्याञ्चित् कुण्डल्यां सप्तमस्वामी 6/8/12 भावे = साझेदारीदीर्घायुषे चिन्ता।' },
];

const VENUS_POINTS: Tri[] = [
  { en: 'Venus is the karaka (significator) of marriage for BOTH genders --- its condition is paramount.', hi: 'शुक्र दोनों लिंगों के लिए विवाह का कारक है --- इसकी स्थिति सर्वोपरि है।', sa: 'शुक्रः उभयलिङ्गयोः विवाहकारकः --- तस्य स्थितिः सर्वोपरि।' },
  { en: 'If EITHER partner has Venus combust, debilitated, or in 6/8/12, expect relationship challenges.', hi: 'यदि किसी भी साथी का शुक्र अस्त, नीच, या 6/8/12 में हो तो सम्बन्ध चुनौतियाँ।', sa: 'यदि कस्यचित् साथिनः शुक्रः अस्तः, नीचः, 6/8/12 भावे वा, सम्बन्धचुनौत्यः।' },
  { en: 'Venus in the other person\'s 7th sign = powerful natural magnetic attraction.', hi: 'शुक्र दूसरे व्यक्ति की 7वीं राशि में = शक्तिशाली स्वाभाविक चुम्बकीय आकर्षण।', sa: 'शुक्रः अपरस्य सप्तमराशौ = प्रबलं स्वाभाविकं चुम्बकीयम् आकर्षणम्।' },
  { en: 'Venus Mahadasha alignment: if both are in Venus-related periods, the relationship peaks.', hi: 'शुक्र महादशा संरेखण: दोनों शुक्र-सम्बन्धित अवधि में हों तो सम्बन्ध शिखर पर।', sa: 'शुक्रमहादशासंरेखणम्: उभौ शुक्रसम्बद्धकाले चेत्, सम्बन्धः शिखरे।' },
];

const NAVAMSHA_POINTS: Tri[] = [
  { en: 'D9 (Navamsha) is THE marriage chart --- it reveals the true quality of married life.', hi: 'D9 (नवांश) विवाह कुण्डली है --- यह वैवाहिक जीवन की वास्तविक गुणवत्ता दर्शाता है।', sa: 'D9 (नवांशः) विवाहकुण्डली --- वैवाहिकजीवनस्य वास्तविकगुणवत्तां दर्शयति।' },
  { en: 'Compare D9 lagnas: same or friendly signs = compatible wavelengths. Enemy signs = friction.', hi: 'D9 लग्नों की तुलना करें: समान या मित्र राशि = अनुकूल। शत्रु राशि = घर्षण।', sa: 'D9 लग्नानि तुलयतु: समानानि मित्रराशयो वा = अनुकूलाः। शत्रुराशयः = घर्षणम्।' },
  { en: 'Benefics in both D9 7th houses = harmonious married life. Malefics = ongoing adjustments.', hi: 'दोनों D9 सप्तम में शुभ ग्रह = सामंजस्यपूर्ण वैवाहिक जीवन। पाप ग्रह = निरन्तर समायोजन।', sa: 'उभयोः D9 सप्तमे शुभग्रहाः = सामञ्जस्यपूर्णं वैवाहिकजीवनम्। पापग्रहाः = निरन्तरसमायोजनम्।' },
  { en: 'Vargottama planets shared by both D9 charts indicate deep shared strengths and karmic bonds.', hi: 'दोनों D9 में वर्गोत्तम ग्रह गहन साझा शक्ति और कार्मिक बन्धन दर्शाते हैं।', sa: 'उभयोः D9 कुण्डल्योः वर्गोत्तमग्रहाः गहनां साझां शक्तिं कार्मिकबन्धनं च दर्शयन्ति।' },
];

const DASHA_COMBOS: { combo: Tri; effect: Tri; quality: 'good' | 'mixed' | 'hard' }[] = [
  { combo: { en: 'Both in Jupiter dasha', hi: 'दोनों गुरु दशा में', sa: 'उभौ गुरुदशायाम्' }, effect: { en: 'Expansion together, ideal for building family and wealth', hi: 'एक साथ विस्तार, परिवार और धन निर्माण के लिए आदर्श', sa: 'सह विस्तारः, कुटुम्बधननिर्माणाय आदर्शः' }, quality: 'good' },
  { combo: { en: 'One Venus, one Jupiter', hi: 'एक शुक्र, एक गुरु', sa: 'एकः शुक्रदशायां, एकः गुरुदशायाम्' }, effect: { en: 'Complementary --- one enjoys, one expands. Harmonious balance.', hi: 'पूरक --- एक आनन्द लेता है, एक विस्तार करता है। सामंजस्यपूर्ण।', sa: 'पूरकम् --- एकः आनन्दति, एकः विस्तारयति। सामञ्जस्यम्।' }, quality: 'good' },
  { combo: { en: 'One Saturn, one Venus', hi: 'एक शनि, एक शुक्र', sa: 'एकः शनिदशायां, एकः शुक्रदशायाम्' }, effect: { en: 'Different life rhythms --- one in restriction, other in pleasure. Needs patience.', hi: 'भिन्न जीवन लय --- एक प्रतिबन्ध में, दूसरा आनन्द में। धैर्य चाहिए।', sa: 'भिन्नजीवनतालः --- एकः प्रतिबन्धे, अपरः आनन्दे। धैर्यम् आवश्यकम्।' }, quality: 'mixed' },
  { combo: { en: 'One Rahu, one Saturn', hi: 'एक राहु, एक शनि', sa: 'एकः राहुदशायां, एकः शनिदशायाम्' }, effect: { en: 'Chaos meets restriction --- most challenging combination. External counselling recommended.', hi: 'अराजकता प्रतिबन्ध से मिलती है --- सबसे चुनौतीपूर्ण संयोग। बाहरी परामर्श अनुशंसित।', sa: 'अराजकता प्रतिबन्धेन मिलति --- सर्वाधिकचुनौतीपूर्णः संयोगः।' }, quality: 'hard' },
  { combo: { en: 'Both in Moon dasha', hi: 'दोनों चन्द्र दशा में', sa: 'उभौ चन्द्रदशायाम्' }, effect: { en: 'Deep emotional connection, nurturing phase. Great for early marriage years.', hi: 'गहन भावनात्मक सम्बन्ध, पोषण काल। विवाह के प्रारम्भिक वर्षों के लिए उत्तम।', sa: 'गहनः भावनात्मकसम्बन्धः, पोषणकालः। विवाहस्य प्रारम्भिकवर्षेभ्यः उत्तमम्।' }, quality: 'good' },
];

const MANGAL_HOUSES = [1, 2, 4, 7, 8, 12];
const MANGAL_CANCELLATIONS: Tri[] = [
  { en: 'Mars is in own sign (Aries/Scorpio) or exalted (Capricorn) --- weakens the dosha.', hi: 'मंगल स्वराशि (मेष/वृश्चिक) या उच्च (मकर) में --- दोष कमज़ोर।', sa: 'मङ्गलः स्वराशौ (मेषः/वृश्चिकः) उच्चे (मकरः) वा --- दोषः दुर्बलः।' },
  { en: 'Jupiter aspects the 7th house, providing divine protection to marriage.', hi: 'गुरु सप्तम भाव पर दृष्टि डालता है, विवाह को दैवी सुरक्षा देता है।', sa: 'गुरुः सप्तमभावं पश्यति, विवाहाय दैवीसुरक्षां ददाति।' },
  { en: 'Partner ALSO has Mangal Dosha --- mutual cancellation (most common fix).', hi: 'साथी को भी मंगल दोष है --- पारस्परिक निरसन (सबसे सामान्य समाधान)।', sa: 'साथिनः अपि मङ्गलदोषः --- पारस्परिकनिरसनम् (प्रचलिततमः समाधानम्)।' },
  { en: 'Mars is in Aries, Scorpio, or Capricorn in the specific house position.', hi: 'मंगल विशिष्ट भाव स्थान पर मेष, वृश्चिक, या मकर में है।', sa: 'मङ्गलः विशिष्टभावस्थाने मेषे, वृश्चिके, मकरे वा अस्ति।' },
  { en: 'A benefic planet (Jupiter, Venus, or strong Moon) occupies the 7th house.', hi: 'शुभ ग्रह (गुरु, शुक्र, या बलवान चन्द्र) सप्तम भाव में है।', sa: 'शुभग्रहः (गुरुः, शुक्रः, बलवान् चन्द्रः वा) सप्तमभावे अस्ति।' },
  { en: 'Mars is in specific nakshatras that mitigate its aggression (e.g., Chitra, Mrigashira, Dhanishtha).', hi: 'मंगल विशिष्ट नक्षत्रों में है जो उसकी आक्रामकता कम करते हैं (चित्रा, मृगशिरा, धनिष्ठा)।', sa: 'मङ्गलः विशिष्टनक्षत्रेषु अस्ति ये तस्य आक्रामकतां शमयन्ति।' },
];

const PRACTICAL_STEPS: { step: number; text: Tri; minScore?: string }[] = [
  { step: 1, text: { en: 'Start with Ashta Kuta score (minimum 18 out of 36 to proceed).', hi: 'अष्ट कूट अंक से शुरू करें (आगे बढ़ने के लिए न्यूनतम 18/36)।', sa: 'अष्टकूटाङ्केन आरभत (अग्रे गन्तुं न्यूनतमम् 18/36)।' }, minScore: '18/36' },
  { step: 2, text: { en: 'Check for Nadi Dosha (0/8 is a red flag unless specific cancellation conditions apply).', hi: 'नाडी दोष जाँचें (0/8 चेतावनी, जब तक विशिष्ट निरसन शर्तें न हों)।', sa: 'नाडीदोषं परीक्षतु (0/8 सावधानता, विशिष्टनिरसनशर्ताः चेत् न)।' } },
  { step: 3, text: { en: 'Check Mangal Dosha in both charts from Lagna, Moon, AND Venus.', hi: 'दोनों कुण्डलियों में लग्न, चन्द्र, और शुक्र से मंगल दोष जाँचें।', sa: 'उभयोः कुण्डल्योः लग्नात्, चन्द्रात्, शुक्रात् च मङ्गलदोषं परीक्षतु।' } },
  { step: 4, text: { en: 'Compare 7th houses and Venus positions across both charts.', hi: 'दोनों कुण्डलियों में 7वें भाव और शुक्र स्थितियों की तुलना करें।', sa: 'उभयोः कुण्डल्योः सप्तमभावं शुक्रस्थितिं च तुलयतु।' } },
  { step: 5, text: { en: 'Compare D9 (Navamsha) lagnas for marriage wavelength compatibility.', hi: 'विवाह तरंगदैर्घ्य अनुकूलता के लिए D9 (नवांश) लग्नों की तुलना करें।', sa: 'विवाहानुकूलतायै D9 (नवांश) लग्नानि तुलयतु।' } },
  { step: 6, text: { en: 'Check dasha compatibility for the next 10 years of married life.', hi: 'अगले 10 वर्षों के वैवाहिक जीवन के लिए दशा अनुकूलता जाँचें।', sa: 'आगामिदशवर्षाणां वैवाहिकजीवनस्य दशानुकूलतां परीक्षतु।' } },
  { step: 7, text: { en: 'If 5 of 6 factors are favorable, proceed with confidence.', hi: 'यदि 6 में से 5 कारक अनुकूल हैं, तो विश्वास से आगे बढ़ें।', sa: 'यदि 6 कारकेषु 5 अनुकूलाः, विश्वासेन अग्रे गच्छतु।' } },
];

/* ── Component ──────────────────────────────────────────────────────── */
export default function CompatibilityPage() {
  const locale = useLocale() as Locale;
  const [active, setActive] = useState<SectionId>('beyond');

  const activeSection = SECTIONS.find((s) => s.id === active)!;
  const activeColor = activeSection.color;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-gold-light font-heading">{L.title[locale]}</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">{L.subtitle[locale]}</p>
      </motion.div>

      {/* Section Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {SECTIONS.map(({ id, icon: Icon, color, titleKey }) => (
          <button key={id} onClick={() => setActive(id)} className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${active === id ? 'border-2 text-gold-light scale-105' : 'border border-white/10 text-text-secondary hover:text-text-primary'}`} style={active === id ? { borderColor: color, backgroundColor: `${color}18` } : {}}>
            <Icon size={14} style={{ color }} />
            <span className="hidden md:inline">{L[titleKey][locale]}</span>
            <span className="md:hidden">{(id === 'beyond' ? (locale === 'en' ? 'Kuta+' : 'कूट+') : id === 'approach' ? (locale === 'en' ? 'Steps' : 'चरण') : L[titleKey][locale].split(' ')[0])}</span>
          </button>
        ))}
      </div>

      {/* Animated Section Content */}
      <AnimatePresence mode="wait">
        {/* ── Beyond Ashta Kuta ─── */}
        {active === 'beyond' && (
          <motion.div key="beyond" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Glass className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-gold-light">{L.s1Title[locale]}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{L.s1Desc[locale]}</p>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                {[
                  { score: '28+', label: { en: 'High Kuta, but troubled', hi: 'उच्च कूट, किन्तु कठिन', sa: 'उच्चकूटम्, किन्तु कठिनम्' }, color: '#f87171' },
                  { score: '18', label: { en: 'Low Kuta, but thriving', hi: 'निम्न कूट, किन्तु सफल', sa: 'निम्नकूटम्, किन्तु सफलम्' }, color: '#34d399' },
                  { score: '?', label: { en: 'Chart factors decide', hi: 'कुण्डली कारक निर्णय लेते हैं', sa: 'कुण्डलीकारकाः निर्णयं कुर्वन्ति' }, color: '#d4a853' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 rounded-xl border border-white/5 bg-white/3">
                    <div className="text-3xl font-bold mb-1" style={{ color: item.color }}>{item.score}</div>
                    <div className="text-text-secondary text-xs">{item.label[locale]}</div>
                  </div>
                ))}
              </div>
              <KeyInsight>{locale === 'en' ? 'Kuta Milan is the screening test. The 6 factors below are the deep dive.' : locale === 'hi' ? 'कूट मिलान छानबीन है। नीचे के 6 कारक गहन विश्लेषण हैं।' : 'कूटमिलानं परीक्षणम्। अधस्तनाः 6 कारकाः गहनविश्लेषणम्।'}</KeyInsight>
            </Glass>
          </motion.div>
        )}

        {/* ── 7th House ─── */}
        {active === 'house7' && (
          <motion.div key="house7" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Glass className="p-6 space-y-3">
              <h2 className="text-xl font-bold text-pink-400">{L.s2Title[locale]}</h2>
              {HOUSE7_POINTS.map((pt, i) => (
                <Bullet key={i} color="#f472b6">{pt[locale]}</Bullet>
              ))}
              <KeyInsight color="#f472b6">{locale === 'en' ? 'The 7th house is the mirror of partnership. When both charts\' 7th houses are harmonious, the couple "speaks the same language" in love.' : locale === 'hi' ? '7वाँ भाव साझेदारी का दर्पण है। जब दोनों कुण्डलियों के 7वें भाव सामंजस्यपूर्ण हों, दम्पति प्रेम में "एक ही भाषा बोलते हैं"।' : 'सप्तमभावः साझेदार्याः दर्पणः। उभयोः कुण्डल्योः सप्तमभावयोः सामञ्जस्ये दम्पती प्रेम्णि "एकां भाषां वदतः"।'}</KeyInsight>
            </Glass>
          </motion.div>
        )}

        {/* ── Venus ─── */}
        {active === 'venus' && (
          <motion.div key="venus" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Glass className="p-6 space-y-3">
              <h2 className="text-xl font-bold text-gray-200">{L.s3Title[locale]}</h2>
              {VENUS_POINTS.map((pt, i) => (
                <Bullet key={i} color="#e8e6e3">{pt[locale]}</Bullet>
              ))}
              <KeyInsight color="#e8e6e3">{locale === 'en' ? 'Venus condition trumps Kuta score. A couple with 30/36 Kuta but both Venus afflicted will struggle more than a couple with 20/36 but strong Venus in both charts.' : locale === 'hi' ? 'शुक्र की स्थिति कूट अंक से ऊपर है। 30/36 कूट किन्तु दोनों शुक्र पीड़ित --- 20/36 किन्तु दोनों शुक्र बलवान से अधिक कठिन।' : 'शुक्रस्थितिः कूटाङ्कात् उपरि। 30/36 कूटम् किन्तु उभौ शुक्रौ पीडितौ --- 20/36 किन्तु उभौ शुक्रौ बलवन्तौ इत्यस्मात् कठिनतरम्।'}</KeyInsight>
            </Glass>
          </motion.div>
        )}

        {/* ── Navamsha ─── */}
        {active === 'navamsha' && (
          <motion.div key="navamsha" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Glass className="p-6 space-y-3">
              <h2 className="text-xl font-bold text-purple-400">{L.s4Title[locale]}</h2>
              {NAVAMSHA_POINTS.map((pt, i) => (
                <Bullet key={i} color="#a78bfa">{pt[locale]}</Bullet>
              ))}
              <KeyInsight color="#a78bfa">{locale === 'en' ? 'D9 is like an X-ray of your marriage karma. D1 (Rashi chart) shows the outer life; D9 shows what happens behind closed doors.' : locale === 'hi' ? 'D9 आपके विवाह कर्म का एक्स-रे है। D1 (राशि कुण्डली) बाहरी जीवन दिखाती है; D9 बन्द दरवाज़ों के पीछे क्या होता है।' : 'D9 भवतः विवाहकर्मणः एक्स-रे इव। D1 बाह्यजीवनं दर्शयति; D9 पिहितद्वारस्य पश्चात् किं भवतीति दर्शयति।'}</KeyInsight>
            </Glass>
          </motion.div>
        )}

        {/* ── Dasha ─── */}
        {active === 'dasha' && (
          <motion.div key="dasha" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <Glass className="p-6">
              <h2 className="text-xl font-bold text-emerald-400 mb-4">{L.s5Title[locale]}</h2>
              <div className="space-y-3">
                {DASHA_COMBOS.map((d, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/3">
                    <span className={`mt-0.5 shrink-0 w-3 h-3 rounded-full ${d.quality === 'good' ? 'bg-emerald-500' : d.quality === 'mixed' ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="text-text-primary text-sm font-medium">{d.combo[locale]}</div>
                      <div className="text-text-secondary text-xs mt-0.5">{d.effect[locale]}</div>
                    </div>
                  </div>
                ))}
              </div>
              <KeyInsight color="#34d399">{locale === 'en' ? 'Best approach: complementary dashas where one partner builds and the other supports. Identical challenging dashas compound stress.' : locale === 'hi' ? 'सर्वोत्तम दृष्टिकोण: पूरक दशाएँ जहाँ एक साथी निर्माण करे और दूसरा सहारा दे।' : 'उत्तमः दृष्टिकोणः: पूरकदशाः यत्र एकः साथी निर्माणं करोति अपरः सहायतां ददाति।'}</KeyInsight>
            </Glass>
          </motion.div>
        )}

        {/* ── Mangal Dosha ─── */}
        {active === 'mangal' && (
          <motion.div key="mangal" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <Glass className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-red-400">{L.s6Title[locale]}</h2>
              <p className="text-text-secondary text-sm">
                {locale === 'en' ? `Mars in houses ${MANGAL_HOUSES.join(', ')} from Lagna OR Moon OR Venus creates Mangal Dosha. Check from ALL THREE reference points --- most apps only check Lagna.` : locale === 'hi' ? `लग्न या चन्द्र या शुक्र से भाव ${MANGAL_HOUSES.join(', ')} में मंगल से मंगल दोष बनता है। तीनों सन्दर्भ बिन्दुओं से जाँचें --- अधिकांश ऐप केवल लग्न जाँचते हैं।` : `लग्नात् चन्द्रात् शुक्रात् वा भावेषु ${MANGAL_HOUSES.join(', ')} मङ्गलः मङ्गलदोषं रचयति। त्रिभ्यः सन्दर्भबिन्दुभ्यः परीक्षतु।`}
              </p>
              {/* Houses visual */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map((h) => (
                  <div key={h} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border ${MANGAL_HOUSES.includes(h) ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/3 border-white/10 text-text-secondary/40'}`}>{h}</div>
                ))}
              </div>
              <div className="mt-2 text-center text-xs text-text-secondary">
                {locale === 'en' ? 'Red = Mangal Dosha houses' : locale === 'hi' ? 'लाल = मंगल दोष भाव' : 'रक्तम् = मङ्गलदोषभावाः'}
              </div>
            </Glass>
            <Glass className="p-6 space-y-3">
              <h3 className="text-sm font-bold text-emerald-400">{locale === 'en' ? '6 Cancellation Conditions' : locale === 'hi' ? '6 निरसन शर्तें' : '6 निरसनशर्ताः'}</h3>
              {MANGAL_CANCELLATIONS.map((c, i) => (
                <Bullet key={i} color="#34d399">{c[locale]}</Bullet>
              ))}
              <KeyInsight color="#f87171">{locale === 'en' ? 'Double Mangal Dosha (from 2+ reference points) is stronger and requires more cancellation. Single Dosha with one cancellation = manageable. The "mutual cancellation" principle is the most common real-world fix.' : locale === 'hi' ? 'दोहरा मंगल दोष (2+ सन्दर्भ बिन्दुओं से) अधिक प्रबल है और अधिक निरसन चाहिए। एक दोष एक निरसन के साथ = प्रबन्धनीय।' : 'द्विगुणमङ्गलदोषः (2+ सन्दर्भबिन्दुभ्यः) प्रबलतरः, अधिकनिरसनम् अपेक्षते।'}</KeyInsight>
            </Glass>
          </motion.div>
        )}

        {/* ── Practical Approach ─── */}
        {active === 'approach' && (
          <motion.div key="approach" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Glass className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-amber-400">{L.s7Title[locale]}</h2>
              <div className="space-y-3">
                {PRACTICAL_STEPS.map((s) => (
                  <div key={s.step} className="flex items-start gap-4 p-3 rounded-xl border border-white/5 bg-white/3">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">{s.step}</span>
                    <div className="flex-1">
                      <p className="text-text-secondary text-sm">{s.text[locale]}</p>
                      {s.minScore && <span className="text-amber-400 text-xs font-bold mt-1 inline-block">{locale === 'en' ? `Min: ${s.minScore}` : locale === 'hi' ? `न्यूनतम: ${s.minScore}` : `न्यूनतमम्: ${s.minScore}`}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <KeyInsight color="#fbbf24">{locale === 'en' ? 'No chart is perfect. If 5 out of 6 factors align, proceed with confidence. The remaining factor becomes the area for conscious growth together.' : locale === 'hi' ? 'कोई कुण्डली पूर्ण नहीं है। यदि 6 में से 5 कारक अनुकूल हों, विश्वास से आगे बढ़ें। शेष कारक सचेत विकास का क्षेत्र बनता है।' : 'न कापि कुण्डली पूर्णा। यदि 6 कारकेषु 5 अनुकूलाः, विश्वासेन अग्रे गच्छतु।'}</KeyInsight>
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Links */}
      <Glass className="p-6">
        <h3 className="text-sm font-bold text-gold-light mb-4">{L.relLinks[locale]}</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/matching', label: { en: 'Kundali Matching', hi: 'कुण्डली मिलान', sa: 'कुण्डलीमिलानम्' } },
            { href: '/kundali', label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएँ', sa: 'कुण्डलीं रचयतु' } },
            { href: '/learn/matching', label: { en: 'Learn: Matching', hi: 'सीखें: मिलान', sa: 'शिक्षा: मिलानम्' } },
            { href: '/learn/marriage', label: { en: 'Learn: Marriage', hi: 'सीखें: विवाह', sa: 'शिक्षा: विवाहः' } },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="px-4 py-2 rounded-lg bg-gold-primary/8 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/15 transition-colors">
              {link.label[locale]}
            </Link>
          ))}
        </div>
      </Glass>
    </div>
  );
}

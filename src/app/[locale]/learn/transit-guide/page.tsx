'use client';

import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/transit-guide.json';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Orbit, Star, BookOpen, ChevronRight } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ── Rating display ──────────────────────────────────────────────── */
function Rating({ stars }: { stars: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= stars ? 'text-gold-primary fill-gold-primary' : 'text-text-tertiary/30'}`} />
      ))}
    </span>
  );
}

/* ── Saturn transit data ──────────────────────────────────────────── */
const SATURN: { house: number; stars: number; effect: Record<string, string> }[] = [
  { house: 1, stars: 1, effect: { en: 'Self-pressure, health watch, identity crisis. The weight of responsibility lands squarely on your shoulders. Physical body feels heavy.', hi: 'आत्म-दबाव, स्वास्थ्य सतर्कता, पहचान संकट। जिम्मेदारी का बोझ सीधे कंधों पर। शरीर भारी।', sa: 'आत्मदाबः, स्वास्थ्यसतर्कता, अस्मितासङ्कटः।' } },
  { house: 2, stars: 1, effect: { en: 'Financial stress, speech becomes harsh, family tensions. Your savings are tested. Careful with words — Saturn here makes speech cutting.', hi: 'आर्थिक तनाव, वाणी कठोर, पारिवारिक तनाव। बचत की परीक्षा। शब्दों में सावधानी — शनि वाणी को तीखा बनाता है।', sa: 'आर्थिकतनावः, वाक् कठोरा, पारिवारिकतनावः।' } },
  { house: 3, stars: 3, effect: { en: 'Courage grows through struggle, efforts succeed after hard work, short travels productive. Siblings become supportive or you become self-reliant.', hi: 'संघर्ष से साहस बढ़ता है, कठिन परिश्रम के बाद प्रयास सफल, छोटी यात्राएँ उत्पादक। भाई-बहन सहायक या आत्मनिर्भरता।', sa: 'संघर्षेण शौर्यं वर्धते, कठिनपरिश्रमात् प्रयासाः सफलाः।' } },
  { house: 4, stars: 1, effect: { en: 'Domestic unrest, mother\'s health concerns, property disputes, deep inner anxiety. Home feels like a burden rather than a sanctuary.', hi: 'घरेलू अशान्ति, माता के स्वास्थ्य की चिन्ता, सम्पत्ति विवाद, गहरी आन्तरिक चिन्ता। घर बोझ लगता है।', sa: 'गृहाशान्तिः, मातृस्वास्थ्यचिन्ता, सम्पत्तिविवादः।' } },
  { house: 5, stars: 1, effect: { en: 'Children face issues, education delayed or disrupted, romance blocked, speculative losses. Creative expression feels stifled.', hi: 'सन्तान समस्या, शिक्षा विलम्बित, प्रेम अवरुद्ध, सट्टे में हानि। रचनात्मक अभिव्यक्ति दबी।', sa: 'सन्तानसमस्याः, शिक्षाविलम्बः, प्रणयः अवरुद्धः।' } },
  { house: 6, stars: 3, effect: { en: 'EXCELLENT — defeats enemies, health improves through discipline, debts cleared, wins legal battles. Saturn rewards hard work in the house of effort.', hi: 'उत्कृष्ट — शत्रुओं पर विजय, अनुशासन से स्वास्थ्य सुधार, ऋण मुक्ति, कानूनी विजय। शनि प्रयास के भाव में कठिन परिश्रम का पुरस्कार देता है।', sa: 'उत्कृष्टम् — शत्रुपराजयः, अनुशासनेन स्वास्थ्यसुधारः, ऋणमुक्तिः।' } },
  { house: 7, stars: 1, effect: { en: 'Marriage severely tested, partnerships strained, business restructuring needed. If relationship is weak, Saturn may end it. If strong, it deepens.', hi: 'विवाह की कड़ी परीक्षा, साझेदारी तनावपूर्ण, व्यापार पुनर्गठन। कमजोर सम्बन्ध समाप्त, मजबूत गहरा।', sa: 'विवाहस्य कठिनपरीक्षा, साझेदारी तनावपूर्णा।' } },
  { house: 8, stars: 1, effect: { en: 'Chronic health issues may surface, hidden matters exposed, forced transformation. Occult interest deepens. Insurance/inheritance complications.', hi: 'दीर्घकालिक स्वास्थ्य समस्याएँ, छिपे मामले उजागर, बाध्य परिवर्तन। बीमा/विरासत जटिलताएँ।', sa: 'दीर्घकालिकस्वास्थ्यसमस्याः, गुप्तविषयाः प्रकटन्ते।' } },
  { house: 9, stars: 2, effect: { en: 'Faith tested, father faces difficulties, long journeys disrupted, dharma questioned. Spiritual growth through doubt — Saturn forces you to earn your beliefs.', hi: 'आस्था की परीक्षा, पिता को कठिनाइयाँ, लम्बी यात्राएँ बाधित, धर्म पर प्रश्न। संदेह से आध्यात्मिक विकास।', sa: 'श्रद्धापरीक्षा, पितुः कठिनताः, दीर्घयात्राः बाधिताः।' } },
  { house: 10, stars: 2, effect: { en: 'Career peak OR career crisis — depends on your Ashtakavarga score. Hard work always pays here. Authority increases if you\'ve earned it. Public image scrutinized.', hi: 'करियर शिखर या करियर संकट — अष्टकवर्ग पर निर्भर। कठिन परिश्रम सदा फलदायक। अर्जित अधिकार बढ़ता है। सार्वजनिक छवि जाँच।', sa: 'वृत्तिशिखरम् अथवा वृत्तिसङ्कटम् — अष्टकवर्गे निर्भरम्।' } },
  { house: 11, stars: 3, effect: { en: 'EXCELLENT — income grows steadily, friends become supportive, wishes start fulfilling. The BEST Saturn transit. Network expands, elder siblings prosper.', hi: 'उत्कृष्ट — आय स्थिर रूप से बढ़ती है, मित्र सहायक, इच्छाएँ पूर्ण। सर्वश्रेष्ठ शनि गोचर। बड़े भाई-बहन समृद्ध।', sa: 'उत्कृष्टम् — आयः स्थिरं वर्धते, मित्राणि सहाय्यकानि, इच्छाः पूर्यन्ते।' } },
  { house: 12, stars: 1, effect: { en: 'Expenses rise sharply, sleep disturbed, foreign travel possible but exhausting. Hospitalization risk. Beginning of Sade Sati if Moon is in next sign.', hi: 'व्यय तीव्र वृद्धि, नींद बाधित, विदेश यात्रा सम्भव पर थकाऊ। अस्पताल का जोखिम। साढ़ेसाती का आरम्भ (यदि चन्द्र अगली राशि में)।', sa: 'व्ययः तीव्रं वर्धते, निद्रा बाधिता, विदेशयात्रा सम्भवा।' } },
];

/* ── Jupiter transit data ─────────────────────────────────────────── */
const JUPITER: { house: number; stars: number; effect: Record<string, string> }[] = [
  { house: 1, stars: 2, effect: { en: 'New beginnings, optimism, weight gain, expanded self-image. Guru\'s blessings on personality.', hi: 'नई शुरुआत, आशावाद, वजन वृद्धि, विस्तृत आत्म-छवि। व्यक्तित्व पर गुरु कृपा।', sa: 'नवारम्भाः, आशावादः, गुरुकृपा व्यक्तित्वे।' } },
  { house: 2, stars: 3, effect: { en: 'Wealth grows, family expands (marriage/birth), speech becomes eloquent, good food and prosperity. One of the best Jupiter transits.', hi: 'धन वृद्धि, परिवार विस्तार (विवाह/जन्म), वाणी वाक्पटु, अच्छा भोजन और समृद्धि। श्रेष्ठ गुरु गोचरों में एक।', sa: 'धनवृद्धिः, परिवारविस्तारः, वाक्पटुता, समृद्धिः।' } },
  { house: 3, stars: 2, effect: { en: 'Courage and communication expand, short travels, sibling bonding. Creative writing and teaching.', hi: 'साहस और संवाद विस्तार, छोटी यात्राएँ, भाई-बहन बन्धन। रचनात्मक लेखन और शिक्षण।', sa: 'शौर्यसंवादविस्तारः, लघुयात्राः।' } },
  { house: 4, stars: 2, effect: { en: 'Home comforts increase, property acquisition possible, mother\'s blessing, inner peace. Academic success.', hi: 'गृह सुख वृद्धि, सम्पत्ति प्राप्ति सम्भव, माता का आशीर्वाद, आन्तरिक शान्ति।', sa: 'गृहसुखवृद्धिः, सम्पत्तिप्राप्तिः सम्भवा, मातृआशीर्वादः।' } },
  { house: 5, stars: 3, effect: { en: 'Children blessed, education excels, romance flourishes, speculation gains, creative peak. Guru blesses the house of Purva Punya.', hi: 'सन्तान सुख, शिक्षा उत्कृष्ट, प्रेम फलता-फूलता, सट्टे में लाभ, रचनात्मक शिखर। पूर्व पुण्य भाव में गुरु।', sa: 'सन्तानसुखम्, शिक्षोत्कृष्टता, प्रणयः पुष्पति।' } },
  { house: 6, stars: 1, effect: { en: 'Health requires attention, enemies gain strength temporarily, legal challenges. Service-oriented work benefits.', hi: 'स्वास्थ्य पर ध्यान आवश्यक, शत्रु अस्थायी रूप से बलवान, कानूनी चुनौतियाँ।', sa: 'स्वास्थ्ये ध्यानम् आवश्यकम्, शत्रवः अस्थायिबलं प्राप्नुवन्ति।' } },
  { house: 7, stars: 3, effect: { en: 'Marriage, partnerships flourish, business expansion through collaboration, legal victories. The best transit for relationships.', hi: 'विवाह, साझेदारी फलती-फूलती, सहयोग से व्यापार विस्तार, कानूनी विजय। सम्बन्धों के लिए सर्वश्रेष्ठ गोचर।', sa: 'विवाहः, साझेदारी पुष्पति, सहकारेण वाणिज्यविस्तारः।' } },
  { house: 8, stars: 1, effect: { en: 'Hidden matters surface, transformation period, occult knowledge deepens. Insurance/inheritance gains possible but through difficulty.', hi: 'छिपे मामले सामने, परिवर्तन काल, गूढ़ ज्ञान गहरा। बीमा/विरासत लाभ सम्भव पर कठिनाई से।', sa: 'गुप्तविषयाः प्रकटन्ते, परिवर्तनकालः।' } },
  { house: 9, stars: 3, effect: { en: 'Fortune peaks, pilgrimages, guru blessings manifest, father prospers, higher education, dharma strengthens. THE BEST Jupiter transit — Guru in its own house of wisdom.', hi: 'भाग्य शिखर, तीर्थयात्रा, गुरु कृपा प्रकट, पिता समृद्ध, उच्च शिक्षा, धर्म प्रबल। सर्वश्रेष्ठ गुरु गोचर — ज्ञान के अपने भाव में गुरु।', sa: 'भाग्यशिखरम्, तीर्थयात्रा, गुरुकृपा प्रकटा, पिता समृद्धः।' } },
  { house: 10, stars: 2, effect: { en: 'Career advancement, recognition, authority expands. Good for promotions and public image. Not the best Jupiter transit but solid.', hi: 'करियर उन्नति, मान्यता, अधिकार विस्तार। पदोन्नति और सार्वजनिक छवि के लिए अच्छा।', sa: 'वृत्तिउन्नतिः, मान्यता, अधिकारविस्तारः।' } },
  { house: 11, stars: 3, effect: { en: 'Gains flow, income rises, wishes fulfilled, network expands massively. Elder siblings prosper. Social recognition.', hi: 'लाभ प्रवाह, आय वृद्धि, इच्छा पूर्ति, जनसम्पर्क तीव्र विस्तार। बड़े भाई-बहन समृद्ध। सामाजिक मान्यता।', sa: 'लाभप्रवाहः, आयवृद्धिः, इच्छापूर्तिः।' } },
  { house: 12, stars: 1, effect: { en: 'Expenses rise, spiritual inclination deepens, foreign travel (pilgrimage type), sleep issues, hospitalization possible. Good for meditation retreats.', hi: 'व्यय वृद्धि, आध्यात्मिक झुकाव गहरा, विदेश यात्रा (तीर्थ प्रकार), नींद समस्या। ध्यान शिविर के लिए अच्छा।', sa: 'व्ययवृद्धिः, आध्यात्मिकझुकावो गहनः।' } },
];

/* ── Rahu-Ketu axis data ──────────────────────────────────────────── */
const RAHU_KETU: { rahu: number; ketu: number; theme: Record<string, string> }[] = [
  { rahu: 1, ketu: 7, theme: { en: 'Self-obsession vs partnership dissolution. Identity transformation through intense self-focus. Relationships suffer as ego expands. Past-life loner energy surfaces.', hi: 'आत्म-जुनून बनाम साझेदारी विघटन। तीव्र आत्म-केन्द्रन से पहचान परिवर्तन। अहंकार विस्तार से सम्बन्ध पीड़ित।', sa: 'आत्मजुनूनम् साझेदारीविघटनं च। तीव्रात्मकेन्द्रणात् अस्मिता-परिवर्तनम्।' } },
  { rahu: 7, ketu: 1, theme: { en: 'Marriage focus, partnership expansion, business through others. Self-sacrifice for relationships. May attract foreign spouse or unconventional partnership.', hi: 'विवाह केन्द्र, साझेदारी विस्तार, दूसरों के माध्यम से व्यापार। सम्बन्धों के लिए आत्म-त्याग। विदेशी या अपरम्परागत साथी।', sa: 'विवाहकेन्द्रम्, साझेदारीविस्तारः, अन्येषां माध्यमेन वाणिज्यम्।' } },
  { rahu: 10, ketu: 4, theme: { en: 'Career ambition explodes, home life disrupted. Public image dominates private peace. Mother may face challenges. Worldly success at domestic cost.', hi: 'करियर महत्वाकांक्षा विस्फोट, गृह जीवन बाधित। सार्वजनिक छवि निजी शान्ति पर हावी। माता को चुनौतियाँ। घरेलू कीमत पर सांसारिक सफलता।', sa: 'वृत्तिमहत्त्वाकाङ्क्षा विस्फोटः, गृहजीवनं बाधितम्।' } },
  { rahu: 4, ketu: 10, theme: { en: 'Home focus intensifies, career dissolves or transforms. Property gains through unusual means. Emotional security sought at career cost. Foreign residence.', hi: 'गृह केन्द्रन तीव्र, करियर विघटित या रूपान्तरित। असामान्य साधनों से सम्पत्ति लाभ। करियर कीमत पर भावनात्मक सुरक्षा। विदेशी निवास।', sa: 'गृहकेन्द्रणं तीव्रम्, वृत्तिः विघटिता रूपान्तरिता वा।' } },
  { rahu: 5, ketu: 11, theme: { en: 'Children and creativity obsess the mind, network and friendships dissolve. Speculative risks attract. Romance becomes karmic. Education transformation.', hi: 'सन्तान और रचनात्मकता मन पर हावी, मित्रता और जनसम्पर्क विघटित। सट्टा जोखिम आकर्षित। प्रेम कार्मिक। शिक्षा रूपान्तरण।', sa: 'सन्तानरचनात्मकता मनसि हाविनी, मैत्री विघटिता।' } },
  { rahu: 11, ketu: 5, theme: { en: 'Gains and network expand massively, children or creativity face detachment. Wishes manifest through unconventional means. Elder sibling connection disrupted.', hi: 'लाभ और जनसम्पर्क तीव्र विस्तार, सन्तान या रचनात्मकता से वैराग्य। अपरम्परागत साधनों से इच्छा पूर्ति।', sa: 'लाभजनसम्पर्कयोः तीव्रविस्तारः, सन्तानरचनात्मकताभ्यां वैराग्यम्।' } },
];

/* ── Planet selector config ──────────────────────────────────────── */
type PlanetKey = 'saturn' | 'jupiter' | 'rahu_ketu';
const PLANET_TABS: { key: PlanetKey; label: Record<string, string>; color: string; stay: Record<string, string> }[] = [
  { key: 'saturn', label: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, color: '#60a5fa', stay: { en: '~2.5 yrs/sign', hi: '~2.5 वर्ष/राशि', sa: '~2.5 वर्षाणि/राशिः' } },
  { key: 'jupiter', label: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' }, color: '#facc15', stay: { en: '~1 yr/sign', hi: '~1 वर्ष/राशि', sa: '~1 वर्षम्/राशिः' } },
  { key: 'rahu_ketu', label: { en: 'Rahu-Ketu', hi: 'राहु-केतु', sa: 'राहुकेतू' }, color: '#a78bfa', stay: { en: '~1.5 yrs/sign', hi: '~1.5 वर्ष/राशि', sa: '~1.5 वर्षाणि/राशिः' } },
];

/* ── Page ──────────────────────────────────────────────────────────── */
export default function TransitGuidePage() {
  const locale = useLocale() as Locale;
  const [selected, setSelected] = useState<PlanetKey>('saturn');
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  const houseData = selected === 'saturn' ? SATURN : selected === 'jupiter' ? JUPITER : null;
  const axisData = selected === 'rahu_ketu' ? RAHU_KETU : null;
  const activeTab = PLANET_TABS.find(p => p.key === selected)!;

  return (
    <main className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4">
          <Orbit className="w-4 h-4 text-indigo-400" />
          <span className="text-indigo-300 text-sm font-medium">{tl({ en: 'Reference', hi: 'सन्दर्भ', sa: 'सन्दर्भ' }, locale)}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto text-base leading-relaxed">{t('subtitle')}</p>
      </motion.div>

      {/* Section 1: How to Read Transits */}
      <LessonSection number={1} title={t('howTitle')}>
        <p>{t('howP1')}</p>
        <p>{t('howP2')}</p>
      </LessonSection>

      {/* Planet Selector */}
      <div className="mb-6">
        <p className="text-center text-sm text-text-tertiary mb-3">{t('selectPlanet')}</p>
        <div className="flex justify-center gap-3 flex-wrap">
          {PLANET_TABS.map(tab => (
            <button key={tab.key} onClick={() => setSelected(tab.key)}
              className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                selected === tab.key
                  ? 'border-gold-primary/40 bg-gold-primary/15 text-gold-light scale-105 shadow-lg shadow-gold-primary/10'
                  : 'border-white/10 bg-white/5 text-text-secondary hover:bg-white/10'
              }`}
            >
              <span style={{ color: selected === tab.key ? tab.color : undefined }}>{lt(tab.label as LocaleText, locale)}</span>
              <span className="block text-xs mt-0.5 opacity-60">{lt(tab.stay as LocaleText, locale)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section 2/3: House-by-House Cards */}
      <AnimatePresence mode="wait">
        {houseData && (
          <motion.div key={selected} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <LessonSection number={2} title={`${lt(activeTab.label as LocaleText, locale)} — ${tl({ en: 'Transit Through 12 Houses', hi: '12 भावों में गोचर', sa: '12 भावों में गोचर' }, locale)}`}>
              <div className="grid gap-3 sm:grid-cols-2">
                {houseData.map(h => (
                  <motion.div key={h.house} whileHover={{ scale: 1.015 }}
                    className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 hover:border-gold-primary/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold" style={{ color: activeTab.color }}>
                        {tl({ en: `House ${h.house}`, hi: `${h.house}वाँ भाव`, sa: `${h.house}वाँ भाव` }, locale)}
                      </span>
                      <Rating stars={h.stars} />
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{lt(h.effect as LocaleText, locale)}</p>
                  </motion.div>
                ))}
              </div>
            </LessonSection>
          </motion.div>
        )}

        {axisData && (
          <motion.div key="rahu_ketu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <LessonSection number={2} title={`${lt(activeTab.label as LocaleText, locale)} — ${tl({ en: 'Axis Effects', hi: 'अक्ष प्रभाव', sa: 'अक्ष प्रभाव' }, locale)}`}>
              <p className="mb-4 text-sm">
                {tl({ en: 'Rahu and Ketu are always 180 degrees apart. Their effects are read as axis pairs.', hi: 'राहु-केतु सदैव 180° विपरीत होते हैं। प्रभाव अक्ष (axis) जोड़ियों में पढ़ा जाता है।', sa: 'राहु-केतु सदैव 180° विपरीत होते हैं। प्रभाव अक्ष (axis) जोड़ियों में पढ़ा जाता है।' }, locale)}
              </p>
              <div className="grid gap-4">
                {axisData.map(a => (
                  <motion.div key={`${a.rahu}-${a.ketu}`} whileHover={{ scale: 1.01 }}
                    className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-5 border-l-4 border-l-purple-400/50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-purple-300 font-bold text-sm">
                        {tl({ en: `Rahu ${a.rahu}th / Ketu ${a.ketu}th`, hi: `राहु ${a.rahu}वें / केतु ${a.ketu}वें`, sa: `राहु ${a.rahu}वें / केतु ${a.ketu}वें` }, locale)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{lt(a.theme as LocaleText, locale)}</p>
                  </motion.div>
                ))}
              </div>
            </LessonSection>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section: Double Transit Theory */}
      <LessonSection number={3} title={t('doubleTitle')} variant="highlight">
        <p>{t('doubleP1')}</p>
        <p>{t('doubleP2')}</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { event: { en: 'Marriage', hi: 'विवाह', sa: 'विवाहः' }, house: '7th', icon: '7' },
            { event: { en: 'Career', hi: 'करियर', sa: 'वृत्तिः' }, house: '10th', icon: '10' },
            { event: { en: 'Children', hi: 'सन्तान', sa: 'सन्तानम्' }, house: '5th', icon: '5' },
          ].map(d => (
            <div key={d.house} className="text-center p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/10">
              <div className="w-10 h-10 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center mx-auto mb-2 text-gold-light font-bold text-sm">{d.icon}</div>
              <p className="text-sm font-semibold text-gold-light">{lt(d.event as LocaleText, locale)}</p>
              <p className="text-xs text-text-tertiary mt-1">{tl({ en: `Jup + Sat → ${d.house}`, hi: `गुरु + शनि → ${d.house}`, sa: `गुरु + शनि → ${d.house}` }, locale)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Related Links */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gold-gradient mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gold-light" />
          {t('related')}
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/transits', label: { en: 'Live Transits', hi: 'जीवित गोचर', sa: 'जीवन्तगोचरः' } },
            { href: '/kundali', label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएँ', sa: 'कुण्डलीनिर्माणम्' } },
            { href: '/sade-sati', label: { en: 'Sade Sati Check', hi: 'साढ़ेसाती जाँच', sa: 'साढेसातिपरीक्षा' } },
            { href: '/learn/gochar', label: { en: 'Learn: Gochar', hi: 'सीखें: गोचर', sa: 'अध्ययनम्: गोचरः' } },
          ].map((link) => (
            <Link key={link.href} href={link.href as '/'} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
              {lt(link.label as LocaleText, locale)}
            </Link>
          ))}
        </div>
      </motion.div>
    </main>
  );
}

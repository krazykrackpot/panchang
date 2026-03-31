'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star, Shield, Crown, Coins, AlertTriangle, Sparkles } from 'lucide-react';
import type { Locale } from '@/types/panchang';

// ─── Yoga Data ──────────────────────────────────────────────────────────────

interface YogaDef {
  id: string;
  name: { en: string; hi: string };
  category: string;
  planets: string;
  condition: { en: string; hi: string };
  effect: { en: string; hi: string };
  classical: string;
  strength: 'rare' | 'common' | 'moderate';
  auspicious: boolean;
}

const YOGA_CATEGORIES = [
  { key: 'mahapurusha', label: { en: 'Pancha Mahapurusha Yogas', hi: 'पंच महापुरुष योग' }, icon: Crown, color: 'text-amber-400', desc: { en: 'Formed when Mars, Mercury, Jupiter, Venus, or Saturn is in own sign or exaltation in a kendra (1st, 4th, 7th, 10th house). These are among the most powerful yogas and produce extraordinary individuals.', hi: 'जब मंगल, बुध, गुरु, शुक्र या शनि अपनी या उच्च राशि में केंद्र (1, 4, 7, 10 भाव) में हो। ये सबसे शक्तिशाली योगों में हैं।' } },
  { key: 'raja', label: { en: 'Raja Yogas (Power & Authority)', hi: 'राज योग (शक्ति एवं अधिकार)' }, icon: Crown, color: 'text-gold-light', desc: { en: 'Formed by the association of Kendra lords (1,4,7,10) with Trikona lords (1,5,9). The conjunction, mutual aspect, or exchange of these lords creates Raja Yoga — conferring power, position, and authority.', hi: 'केंद्रेश (1,4,7,10) और त्रिकोणेश (1,5,9) के संबंध से बनता है। इनकी युति, परस्पर दृष्टि या परिवर्तन राजयोग बनाता है — शक्ति, पद और अधिकार प्रदान करता है।' } },
  { key: 'dhana', label: { en: 'Dhana Yogas (Wealth)', hi: 'धन योग' }, icon: Coins, color: 'text-emerald-400', desc: { en: 'Combinations involving 2nd house (accumulated wealth), 11th house (income/gains), and their lords. Strong Dhana Yogas can produce billionaires; weak ones still indicate comfortable living.', hi: '2वें भाव (संचित धन), 11वें भाव (आय/लाभ) और उनके स्वामियों से संबंधित योग। मजबूत धन योग अत्यधिक धनवान बना सकते हैं।' } },
  { key: 'chandra', label: { en: 'Chandra (Moon) Yogas', hi: 'चंद्र योग' }, icon: Star, color: 'text-blue-300', desc: { en: 'Yogas formed relative to the Moon\'s position. The Moon governs the mind, emotions, and public perception. Its association with other planets creates distinct mental and social patterns.', hi: 'चंद्रमा की स्थिति से बनने वाले योग। चंद्र मन, भावनाओं और सार्वजनिक छवि को नियंत्रित करता है।' } },
  { key: 'special', label: { en: 'Special Yogas', hi: 'विशेष योग' }, icon: Sparkles, color: 'text-violet-400', desc: { en: 'Unique combinations that don\'t fit standard categories — Neecha Bhanga (debilitation cancellation), Viparita Raja (adversity to advantage), Parivartana (sign exchange), and more.', hi: 'विशिष्ट योग जो मानक श्रेणियों में नहीं आते — नीच भंग, विपरीत राज, परिवर्तन आदि।' } },
  { key: 'inauspicious', label: { en: 'Inauspicious Yogas', hi: 'अशुभ योग' }, icon: AlertTriangle, color: 'text-red-400', desc: { en: 'Challenging combinations that indicate difficulties. However, even inauspicious yogas have remedies, and their effects can be mitigated through conscious effort, gemstones, mantras, and charitable acts.', hi: 'कठिन योग जो बाधाओं का संकेत देते हैं। हालांकि, अशुभ योगों के भी उपाय हैं — रत्न, मंत्र और दान से प्रभाव कम हो सकता है।' } },
];

const YOGAS: YogaDef[] = [
  // Pancha Mahapurusha
  { id: 'ruchaka', category: 'mahapurusha', name: { en: 'Ruchaka Yoga', hi: 'रुचक योग' }, planets: 'Mars', condition: { en: 'Mars in Aries, Scorpio, or Capricorn in a Kendra house', hi: 'मंगल मेष, वृश्चिक या मकर में केंद्र में' }, effect: { en: 'Courageous commander, strong physique, leadership over armies, fearless personality. Native becomes a renowned warrior or sports champion.', hi: 'साहसी सेनापति, बलशाली शरीर, सेना पर नेतृत्व। जातक प्रसिद्ध योद्धा या खिलाड़ी बनता है।' }, classical: 'BPHS Ch.34 v.1-3', strength: 'rare', auspicious: true },
  { id: 'bhadra', category: 'mahapurusha', name: { en: 'Bhadra Yoga', hi: 'भद्र योग' }, planets: 'Mercury', condition: { en: 'Mercury in Gemini or Virgo in a Kendra house', hi: 'बुध मिथुन या कन्या में केंद्र में' }, effect: { en: 'Exceptional intelligence, eloquent speech, commercial success. Native excels in writing, teaching, commerce, and intellectual pursuits.', hi: 'असाधारण बुद्धि, वाक्पटुता, वाणिज्यिक सफलता। लेखन, शिक्षण, व्यापार में उत्कृष्ट।' }, classical: 'BPHS Ch.34 v.4-6', strength: 'moderate', auspicious: true },
  { id: 'hamsa', category: 'mahapurusha', name: { en: 'Hamsa Yoga', hi: 'हंस योग' }, planets: 'Jupiter', condition: { en: 'Jupiter in Sagittarius, Pisces, or Cancer in a Kendra house', hi: 'गुरु धनु, मीन या कर्क में केंद्र में' }, effect: { en: 'Wisdom incarnate, spiritual leader, respected teacher. Native is virtuous, charitable, and achieves fame through righteous conduct.', hi: 'ज्ञान का अवतार, आध्यात्मिक नेता, सम्मानित शिक्षक। जातक धर्मपरायण, दानशील।' }, classical: 'BPHS Ch.34 v.7-9', strength: 'rare', auspicious: true },
  { id: 'malavya', category: 'mahapurusha', name: { en: 'Malavya Yoga', hi: 'मालव्य योग' }, planets: 'Venus', condition: { en: 'Venus in Taurus, Libra, or Pisces in a Kendra house', hi: 'शुक्र वृषभ, तुला या मीन में केंद्र में' }, effect: { en: 'Beauty, luxury, artistic excellence, happy marriage. Native is cultured, wealthy, and enjoys the finest things in life.', hi: 'सौंदर्य, विलासिता, कलात्मक उत्कृष्टता, सुखी विवाह। जातक संस्कारी और धनवान।' }, classical: 'BPHS Ch.34 v.10-12', strength: 'moderate', auspicious: true },
  { id: 'shasha', category: 'mahapurusha', name: { en: 'Shasha Yoga', hi: 'शश योग' }, planets: 'Saturn', condition: { en: 'Saturn in Capricorn, Aquarius, or Libra in a Kendra house', hi: 'शनि मकर, कुम्भ या तुला में केंद्र में' }, effect: { en: 'Authority over common people, political power, wealth from masses. Native rises through discipline, patience, and systematic effort.', hi: 'जनता पर अधिकार, राजनीतिक शक्ति। जातक अनुशासन और धैर्य से उन्नत होता है।' }, classical: 'BPHS Ch.34 v.13-15', strength: 'moderate', auspicious: true },

  // Raja Yogas
  { id: 'dharma_karma', category: 'raja', name: { en: 'Dharma-Karma Adhipati Yoga', hi: 'धर्म-कर्म अधिपति योग' }, planets: '9th + 10th lords', condition: { en: '9th lord and 10th lord conjunct, mutually aspect, or exchange signs', hi: '9वें और 10वें भावेश की युति, परस्पर दृष्टि, या राशि परिवर्तन' }, effect: { en: 'The most powerful Raja Yoga. Dharma (purpose) meets Karma (action). Native achieves extraordinary success aligned with their life mission.', hi: 'सबसे शक्तिशाली राजयोग। धर्म और कर्म का मिलन। जातक जीवन मिशन के अनुरूप असाधारण सफलता प्राप्त करता है।' }, classical: 'BPHS Ch.34 v.15', strength: 'rare', auspicious: true },
  { id: 'adhi_yoga', category: 'raja', name: { en: 'Adhi Yoga', hi: 'अधि योग' }, planets: 'Benefics in 6/7/8 from Moon', condition: { en: 'Natural benefics (Mercury, Jupiter, Venus) in 6th, 7th, and 8th houses from Moon', hi: 'शुभ ग्रह (बुध, गुरु, शुक्र) चंद्र से 6, 7, 8वें भाव में' }, effect: { en: 'Creates a commander, minister, or king. If all 3 benefics are present, the native becomes a ruler. 2 benefics = minister. 1 = commander.', hi: 'सेनापति, मंत्री या राजा बनाता है। 3 शुभ = शासक, 2 = मंत्री, 1 = सेनापति।' }, classical: 'Phaladeepika Ch.6 v.10', strength: 'rare', auspicious: true },

  // Dhana Yogas
  { id: 'lakshmi_yoga', category: 'dhana', name: { en: 'Lakshmi Yoga', hi: 'लक्ष्मी योग' }, planets: '9th lord + Lagna lord', condition: { en: '9th lord in kendra/trikona AND Lagna lord strong (own/exalted/kendra)', hi: '9वें भावेश केंद्र/त्रिकोण में और लग्नेश बलवान' }, effect: { en: 'Blessed by Goddess Lakshmi. Wealth flows effortlessly, native is beautiful, generous, and commands respect.', hi: 'लक्ष्मी देवी की कृपा। धन सहज प्रवाहित, जातक सुंदर, उदार और सम्मानित।' }, classical: 'BPHS Ch.36 v.4', strength: 'rare', auspicious: true },
  { id: 'gajakesari', category: 'dhana', name: { en: 'Gajakesari Yoga', hi: 'गजकेसरी योग' }, planets: 'Jupiter + Moon', condition: { en: 'Jupiter in kendra (1,4,7,10) from Moon. Stronger if both in kendra from Lagna.', hi: 'गुरु चंद्र से केंद्र (1,4,7,10) में। दोनों लग्न से केंद्र में हों तो अधिक बलवान।' }, effect: { en: 'Like a lion among elephants — the native stands out in any crowd. Gives intelligence, eloquence, wealth, and lasting reputation across generations.', hi: 'हाथियों में शेर — भीड़ में जातक अलग दिखता है। बुद्धि, वाक्पटुता, धन और स्थायी प्रतिष्ठा।' }, classical: 'Phaladeepika Ch.6 v.1', strength: 'common', auspicious: true },

  // Chandra Yogas
  { id: 'sunafa', category: 'chandra', name: { en: 'Sunafa Yoga', hi: 'सुनफा योग' }, planets: 'Planet in 2nd from Moon', condition: { en: 'Any planet (except Sun) in the 2nd house from Moon', hi: 'कोई ग्रह (सूर्य को छोड़कर) चंद्र से 2nd भाव में' }, effect: { en: 'Self-made wealth, good reputation, comfortable life. The native earns through their own effort rather than inheritance.', hi: 'स्वनिर्मित धन, अच्छी प्रतिष्ठा, सुखद जीवन। जातक स्वयं के प्रयास से कमाता है।' }, classical: 'Phaladeepika Ch.6 v.3', strength: 'common', auspicious: true },
  { id: 'kemadruma', category: 'chandra', name: { en: 'Kemadruma Yoga', hi: 'केमद्रुम योग' }, planets: 'Moon alone', condition: { en: 'No planet (except Sun, Rahu, Ketu) in 2nd or 12th from Moon', hi: 'चंद्र से 2nd और 12th में कोई ग्रह नहीं (सूर्य, राहु, केतु छोड़कर)' }, effect: { en: 'Moon is isolated — poverty, struggle, loneliness, lack of emotional support. CANCELLATION: Planet in kendra from Moon or Lagna, or Moon in kendra with benefic aspect.', hi: 'चंद्र एकाकी — गरीबी, संघर्ष, अकेलापन। रद्दीकरण: चंद्र या लग्न से केंद्र में ग्रह।' }, classical: 'Phaladeepika Ch.6 v.8', strength: 'common', auspicious: false },

  // Special Yogas
  { id: 'neechabhanga', category: 'special', name: { en: 'Neecha Bhanga Raja Yoga', hi: 'नीच भंग राज योग' }, planets: 'Debilitated planet + cancellation', condition: { en: 'A debilitated planet whose debilitation is cancelled: (1) debilitation lord in kendra, (2) exaltation lord in kendra, (3) debilitated planet gets exalted in Navamsha, (4) debilitated planet aspected by its sign lord', hi: 'नीच ग्रह जिसका नीच भंग हो: (1) नीच राशि स्वामी केंद्र में, (2) उच्च राशि स्वामी केंद्र में, (3) नवांश में उच्च, (4) राशि स्वामी की दृष्टि' }, effect: { en: 'Transforms weakness into extraordinary strength. Like a phoenix rising from ashes — the native overcomes initial hardships to achieve greatness far beyond what a normally placed planet would give.', hi: 'कमजोरी को असाधारण शक्ति में बदलता है। राख से उठने वाला पक्षी — जातक प्रारंभिक कठिनाइयों को पार कर महानता प्राप्त करता है।' }, classical: 'BPHS Ch.34 v.22', strength: 'rare', auspicious: true },
  { id: 'viparita_raja', category: 'special', name: { en: 'Viparita Raja Yoga', hi: 'विपरीत राज योग' }, planets: '6th/8th/12th lords', condition: { en: 'Lord of 6th, 8th, or 12th house placed in another dusthana (6/8/12). Three types: Harsha (6th lord in 8/12), Sarala (8th in 6/12), Vimala (12th in 6/8).', hi: '6, 8, 12वें भावेश अन्य दुःस्थान में। तीन प्रकार: हर्ष, सरला, विमल।' }, effect: { en: 'Turns adversity into advantage. Success through unconventional means, difficult circumstances, or by overcoming enemies. Often seen in charts of successful entrepreneurs and crisis leaders.', hi: 'विपरीत परिस्थितियों में सफलता। अपरंपरागत तरीकों से सिद्धि। उद्यमियों की कुंडलियों में देखा जाता है।' }, classical: 'BPHS Ch.35 v.7', strength: 'moderate', auspicious: true },
  { id: 'parivartana', category: 'special', name: { en: 'Parivartana Yoga', hi: 'परिवर्तन योग' }, planets: 'Two planets exchanging signs', condition: { en: 'Two planets in each other\'s signs (mutual exchange). Three types: Maha Parivartana (both in good houses), Khala (one in dusthana), Dainya (both in dusthanas).', hi: 'दो ग्रह एक दूसरे की राशियों में। तीन प्रकार: महा परिवर्तन, खल, दैन्य।' }, effect: { en: 'The two houses involved become deeply connected, sharing resources and energies. Maha Parivartana is very auspicious; the others give mixed results.', hi: 'दो भाव गहराई से जुड़ जाते हैं, संसाधन और ऊर्जा साझा करते हैं।' }, classical: 'BPHS Ch.35', strength: 'moderate', auspicious: true },

  // Inauspicious
  { id: 'kala_sarpa', category: 'inauspicious', name: { en: 'Kala Sarpa Yoga', hi: 'काल सर्प योग' }, planets: 'All planets between Rahu-Ketu', condition: { en: 'All 7 planets (Sun through Saturn) hemmed between Rahu and Ketu on one side of the chart', hi: 'सभी 7 ग्रह (सूर्य से शनि) राहु और केतु के बीच एक तरफ' }, effect: { en: 'Serpent of time — cyclical hardships, sudden reversals, karmic intensity. Life follows a pattern of buildup and collapse until the karmic lesson is learned. Remedy: Rahu-Ketu shanti, Naga puja.', hi: 'काल सर्प — चक्रीय कठिनाइयाँ, अचानक उलटफेर। उपाय: राहु-केतु शांति, नाग पूजा।' }, classical: 'Manasagari', strength: 'moderate', auspicious: false },
  { id: 'guru_chandal', category: 'inauspicious', name: { en: 'Guru Chandal Yoga', hi: 'गुरु चांडाल योग' }, planets: 'Jupiter + Rahu', condition: { en: 'Jupiter conjunct Rahu in any house', hi: 'गुरु-राहु युति किसी भी भाव में' }, effect: { en: 'Jupiter\'s wisdom corrupted by Rahu\'s deception. Native may follow wrong gurus, make immoral choices dressed as righteous ones, or face betrayal by mentors.', hi: 'गुरु का ज्ञान राहु के छल से दूषित। जातक गलत गुरुओं का अनुसरण, या गुरुओं द्वारा धोखा।' }, classical: 'BPHS Ch.35', strength: 'common', auspicious: false },
];

export default function YogasDetailedPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expandedCategory, setExpandedCategory] = useState<string | null>('mahapurusha');
  const [expandedYoga, setExpandedYoga] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {isHi ? 'योग — ग्रह संयोगों का विज्ञान' : 'Yogas — The Science of Planetary Combinations'}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {isHi
            ? 'योग संस्कृत शब्द है जिसका अर्थ "संयोग" या "मिलन" है। ज्योतिष में, योग ग्रहों की विशिष्ट स्थितियाँ हैं जो जातक के जीवन पर विशेष प्रभाव डालती हैं। पाराशर ऋषि ने BPHS में 100+ योगों का वर्णन किया है। यहाँ हम सबसे महत्वपूर्ण योगों का विस्तृत अध्ययन करेंगे।'
            : 'Yoga means "union" or "combination" in Sanskrit. In Jyotish, yogas are specific planetary configurations that produce distinct effects in the native\'s life. Sage Parashara described 100+ yogas in BPHS. Here we study the most important ones in detail, with formation rules, effects, and classical references.'}
        </p>
      </div>

      {/* How Yogas Form — visual diagram */}
      <div className="glass-card rounded-2xl p-6 border border-gold-primary/15">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={headingFont}>
          {isHi ? 'योग कैसे बनते हैं?' : 'How Yogas Form'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: { en: 'Conjunction', hi: 'युति' }, desc: { en: 'Two or more planets in the same sign/house', hi: 'दो या अधिक ग्रह एक ही राशि/भाव में' }, icon: '⊕' },
            { type: { en: 'Aspect (Drishti)', hi: 'दृष्टि' }, desc: { en: 'Planets influencing each other through special aspects (7th, 5th/9th for Jupiter, etc.)', hi: 'ग्रहों का परस्पर दृष्टि से प्रभाव (7वीं, गुरु की 5/9वीं)' }, icon: '◈' },
            { type: { en: 'Exchange (Parivartana)', hi: 'परिवर्तन' }, desc: { en: 'Two planets in each other\'s signs — creates deep house connection', hi: 'दो ग्रह एक दूसरे की राशियों में — गहरा भाव संबंध' }, icon: '⇄' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-bg-secondary/50 border border-gold-primary/10 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-gold-light font-bold text-sm mb-1">{isHi ? item.type.hi : item.type.en}</div>
              <div className="text-text-secondary text-xs">{isHi ? item.desc.hi : item.desc.en}</div>
            </div>
          ))}
        </div>
      </div>

      {/* House classification reminder */}
      <div className="glass-card rounded-2xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'भाव वर्गीकरण (याद रखें)' : 'House Classification (Remember)'}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
            <div className="text-emerald-400 font-bold mb-0.5">Kendras (Angular)</div>
            <div className="text-text-secondary">1, 4, 7, 10</div>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/15">
            <div className="text-blue-300 font-bold mb-0.5">Trikonas (Trinal)</div>
            <div className="text-text-secondary">1, 5, 9</div>
          </div>
          <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/15">
            <div className="text-red-400 font-bold mb-0.5">Dusthanas (Malefic)</div>
            <div className="text-text-secondary">6, 8, 12</div>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
            <div className="text-amber-400 font-bold mb-0.5">Upachayas (Growth)</div>
            <div className="text-text-secondary">3, 6, 10, 11</div>
          </div>
        </div>
      </div>

      {/* Yoga Categories */}
      {YOGA_CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const yogasInCat = YOGAS.filter(y => y.category === cat.key);
        const isExpanded = expandedCategory === cat.key;
        return (
          <div key={cat.key} className="glass-card rounded-2xl overflow-hidden">
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
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  {/* Category description */}
                  <div className="px-6 pb-4 border-t border-gold-primary/10 pt-4">
                    <p className="text-text-secondary text-sm leading-relaxed">{isHi ? cat.desc.hi : cat.desc.en}</p>
                  </div>

                  {/* Individual yogas */}
                  <div className="px-6 pb-6 space-y-3">
                    {yogasInCat.map((yoga) => {
                      const isYogaExpanded = expandedYoga === yoga.id;
                      return (
                        <div key={yoga.id} className={`rounded-xl border ${yoga.auspicious ? 'border-emerald-500/15' : 'border-red-500/15'} overflow-hidden`}>
                          <button onClick={() => setExpandedYoga(isYogaExpanded ? null : yoga.id)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold-primary/3 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className={`w-2 h-2 rounded-full ${yoga.auspicious ? 'bg-emerald-400' : 'bg-red-400'}`} />
                              <span className="text-gold-light font-bold text-sm" style={headingFont}>{isHi ? yoga.name.hi : yoga.name.en}</span>
                              <span className="text-text-tertiary text-[10px]">{yoga.planets}</span>
                              {yoga.strength === 'rare' && <span className="px-1.5 py-0.5 rounded text-[9px] bg-violet-500/15 text-violet-300 border border-violet-500/20">Rare</span>}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isYogaExpanded ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {isYogaExpanded && (
                              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                <div className="px-4 pb-4 space-y-3">
                                  <div>
                                    <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-1">{isHi ? 'निर्माण नियम' : 'Formation Rule'}</div>
                                    <div className="text-text-secondary text-xs leading-relaxed">{isHi ? yoga.condition.hi : yoga.condition.en}</div>
                                  </div>
                                  <div>
                                    <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-1">{isHi ? 'फल (प्रभाव)' : 'Effects'}</div>
                                    <div className="text-text-secondary text-xs leading-relaxed">{isHi ? yoga.effect.hi : yoga.effect.en}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-text-tertiary text-[10px]">{yoga.classical}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${yoga.auspicious ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-400'}`}>
                                      {yoga.auspicious ? (isHi ? 'शुभ' : 'Auspicious') : (isHi ? 'अशुभ' : 'Inauspicious')}
                                    </span>
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

      {/* Check your chart CTA */}
      <div className="glass-card rounded-2xl p-6 text-center border border-gold-primary/20">
        <h3 className="text-gold-light font-bold text-lg mb-2" style={headingFont}>
          {isHi ? 'अपनी कुण्डली में योग देखें' : 'Check Yogas in Your Chart'}
        </h3>
        <p className="text-text-secondary text-xs mb-4">
          {isHi ? 'हमारा इंजन 55+ योगों का स्वचालित पता लगाता है' : 'Our engine automatically detects 55+ yogas in your birth chart'}
        </p>
        <a href={`/${locale}/kundali`} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-primary text-bg-primary font-semibold hover:bg-gold-light transition-colors text-sm">
          {isHi ? 'कुण्डली बनाएं →' : 'Generate Kundali →'}
        </a>
      </div>
    </div>
  );
}

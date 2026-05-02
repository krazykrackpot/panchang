'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Gem, ArrowLeft, Star, Shield, Sparkles, Info, Loader2 } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { useBirthDataStore } from '@/stores/birth-data-store';
import AuthorByline from '@/components/ui/AuthorByline';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';

// ─── Rudraksha Data ──────────────────────────────────────────────
// Mapping: Planet → Rudraksha Mukhi, Deity, Mantra, Benefits
interface RudrakshaInfo {
  planetId: number;     // 0=Sun..8=Ketu
  planetName: { en: string; hi: string };
  mukhi: number[];      // face count(s)
  deity: { en: string; hi: string };
  mantra: string;
  benefits: { en: string; hi: string };
  dayToWear: { en: string; hi: string };
  element: string;
}

const RUDRAKSHA_DATA: RudrakshaInfo[] = [
  {
    planetId: 0, planetName: { en: 'Sun', hi: 'सूर्य' },
    mukhi: [1, 12], deity: { en: 'Shiva / Surya', hi: 'शिव / सूर्य' },
    mantra: 'Om Hreem Namah',
    benefits: { en: 'Enhances leadership, authority, self-confidence, and vitality. Removes obstacles related to career and recognition. Strengthens the heart and overall constitution.', hi: 'नेतृत्व, अधिकार, आत्मविश्वास और जीवनशक्ति बढ़ाता है। कैरियर और प्रतिष्ठा से सम्बन्धित बाधाएं दूर करता है। हृदय और समग्र शरीर को सुदृढ़ करता है।' },
    dayToWear: { en: 'Sunday', hi: 'रविवार' },
    element: 'Fire',
  },
  {
    planetId: 1, planetName: { en: 'Moon', hi: 'चन्द्र' },
    mukhi: [2], deity: { en: 'Ardhanarishvara', hi: 'अर्धनारीश्वर' },
    mantra: 'Om Namah',
    benefits: { en: 'Brings emotional balance, mental peace, and harmonious relationships. Excellent for those with weak or afflicted Moon. Calms anxiety, improves sleep, and strengthens intuition.', hi: 'भावनात्मक संतुलन, मानसिक शांति और सौहार्दपूर्ण सम्बन्ध लाता है। कमजोर या पीड़ित चन्द्र वालों के लिए उत्तम। चिन्ता शान्त करता है, नींद सुधारता है।' },
    dayToWear: { en: 'Monday', hi: 'सोमवार' },
    element: 'Water',
  },
  {
    planetId: 2, planetName: { en: 'Mars', hi: 'मंगल' },
    mukhi: [3], deity: { en: 'Agni', hi: 'अग्नि' },
    mantra: 'Om Kleem Namah',
    benefits: { en: 'Boosts courage, physical strength, and determination. Helps overcome laziness, blood-related disorders, and Mangal Dosha effects. Enhances willpower and competitive ability.', hi: 'साहस, शारीरिक बल और दृढ़ संकल्प बढ़ाता है। आलस्य, रक्त-सम्बन्धी विकार और मंगल दोष प्रभाव दूर करता है। इच्छाशक्ति और प्रतिस्पर्धात्मक क्षमता बढ़ाता है।' },
    dayToWear: { en: 'Tuesday', hi: 'मंगलवार' },
    element: 'Fire',
  },
  {
    planetId: 3, planetName: { en: 'Mercury', hi: 'बुध' },
    mukhi: [4], deity: { en: 'Brahma', hi: 'ब्रह्मा' },
    mantra: 'Om Hreem Namah',
    benefits: { en: 'Sharpens intellect, communication skills, and analytical thinking. Ideal for students, writers, traders, and professionals. Improves speech, memory, and mathematical ability.', hi: 'बुद्धि, संवाद कौशल और विश्लेषणात्मक सोच तीक्ष्ण करता है। विद्यार्थियों, लेखकों, व्यापारियों के लिए आदर्श। वाणी, स्मृति और गणितीय क्षमता सुधारता है।' },
    dayToWear: { en: 'Wednesday', hi: 'बुधवार' },
    element: 'Earth',
  },
  {
    planetId: 4, planetName: { en: 'Jupiter', hi: 'बृहस्पति' },
    mukhi: [5], deity: { en: 'Kalagni Rudra', hi: 'कालाग्नि रुद्र' },
    mantra: 'Om Hreem Namah',
    benefits: { en: 'The most common and auspicious Rudraksha. Enhances wisdom, spirituality, and good fortune. Removes sins, brings prosperity, and strengthens Jupiter\'s blessings. Suitable for everyone as a general-purpose Rudraksha.', hi: 'सबसे सामान्य और शुभ रुद्राक्ष। ज्ञान, आध्यात्मिकता और सौभाग्य बढ़ाता है। पापों का नाश, समृद्धि लाता है। सामान्य प्रयोजन के रुद्राक्ष के रूप में सभी के लिए उपयुक्त।' },
    dayToWear: { en: 'Thursday', hi: 'गुरुवार' },
    element: 'Ether',
  },
  {
    planetId: 5, planetName: { en: 'Venus', hi: 'शुक्र' },
    mukhi: [6], deity: { en: 'Kartikeya', hi: 'कार्तिकेय' },
    mantra: 'Om Hreem Hoom Namah',
    benefits: { en: 'Enhances love, beauty, artistic abilities, and material comforts. Strengthens marital harmony and attraction. Good for those in creative fields, entertainment, and luxury industries.', hi: 'प्रेम, सौन्दर्य, कलात्मक क्षमताएं और भौतिक सुख बढ़ाता है। वैवाहिक सद्भाव सुदृढ़ करता है। रचनात्मक क्षेत्रों, मनोरंजन और विलासिता उद्योग में कार्यरत लोगों के लिए उत्तम।' },
    dayToWear: { en: 'Friday', hi: 'शुक्रवार' },
    element: 'Water',
  },
  {
    planetId: 6, planetName: { en: 'Saturn', hi: 'शनि' },
    mukhi: [7], deity: { en: 'Lakshmi', hi: 'लक्ष्मी' },
    mantra: 'Om Hoom Namah',
    benefits: { en: 'Brings wealth, prosperity, and removes Saturn\'s malefic effects. Essential during Sade Sati or Saturn Dasha. Enhances discipline, patience, and long-term success. Protects from unexpected losses and legal troubles.', hi: 'धन, समृद्धि लाता है और शनि के अशुभ प्रभावों को दूर करता है। साढ़े साती या शनि दशा में आवश्यक। अनुशासन, धैर्य और दीर्घकालीन सफलता बढ़ाता है।' },
    dayToWear: { en: 'Saturday', hi: 'शनिवार' },
    element: 'Air',
  },
  {
    planetId: 7, planetName: { en: 'Rahu', hi: 'राहु' },
    mukhi: [8], deity: { en: 'Ganesha', hi: 'गणेश' },
    mantra: 'Om Hoom Namah',
    benefits: { en: 'Removes Rahu\'s obsessive and deceptive influences. Protects from sudden setbacks, snake fears, and psychic disturbances. Enhances research ability, unconventional thinking, and material success through foreign connections.', hi: 'राहु के जुनूनी और भ्रामक प्रभावों को दूर करता है। अचानक विफलताओं, सर्प भय और मानसिक विक्षोभ से सुरक्षा। अनुसन्धान क्षमता और अपरम्परागत सोच बढ़ाता है।' },
    dayToWear: { en: 'Saturday', hi: 'शनिवार' },
    element: 'Air',
  },
  {
    planetId: 8, planetName: { en: 'Ketu', hi: 'केतु' },
    mukhi: [9], deity: { en: 'Durga', hi: 'दुर्गा' },
    mantra: 'Om Hreem Hoom Namah',
    benefits: { en: 'Removes Ketu\'s detaching and confusing influence. Enhances spiritual insight, past-life wisdom, and moksha. Protects from unknown fears, nightmares, and ghostly disturbances. Grants courage and divine protection.', hi: 'केतु के विलग करने वाले और भ्रमित करने वाले प्रभावों को दूर करता है। आध्यात्मिक अन्तर्दृष्टि, पूर्वजन्म ज्ञान और मोक्ष बढ़ाता है। अज्ञात भय, दुःस्वप्न और प्रेत बाधा से सुरक्षा।' },
    dayToWear: { en: 'Tuesday', hi: 'मंगलवार' },
    element: 'Fire',
  },
];

// Rashi lord mapping (1-based rashi → planet id 0-8)
// Aries=Mars(2), Taurus=Venus(5), Gemini=Mercury(3), Cancer=Moon(1),
// Leo=Sun(0), Virgo=Mercury(3), Libra=Venus(5), Scorpio=Mars(2),
// Sagittarius=Jupiter(4), Capricorn=Saturn(6), Aquarius=Saturn(6), Pisces=Jupiter(4)
const RASHI_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

// Nakshatra lord mapping (1-based nakshatra → planet id)
const NAK_LORD: Record<number, number> = {
  1: 8, 2: 5, 3: 0, 4: 1, 5: 2, 6: 7, 7: 4, 8: 6, 9: 3,
  10: 8, 11: 5, 12: 0, 13: 1, 14: 2, 15: 7, 16: 4, 17: 6, 18: 3,
  19: 8, 20: 5, 21: 0, 22: 1, 23: 2, 24: 7, 25: 4, 26: 6, 27: 3,
};

const LABELS = {
  title: { en: 'Rudraksha Recommendation', hi: 'रुद्राक्ष अनुशंसा' },
  subtitle: { en: 'Find the right Rudraksha based on your birth chart', hi: 'अपनी जन्म कुण्डली के आधार पर सही रुद्राक्ष खोजें' },
  back: { en: 'Tools', hi: 'उपकरण' },
  yourRashi: { en: 'Your Moon Sign (Rashi)', hi: 'आपकी चन्द्र राशि' },
  yourNakshatra: { en: 'Your Birth Nakshatra', hi: 'आपका जन्म नक्षत्र' },
  selectRashi: { en: 'Select your Rashi', hi: 'अपनी राशि चुनें' },
  selectNakshatra: { en: 'Select your Nakshatra', hi: 'अपना नक्षत्र चुनें' },
  primary: { en: 'Primary Recommendation (Lagna/Rashi Lord)', hi: 'प्राथमिक अनुशंसा (लग्न/राशि स्वामी)' },
  secondary: { en: 'Secondary Recommendation (Nakshatra Lord)', hi: 'द्वितीयक अनुशंसा (नक्षत्र स्वामी)' },
  mukhi: { en: 'Mukhi', hi: 'मुखी' },
  deity: { en: 'Deity', hi: 'देवता' },
  mantra: { en: 'Mantra', hi: 'मन्त्र' },
  benefits: { en: 'Benefits', hi: 'लाभ' },
  dayToWear: { en: 'Best Day to Wear', hi: 'धारण का श्रेष्ठ दिन' },
  planet: { en: 'Planet', hi: 'ग्रह' },
  allRudraksha: { en: 'Complete Rudraksha Reference', hi: 'सम्पूर्ण रुद्राक्ष संदर्भ' },
  careTitle: { en: 'How to Wear & Care for Rudraksha', hi: 'रुद्राक्ष कैसे धारण करें और देखभाल' },
  care1: { en: 'Energize (abhimantrit) the Rudraksha before wearing by chanting its specific mantra 108 times on the recommended day.', hi: 'धारण से पहले अनुशंसित दिन पर विशिष्ट मन्त्र 108 बार जपकर रुद्राक्ष को अभिमन्त्रित करें।' },
  care2: { en: 'Wear on a red silk or wool thread, or a gold/silver chain. The bead should touch the skin.', hi: 'लाल रेशम या ऊन के धागे, या सोने/चांदी की चेन में पहनें। मनका त्वचा को छूना चाहिए।' },
  care3: { en: 'Remove before sleeping, bathing, or visiting cremation grounds. Store in a clean puja box.', hi: 'सोते, स्नान करते, या श्मशान जाते समय उतारें। स्वच्छ पूजा बक्से में रखें।' },
  care4: { en: 'Oil the Rudraksha monthly with mustard or olive oil to prevent drying and cracking.', hi: 'सूखने और दरार से बचाने के लिए मासिक रूप से सरसों या जैतून के तेल से रुद्राक्ष में तेल लगाएं।' },
  care5: { en: 'Genuine Rudraksha sinks in water, has natural mukhi lines from top to bottom, and does not have artificial holes.', hi: 'असली रुद्राक्ष पानी में डूबता है, ऊपर से नीचे तक प्राकृतिक मुखी रेखाएं होती हैं, और कृत्रिम छेद नहीं होते।' },
  notSet: { en: 'Select your Rashi and Nakshatra above to get a personalized recommendation, or browse the complete reference below.', hi: 'व्यक्तिगत अनुशंसा हेतु ऊपर अपनी राशि और नक्षत्र चुनें, या नीचे सम्पूर्ण संदर्भ देखें।' },
};

export default function RudrakshaPage() {
  const locale = useLocale() as Locale;
  const isDev = isDevanagariLocale(locale);
  const L = (key: string) => (LABELS as Record<string, Record<string, string>>)[key]?.[locale] || (LABELS as Record<string, Record<string, string>>)[key]?.en || key;

  const { birthRashi, birthNakshatra, isSet, loadFromStorage } = useBirthDataStore();

  const [selectedRashi, setSelectedRashi] = useState(0);
  const [selectedNak, setSelectedNak] = useState(0);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isSet) {
      setSelectedRashi(birthRashi);
      setSelectedNak(birthNakshatra);
    }
  }, [isSet, birthRashi, birthNakshatra]);

  const primaryRudraksha = selectedRashi > 0
    ? RUDRAKSHA_DATA.find(r => r.planetId === RASHI_LORD[selectedRashi])
    : null;
  const secondaryRudraksha = selectedNak > 0
    ? RUDRAKSHA_DATA.find(r => r.planetId === NAK_LORD[selectedNak])
    : null;

  const renderRudrakshaCard = (info: RudrakshaInfo, label: string) => {
    const pName = (info.planetName as Record<string, string>)[locale] || info.planetName.en;
    const deity = (info.deity as Record<string, string>)[locale] || info.deity.en;
    const benefits = (info.benefits as Record<string, string>)[locale] || info.benefits.en;
    const day = (info.dayToWear as Record<string, string>)[locale] || info.dayToWear.en;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] p-6 sm:p-8"
      >
        <h3 className={`text-lg font-bold text-gold-light mb-4 ${isDev ? 'font-devanagari-heading' : ''}`}>{label}</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-gold-light">{info.mukhi.join('/')}</span>
            </div>
            <div>
              <p className="text-gold-light font-semibold text-lg">{info.mukhi.map(m => `${m} ${L('mukhi')}`).join(' / ')}</p>
              <p className="text-text-secondary text-sm">{L('planet')}: {pName}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div>
              <span className="text-text-secondary text-xs uppercase">{L('deity')}</span>
              <p className="text-text-primary">{deity}</p>
            </div>
            <div>
              <span className="text-text-secondary text-xs uppercase">{L('mantra')}</span>
              <p className="text-gold-primary font-mono text-sm">{info.mantra}</p>
            </div>
            <div>
              <span className="text-text-secondary text-xs uppercase">{L('dayToWear')}</span>
              <p className="text-text-primary">{day}</p>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-text-secondary text-xs uppercase">{L('benefits')}</span>
            <p className="text-text-primary leading-relaxed mt-1">{benefits}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <main className="min-h-screen bg-bg-primary pt-24 pb-16">
      {safeJsonLd(generateBreadcrumbLD(`/${locale}/rudraksha`, locale))}

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/tools" className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-light transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>{L('back')}</span>
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <Gem className="w-8 h-8 text-gold-primary" />
            <h1 className={`text-3xl sm:text-4xl font-bold text-gold-light ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('title')}
            </h1>
          </div>
          <p className="text-text-secondary max-w-2xl mx-auto">{L('subtitle')}</p>
        </motion.div>

        <GoldDivider className="mb-10" />

        {/* Input selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
          <div>
            <label className="block text-text-secondary text-sm mb-2">{L('yourRashi')}</label>
            <select
              value={selectedRashi}
              onChange={(e) => setSelectedRashi(parseInt(e.target.value, 10))}
              className="w-full rounded-xl bg-bg-secondary border border-gold-primary/20 text-text-primary px-4 py-3 focus:border-gold-primary/50 focus:outline-none transition-colors"
            >
              <option value={0}>{L('selectRashi')}</option>
              {RASHIS.map(r => (
                <option key={r.id} value={r.id}>{tl(r.name, locale)} ({r.name.en})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-text-secondary text-sm mb-2">{L('yourNakshatra')}</label>
            <select
              value={selectedNak}
              onChange={(e) => setSelectedNak(parseInt(e.target.value, 10))}
              className="w-full rounded-xl bg-bg-secondary border border-gold-primary/20 text-text-primary px-4 py-3 focus:border-gold-primary/50 focus:outline-none transition-colors"
            >
              <option value={0}>{L('selectNakshatra')}</option>
              {NAKSHATRAS.map(n => (
                <option key={n.id} value={n.id}>{tl(n.name, locale)} ({n.name.en})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Recommendations */}
        {(primaryRudraksha || secondaryRudraksha) ? (
          <div className="space-y-6 mb-12">
            {primaryRudraksha && renderRudrakshaCard(primaryRudraksha, L('primary'))}
            {secondaryRudraksha && secondaryRudraksha.planetId !== primaryRudraksha?.planetId && (
              renderRudrakshaCard(secondaryRudraksha, L('secondary'))
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-text-secondary mb-10">
            <Info className="w-6 h-6 mx-auto mb-2 text-gold-primary/50" />
            <p>{L('notSet')}</p>
          </div>
        )}

        <GoldDivider className="mb-10" />

        {/* Full reference table */}
        <h2 className={`text-2xl font-bold text-gold-light mb-6 ${isDev ? 'font-devanagari-heading' : ''}`}>
          {L('allRudraksha')}
        </h2>
        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/20">
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">{L('mukhi')}</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">{L('planet')}</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">{L('deity')}</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">{L('mantra')}</th>
                  <th className="text-left px-4 py-3 text-text-secondary font-medium">{L('dayToWear')}</th>
                </tr>
              </thead>
              <tbody>
                {RUDRAKSHA_DATA.map((r) => (
                  <tr key={r.planetId} className="border-b border-gold-primary/8 last:border-b-0 hover:bg-gold-primary/5 transition-colors">
                    <td className="px-4 py-3 text-gold-light font-bold">{r.mukhi.join(' / ')}</td>
                    <td className="px-4 py-3 text-text-primary">{(r.planetName as Record<string, string>)[locale] || r.planetName.en}</td>
                    <td className="px-4 py-3 text-text-primary">{(r.deity as Record<string, string>)[locale] || r.deity.en}</td>
                    <td className="px-4 py-3 text-gold-primary font-mono text-xs">{r.mantra}</td>
                    <td className="px-4 py-3 text-text-secondary">{(r.dayToWear as Record<string, string>)[locale] || r.dayToWear.en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Care instructions */}
        <h2 className={`text-2xl font-bold text-gold-light mb-4 ${isDev ? 'font-devanagari-heading' : ''}`}>
          {L('careTitle')}
        </h2>
        <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 mb-10">
          <ul className="space-y-3">
            {['care1', 'care2', 'care3', 'care4', 'care5'].map(k => (
              <li key={k} className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-gold-primary mt-1 flex-shrink-0" />
                <span className="text-text-primary leading-relaxed">{L(k)}</span>
              </li>
            ))}
          </ul>
        </div>

        <GoldDivider className="my-12" />
        <AuthorByline />
      </div>
    </main>
  );
}

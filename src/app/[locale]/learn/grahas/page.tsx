'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { GRAHAS } from '@/lib/constants/grahas';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const PLANET_DETAILS: Record<number, { orbit: string; dignity: { en: string; hi: string; sa: string }; signifies: { en: string; hi: string; sa: string }; dashaYears: number }> = {
  0: { orbit: '1 year', dignity: { en: 'Exalted in Aries, Debilitated in Libra', hi: 'मेष में उच्च, तुला में नीच', sa: 'मेषे उच्चः, तुलायां नीचः' }, signifies: { en: 'Soul, authority, father, government, health, vitality, gold', hi: 'आत्मा, अधिकार, पिता, सरकार, स्वास्थ्य, जीवन शक्ति', sa: 'आत्मा, अधिकारः, पिता, राज्यं, आरोग्यं, जीवनशक्तिः' }, dashaYears: 6 },
  1: { orbit: '27.3 days', dignity: { en: 'Exalted in Taurus, Debilitated in Scorpio', hi: 'वृषभ में उच्च, वृश्चिक में नीच', sa: 'वृषभे उच्चः, वृश्चिके नीचः' }, signifies: { en: 'Mind, emotions, mother, public, liquids, travel, silver', hi: 'मन, भावनाएँ, माता, जनता, तरल पदार्थ, यात्रा', sa: 'मनः, भावाः, माता, जनता, द्रवपदार्थाः, यात्रा' }, dashaYears: 10 },
  2: { orbit: '1.88 years', dignity: { en: 'Exalted in Capricorn, Debilitated in Cancer', hi: 'मकर में उच्च, कर्क में नीच', sa: 'मकरे उच्चः, कर्कटे नीचः' }, signifies: { en: 'Energy, courage, siblings, property, surgery, military, copper', hi: 'ऊर्जा, साहस, भाई-बहन, सम्पत्ति, शल्य चिकित्सा', sa: 'ऊर्जा, शौर्यं, भ्रातरः, सम्पत्तिः, शल्यचिकित्सा' }, dashaYears: 7 },
  3: { orbit: '88 days', dignity: { en: 'Exalted in Virgo, Debilitated in Pisces', hi: 'कन्या में उच्च, मीन में नीच', sa: 'कन्यायाम् उच्चः, मीने नीचः' }, signifies: { en: 'Intelligence, speech, trade, writing, mathematics, friends, green', hi: 'बुद्धि, वाणी, व्यापार, लेखन, गणित, मित्र', sa: 'बुद्धिः, वाक्, वाणिज्यं, लेखनं, गणितं, मित्राणि' }, dashaYears: 17 },
  4: { orbit: '11.86 years', dignity: { en: 'Exalted in Cancer, Debilitated in Capricorn', hi: 'कर्क में उच्च, मकर में नीच', sa: 'कर्कटे उच्चः, मकरे नीचः' }, signifies: { en: 'Wisdom, fortune, children, dharma, guru, expansion, gold', hi: 'ज्ञान, भाग्य, सन्तान, धर्म, गुरु, विस्तार', sa: 'ज्ञानं, भाग्यं, सन्तानाः, धर्मः, गुरुः, विस्तारः' }, dashaYears: 16 },
  5: { orbit: '225 days', dignity: { en: 'Exalted in Pisces, Debilitated in Virgo', hi: 'मीन में उच्च, कन्या में नीच', sa: 'मीने उच्चः, कन्यायां नीचः' }, signifies: { en: 'Love, beauty, luxury, art, spouse, vehicles, diamonds', hi: 'प्रेम, सौन्दर्य, विलासिता, कला, जीवनसाथी, वाहन', sa: 'प्रेम, सौन्दर्यं, विलासः, कला, पत्नी, वाहनानि' }, dashaYears: 20 },
  6: { orbit: '29.46 years', dignity: { en: 'Exalted in Libra, Debilitated in Aries', hi: 'तुला में उच्च, मेष में नीच', sa: 'तुलायाम् उच्चः, मेषे नीचः' }, signifies: { en: 'Discipline, karma, longevity, delays, servants, iron, blue sapphire', hi: 'अनुशासन, कर्म, दीर्घायु, विलम्ब, सेवक', sa: 'अनुशासनं, कर्म, दीर्घायुः, विलम्बः, सेवकाः' }, dashaYears: 19 },
  7: { orbit: '18.6 years', dignity: { en: 'Strong in Taurus/Gemini/Virgo/Aquarius', hi: 'वृषभ/मिथुन/कन्या/कुम्भ में बलवान', sa: 'वृषभ/मिथुन/कन्या/कुम्भराशिषु बलवान्' }, signifies: { en: 'Obsession, foreign, unconventional, sudden gains, illusion, hessonite', hi: 'आसक्ति, विदेश, अपारम्परिक, आकस्मिक लाभ', sa: 'आसक्तिः, विदेशः, अपारम्परिकं, आकस्मिकलाभः' }, dashaYears: 18 },
  8: { orbit: '18.6 years', dignity: { en: 'Strong in Scorpio/Sagittarius/Pisces', hi: 'वृश्चिक/धनु/मीन में बलवान', sa: 'वृश्चिक/धनु/मीनराशिषु बलवान्' }, signifies: { en: 'Detachment, moksha, past karma, spiritual insight, cat\'s eye', hi: 'वैराग्य, मोक्ष, पूर्व कर्म, आध्यात्मिक अन्तर्दृष्टि', sa: 'वैराग्यं, मोक्षः, पूर्वकर्म, आध्यात्मिकदृष्टिः' }, dashaYears: 7 },
};

export default function LearnGrahasPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('grahasTitle')}
        </h2>
        <p className="text-text-secondary">{t('grahasSubtitle')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <SanskritTermCard term="Graha" devanagari="ग्रह" transliteration="Graha" meaning="That which grasps" />
        <SanskritTermCard term="Uccha" devanagari="उच्च" transliteration="Ucca" meaning="Exalted (strongest)" />
        <SanskritTermCard term="Neecha" devanagari="नीच" transliteration="Nīca" meaning="Debilitated (weakest)" />
        <SanskritTermCard term="Vakri" devanagari="वक्री" transliteration="Vakrī" meaning="Retrograde" />
        <SanskritTermCard term="Asta" devanagari="अस्त" transliteration="Asta" meaning="Combust (near Sun)" />
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('grahasWhat')}</p>
      </LessonSection>

      <LessonSection title={t('theAstronomy')}>
        <p>{t('grahasAstronomy')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-1">
            {locale === 'en' ? 'Natural Benefics: Jupiter, Venus, Moon (waxing), Mercury (unafflicted)' : 'नैसर्गिक शुभ: गुरु, शुक्र, चन्द्र (शुक्ल), बुध (अपीड़ित)'}
          </p>
          <p className="text-gold-light font-mono text-sm">
            {locale === 'en' ? 'Natural Malefics: Sun, Mars, Saturn, Rahu, Ketu, Moon (waning)' : 'नैसर्गिक पाप: सूर्य, मंगल, शनि, राहु, केतु, चन्द्र (कृष्ण)'}
          </p>
        </div>
      </LessonSection>

      <LessonSection title={locale === 'en' ? 'Planetary Friendships' : 'ग्रह मित्रता'}>
        <p>
          {locale === 'en'
            ? 'Each planet has natural friends, enemies, and neutrals. This relationship affects a planet\'s strength when placed in another planet\'s sign. For example, Moon in Jupiter\'s sign (Cancer is Moon\'s own, but Sagittarius/Pisces belong to friend Jupiter) is comfortable. Moon in Saturn\'s sign (Capricorn/Aquarius) is in enemy territory. These friendships also determine the Graha Maitri score in Kundali matching.'
            : 'प्रत्येक ग्रह के स्वाभाविक मित्र, शत्रु और सम होते हैं। यह सम्बन्ध ग्रह की शक्ति को प्रभावित करता है जब वह दूसरे ग्रह की राशि में स्थित होता है।'}
        </p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10 text-xs">
          <div className="grid grid-cols-3 gap-2 text-gold-light/80 font-mono">
            <div className="font-semibold text-gold-primary">{locale === 'en' ? 'Planet' : 'ग्रह'}</div>
            <div className="font-semibold text-emerald-400">{locale === 'en' ? 'Friends' : 'मित्र'}</div>
            <div className="font-semibold text-red-400">{locale === 'en' ? 'Enemies' : 'शत्रु'}</div>
            <div>Sun</div><div>Moon, Mars, Jupiter</div><div>Venus, Saturn</div>
            <div>Moon</div><div>Sun, Mercury</div><div>None</div>
            <div>Mars</div><div>Sun, Moon, Jupiter</div><div>Mercury</div>
            <div>Mercury</div><div>Sun, Venus</div><div>Moon</div>
            <div>Jupiter</div><div>Sun, Moon, Mars</div><div>Mercury, Venus</div>
            <div>Venus</div><div>Mercury, Saturn</div><div>Sun, Moon</div>
            <div>Saturn</div><div>Mercury, Venus</div><div>Sun, Moon, Mars</div>
          </div>
        </div>
      </LessonSection>

      <LessonSection title={t('completeList')}>
        <div className="space-y-4">
          {GRAHAS.map((g, i) => {
            const details = PLANET_DETAILS[g.id];
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-lg p-4 border border-gold-primary/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl" style={{ color: g.color }}>{g.symbol}</span>
                  <div className="flex-1">
                    <div className="text-gold-light font-semibold">{g.name[locale]}</div>
                    {locale !== 'en' && <div className="text-text-secondary/60 text-xs">{g.name.en}</div>}
                  </div>
                  <div className="text-right">
                    <span className="text-text-secondary/50 text-xs font-mono">{details.orbit}</span>
                    <div className="text-gold-primary/70 text-xs">{details.dashaYears} yr Dasha</div>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mb-2">{details.signifies[locale]}</p>
                <p className="text-text-secondary/60 text-xs italic">{details.dignity[locale]}</p>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      <LessonSection title={t('significanceSection')} variant="highlight">
        <p>
          {locale === 'en'
            ? 'The Navagraha form the foundation of all Jyotish analysis. In a Kundali (birth chart), each Graha occupies a specific Rashi and Nakshatra, creating a unique celestial fingerprint for the moment of birth. The Vimshottari Dasha system uses the Moon\'s Nakshatra lord to unfold a 120-year predictive timeline. The Grahas are not merely astronomical objects — they represent cosmic forces that influence human life according to Vedic tradition.'
            : locale === 'hi'
            ? 'नवग्रह समस्त ज्योतिष विश्लेषण का आधार हैं। कुण्डली में प्रत्येक ग्रह विशिष्ट राशि और नक्षत्र में स्थित होता है, जन्म क्षण की एक अद्वितीय खगोलीय छाप बनाता है। विंशोत्तरी दशा प्रणाली चन्द्र के नक्षत्र स्वामी से 120 वर्ष की भविष्यवाणी समयरेखा प्रस्तुत करती है।'
            : 'नवग्रहाः समस्तज्योतिषविश्लेषणस्य आधारः। कुण्डल्यां प्रत्येकः ग्रहः विशिष्टराश्यां नक्षत्रे च स्थितः, जन्मक्षणस्य अद्वितीयां खगोलीयछापं रचयति।'}
        </p>
        <div className="mt-4 text-center">
          <Link
            href="/panchang"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
          >
            {t('tryIt')}
          </Link>
        </div>
      </LessonSection>
    </div>
  );
}

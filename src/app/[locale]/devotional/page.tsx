'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import type { Locale,  LocaleText} from '@/types/panchang';
import { dateToJD, calculateTithi, moonLongitude, toSidereal, getNakshatraNumber } from '@/lib/ephem/astronomical';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import MSG from '@/messages/pages/devotional.json';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import TarotCard from '@/components/ui/TarotCard';

const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

interface Recommendation {
  title: LocaleText;
  mantra: string;
  deity: LocaleText;
  description: LocaleText;
}

// Day-of-week deity associations
const VARA_DEITIES: Record<number, { deity: LocaleText; mantra: string; color: string }> = {
  0: { deity: { en: 'Surya (Sun)', hi: 'सूर्य', sa: 'सूर्यः' }, mantra: 'ॐ सूर्याय नमः', color: '#e67e22' },
  1: { deity: { en: 'Chandra (Moon)', hi: 'चन्द्रमा', sa: 'चन्द्रः' }, mantra: 'ॐ सोमाय नमः', color: '#ecf0f1' },
  2: { deity: { en: 'Mangal (Mars)/Hanuman', hi: 'मंगल/हनुमान', sa: 'मङ्गलः/हनुमान्' }, mantra: 'ॐ हनुमते नमः', color: '#e74c3c' },
  3: { deity: { en: 'Budh (Mercury)/Vishnu', hi: 'बुध/विष्णु', sa: 'बुधः/विष्णुः' }, mantra: 'ॐ विष्णवे नमः', color: '#2ecc71' },
  4: { deity: { en: 'Guru (Jupiter)/Brihaspati', hi: 'बृहस्पति/गुरु', sa: 'बृहस्पतिः/गुरुः' }, mantra: 'ॐ बृहस्पतये नमः', color: '#f39c12' },
  5: { deity: { en: 'Shukra (Venus)/Lakshmi', hi: 'शुक्र/लक्ष्मी', sa: 'शुक्रः/लक्ष्मीः' }, mantra: 'ॐ शुक्राय नमः', color: '#e8e6e3' },
  6: { deity: { en: 'Shani (Saturn)', hi: 'शनि', sa: 'शनिः' }, mantra: 'ॐ शनैश्चराय नमः', color: '#3498db' },
};

// Planet glow colours keyed by weekday (0=Sun … 6=Sat)
const VARA_GLOW: Record<number, string> = {
  0: '#e67e22',
  1: '#c0c0c0',
  2: '#e74c3c',
  3: '#2ecc71',
  4: '#f1c40f',
  5: '#e91e9f',
  6: '#7f8c8d',
};

// Tithi-based suggestions
const TITHI_SUGGESTIONS: Record<number, LocaleText> = {
  1: { en: 'Pratipada — Worship Agni. Good for new beginnings.', hi: 'प्रतिपदा — अग्नि पूजा। नई शुरुआत के लिए शुभ।', sa: 'प्रतिपदा — अग्निपूजा। नवारम्भाय शुभम्।' },
  4: { en: 'Chaturthi — Worship Ganesha. Vinayaka Chaturthi day.', hi: 'चतुर्थी — गणेश पूजा। विनायक चतुर्थी दिन।', sa: 'चतुर्थी — गणेशपूजा। विनायकचतुर्थीदिनम्।' },
  8: { en: 'Ashtami — Worship Durga/Krishna. Sacred fasting day.', hi: 'अष्टमी — दुर्गा/कृष्ण पूजा। पवित्र उपवास दिन।', sa: 'अष्टमी — दुर्गा/कृष्णपूजा। पवित्रोपवासदिनम्।' },
  11: { en: 'Ekadashi — Worship Vishnu. Observe Ekadashi Vrat.', hi: 'एकादशी — विष्णु पूजा। एकादशी व्रत रखें।', sa: 'एकादशी — विष्णुपूजा। एकादशीव्रतं पालयेत्।' },
  14: { en: 'Chaturdashi — Worship Shiva. Pradosham observance.', hi: 'चतुर्दशी — शिव पूजा। प्रदोषम् व्रत।', sa: 'चतुर्दशी — शिवपूजा। प्रदोषव्रतम्।' },
  15: { en: 'Purnima — Full Moon worship. Sacred bathing day.', hi: 'पूर्णिमा — पूर्ण चन्द्र पूजा। पवित्र स्नान दिवस।', sa: 'पूर्णिमा — पूर्णचन्द्रपूजा। पवित्रस्नानदिवसः।' },
  30: { en: 'Amavasya — Worship ancestors (Pitris). Tarpana day.', hi: 'अमावस्या — पितरों की पूजा। तर्पण दिवस।', sa: 'अमावस्या — पितृपूजा। तर्पणदिवसः।' },
};

const UNIVERSAL_MANTRAS = [
  { name: { en: 'Gayatri Mantra', hi: 'गायत्री मन्त्र', sa: 'गायत्रीमन्त्रः' }, text: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्' },
  { name: { en: 'Mahamrityunjaya Mantra', hi: 'महामृत्युञ्जय मन्त्र', sa: 'महामृत्युञ्जयमन्त्रः' }, text: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्' },
  { name: { en: 'Shanti Mantra', hi: 'शान्ति मन्त्र', sa: 'शान्तिमन्त्रः' }, text: 'ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद् दुःखभाग्भवेत्॥' },
];

export default function DevotionalPage() {
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const today = useMemo(() => {
    const now = new Date();
    const weekday = now.getDay();
    const jd = dateToJD(now.getFullYear(), now.getMonth() + 1, now.getDate(), 0.5);
    const tithi = calculateTithi(jd);
    const moonSid = toSidereal(moonLongitude(jd), jd);
    const nakshatra = getNakshatraNumber(moonSid);

    return { weekday, tithi: tithi.number, nakshatra };
  }, []);

  const varaDeity = VARA_DEITIES[today.weekday];
  const tithiSuggestion = TITHI_SUGGESTIONS[today.tithi] || null;

  // Planet ID mapping for day: Sun=0, Moon=1, Mars=2, Merc=3, Jup=4, Ven=5, Sat=6
  const dayPlanetId = [0, 1, 2, 3, 4, 5, 6][today.weekday];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{isTamil ? 'தினசரி பக்தி வழிகாட்டி' : locale === 'en' ? 'Daily Devotional Guide' : 'दैनिक भक्ति मार्गदर्शिका'}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'Mantras, deity worship, and spiritual practices based on today\'s Vara, Tithi, and Nakshatra'
            : 'आज के वार, तिथि और नक्षत्र के अनुसार मन्त्र, देवता पूजा और आध्यात्मिक साधना'}
        </p>
      </motion.div>

      {/* Today's deity */}
      <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-8 mb-8 text-center">
        <GrahaIconById id={dayPlanetId} size={64} />
        <h2 className="text-gold-light text-3xl font-bold mt-4" style={headingFont}>
          {tl(varaDeity.deity, locale)}
        </h2>
        <div className="text-amber-300 text-xl font-bold mt-3 py-3 px-6 bg-gold-primary/10 rounded-xl inline-block" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>
          {varaDeity.mantra}
        </div>
        <p className="text-text-secondary text-sm mt-3">
          {msg('todaysDeityMantra', locale)}
        </p>
      </div>

      {/* Tithi suggestion */}
      {tithiSuggestion && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 mb-6">
          <div className="text-amber-400 text-xs uppercase tracking-wider font-bold mb-2">
            {msg('tithiSignificance', locale)}
          </div>
          <p className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {tl(tithiSuggestion, locale)}
          </p>
        </div>
      )}

      {/* Nakshatra info */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3">
          <NakshatraIconById id={today.nakshatra} size={36} />
          <div>
            <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1">
              {msg('todaysNakshatra', locale)}
            </div>
            <div className="text-gold-light text-sm font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
              {tl(NAKSHATRAS[today.nakshatra - 1]?.name, locale) ?? `Nakshatra ${today.nakshatra}`}
            </div>
          </div>
        </div>
      </div>

      <GoldDivider />

      {/* Universal mantras */}
      <div className="my-10">
        <h3 className="text-gold-gradient text-2xl font-bold mb-6 text-center" style={headingFont}>
          {msg('universalMantras', locale)}
        </h3>
        <div className="space-y-4">
          {UNIVERSAL_MANTRAS.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6"
            >
              <h4 className="text-gold-light text-lg font-bold mb-3" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                {tl(m.name, locale)}
              </h4>
              <div className="text-gold-primary text-lg leading-relaxed p-4 bg-gold-primary/5 rounded-lg border border-gold-primary/10" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly guide */}
      <div className="my-10">
        <h3 className="text-gold-gradient text-2xl font-bold mb-6 text-center" style={headingFont}>
          {msg('weeklyWorshipGuide', locale)}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          {Object.entries(VARA_DEITIES).map(([day, info]) => {
            const dayNum = parseInt(day);
            const dayNames: Record<number, LocaleText> = {
              0: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः', mai: 'रविदिन', mr: 'रविवार', ta: 'ஞாயிறு', te: 'ఆదివారం', bn: 'রবিবার', kn: 'ಭಾನುವಾರ', gu: 'રવિવાર' }, 1: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः', mai: 'सोमदिन', mr: 'सोमवार', ta: 'திங்கள்', te: 'సోమవారం', bn: 'সোমবার', kn: 'ಸೋಮವಾರ', gu: 'સોમવાર' },
              2: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः', mai: 'मंगलदिन', mr: 'मंगळवार', ta: 'செவ்வாய்', te: 'మంగళవారం', bn: 'মঙ্গলবার', kn: 'ಮಂಗಳವಾರ', gu: 'મંગળવાર' }, 3: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः', mai: 'बुधदिन', mr: 'बुधवार', ta: 'புதன்', te: 'బుధవారం', bn: 'বুধবার', kn: 'ಬುಧವಾರ', gu: 'બુધવાર' },
              4: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः', mai: 'बृहस्पतिदिन', mr: 'गुरुवार', ta: 'வியாழன்', te: 'గురువారం', bn: 'বৃহস্পতিবার', kn: 'ಗುರುವಾರ', gu: 'ગુરુવાર' }, 5: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः', mai: 'शुक्रदिन', mr: 'शुक्रवार', ta: 'வெள்ளி', te: 'శుక్రవారం', bn: 'শুক্রবার', kn: 'ಶುಕ್ರವಾರ', gu: 'શુક્રવાર' },
              6: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः', mai: 'शनिदिन', mr: 'शनिवार', ta: 'சனி', te: 'శనివారం', bn: 'শনিবার', kn: 'ಶನಿವಾರ', gu: 'શનિવાર' },
            };
            const isToday = dayNum === today.weekday;

            const todayBadge = isToday ? msg('today', locale) : undefined;

            return (
              <TarotCard
                key={day}
                size="full"
                icon={<GrahaIconById id={dayNum} size={96} />}
                subtitle={tl(info.deity, locale)}
                title={tl(dayNames[dayNum], locale)}
                description={todayBadge}
                glowColor={isToday ? '#f0d48a' : (VARA_GLOW[dayNum] ?? '#d4a853')}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

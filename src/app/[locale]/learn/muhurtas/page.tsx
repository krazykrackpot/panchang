'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { MUHURTA_DATA } from '@/lib/constants/muhurtas';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ChevronDown } from 'lucide-react';

const L = {
  abhijitTitle: { en: 'Abhijit Muhurta — The Universally Auspicious Midday', hi: 'अभिजित् मुहूर्त — सार्वभौमिक शुभ मध्याह्न', sa: 'अभिजिन्मुहूर्तः — सार्वभौमशुभमध्याह्नः', ta: 'அபிஜித் முகூர்த்தம் — உலகளாவிய சுப மதியம்' },
  abhijitContent: {
    en: 'Abhijit Muhurta is the 8th daytime muhurta, spanning roughly 24 minutes before to 24 minutes after local noon (when the Sun crosses the meridian). It is considered universally auspicious for ALL activities — even those normally requiring specific nakshatras or tithis. Lord Vishnu presides over this period. The name "Abhijit" means "victorious" — any task begun in this window carries the energy of success. However, Abhijit Muhurta is NOT used on Wednesdays (Budhvar), when its auspiciousness is considered nullified.',
    hi: 'अभिजित् मुहूर्त 8वाँ दिवा मुहूर्त है, जो स्थानीय मध्याह्न से लगभग 24 मिनट पहले से 24 मिनट बाद तक फैला है। यह सभी कार्यों के लिए सार्वभौमिक रूप से शुभ माना जाता है। भगवान विष्णु इस काल के अधिपति हैं। "अभिजित्" का अर्थ है "विजयी"। हालाँकि, बुधवार को अभिजित् मुहूर्त का उपयोग नहीं किया जाता।',
    sa: 'अभिजिन्मुहूर्तः अष्टमो दिवामुहूर्तः, स्थानीयमध्याह्नात् प्राक् पश्चाच्च प्रायः चतुर्विंशतिनिमेषान् व्याप्नोति। सर्वकार्येषु सार्वभौमशुभत्वेन मन्यते।'
  },
  brahmaTitle: { en: 'Brahma Muhurta — The Pre-Dawn Spiritual Window', hi: 'ब्रह्म मुहूर्त — प्रभात-पूर्व आध्यात्मिक काल', sa: 'ब्रह्ममुहूर्तः — प्रभातपूर्वाध्यात्मिककालः' },
  brahmaContent: {
    en: 'Brahma Muhurta comprises the 26th and 27th muhurtas of the night cycle — approximately 1 hour 36 minutes before sunrise. This is considered the most sacred time for spiritual practice, meditation, mantra japa, and study of sacred texts. The atmosphere is sattvic (pure) — the air is fresh, the mind is naturally calm after sleep, and cosmic energy (prana) is at its peak. The Ashtanga Hridayam (Ayurvedic text) prescribes waking during Brahma Muhurta for optimal health. Yogis, sadhus, and serious spiritual practitioners across India rise during this period. The name connects to Lord Brahma, the creator — signifying that this is the time to create your day through intention and practice.',
    hi: 'ब्रह्म मुहूर्त रात्रि चक्र के 26वें और 27वें मुहूर्त हैं — सूर्योदय से लगभग 1 घंटा 36 मिनट पहले। यह आध्यात्मिक साधना, ध्यान, मन्त्र जप और शास्त्र अध्ययन के लिए सबसे पवित्र समय माना जाता है। वातावरण सात्विक होता है — वायु स्वच्छ है, मन निद्रा के बाद स्वाभाविक रूप से शान्त है, और प्राण ऊर्जा अपने शिखर पर है।',
    sa: 'ब्रह्ममुहूर्तः रात्रिचक्रस्य षड्विंशसप्तविंशमुहूर्तौ — सूर्योदयात् प्राक् प्रायः षण्णवतिनिमेषाः। आध्यात्मिकसाधनायै ध्यानाय मन्त्रजपाय शास्त्राध्ययनाय च पवित्रतमः कालः मन्यते।'
  },
  rahuKaalTitle: { en: 'Rahu Kaal, Yamaganda & Gulika Kaal', hi: 'राहु काल, यमगण्ड और गुलिक काल', sa: 'राहुकालः, यमगण्डः, गुलिककालश्च' },
  rahuKaalContent: {
    en: 'These three inauspicious time segments recur daily and must be avoided for starting new ventures. Rahu Kaal is the most widely observed — a ~90-minute window ruled by Rahu (the north lunar node), associated with obstacles and unexpected problems. The day is divided into 8 equal parts from sunrise to sunset; Rahu Kaal occupies a different segment each weekday: Monday=2nd, Saturday=3rd, Friday=4th, Wednesday=5th, Thursday=6th, Tuesday=7th, Sunday=8th (remembered by the mnemonic "Ma Sha Fri We Th Tu Su" or "Mother Saw Father Wearing The Turban Slowly"). Yamaganda is ruled by Yama (lord of death) — inauspicious for travel and health matters. Gulika Kaal is ruled by Saturn\'s son Gulika (Mandi) — inauspicious for auspicious ceremonies. Each occupies one-eighth of the daytime, following fixed weekday patterns.',
    hi: 'ये तीन अशुभ समय खण्ड प्रतिदिन आते हैं और नए कार्य आरम्भ करने से बचना चाहिए। राहु काल सबसे अधिक पालन किया जाता है — राहु द्वारा शासित ~90 मिनट की अवधि। दिन को सूर्योदय से सूर्यास्त तक 8 बराबर भागों में बाँटा जाता है; राहु काल प्रत्येक सप्ताह के दिन अलग भाग में होता है। यमगण्ड यम द्वारा शासित है। गुलिक काल शनि के पुत्र गुलिक (मान्दि) द्वारा शासित है।',
    sa: 'एते त्रयः अशुभकालखण्डाः प्रतिदिनं भवन्ति नूतनकार्यारम्भे वर्जनीयाः। राहुकालः राहुशासितः ~नवतिनिमेषकालखण्डः।'
  },
  choghadiyaTitle: { en: 'Choghadiya System — 8 Segments Per Half-Day', hi: 'चौघड़िया प्रणाली — प्रत्येक अर्ध-दिवस के 8 खण्ड', sa: 'चौघड़ियापद्धतिः — प्रत्येकार्धदिवसस्य ८ खण्डाः' },
  choghadiyaContent: {
    en: 'Choghadiya (literally "four ghatikas" = ~96 minutes at equinox) divides the day and night each into 8 segments. Seven types cycle in a fixed order: Udveg (Sun — anxiety), Char (Moon — travel), Labh (Mercury — gain), Amrit (Jupiter — excellent), Kaal (Saturn — death), Shubh (Venus — auspicious), Rog (Mars — disease). The 8th slot repeats the first type. Each weekday starts the cycle from a different Choghadiya. For quick daily timing: Amrit (best), Shubh and Labh (good), Char (acceptable for travel), Udveg/Kaal/Rog (avoid). Choghadiya is especially popular in Gujarat and western India for business timing.',
    hi: 'चौघड़िया (शाब्दिक "चार घटिका" = विषुव पर ~96 मिनट) दिन और रात को प्रत्येक 8 खण्डों में बाँटता है। सात प्रकार एक निश्चित क्रम में चक्रित होते हैं: उद्वेग (सूर्य), चर (चन्द्र), लाभ (बुध), अमृत (गुरु), काल (शनि), शुभ (शुक्र), रोग (मंगल)। त्वरित दैनिक समय निर्णय के लिए: अमृत (सर्वोत्तम), शुभ और लाभ (अच्छा), चर (यात्रा के लिए स्वीकार्य)।',
    sa: 'चौघड़िया दिवारात्रे प्रत्येकम् ८ खण्डेषु विभजति। सप्त प्रकाराः निश्चितक्रमेण चक्रन्ते।'
  },
  horaTitle: { en: 'Hora System — Planetary Hours', hi: 'होरा प्रणाली — ग्रह होरा', sa: 'होरापद्धतिः — ग्रहहोराः' },
  horaContent: {
    en: 'The Hora system divides each day and night into 12 planetary hours each (24 total), ruled in the Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon (descending orbital period). The first hora of each day is ruled by that day\'s lord — Sunday starts with Sun hora, Monday with Moon hora, and so on. This is actually how the weekdays got their names! Each activity has a preferred hora: Sun hora for government matters, Moon hora for travel and public dealings, Mars hora for surgery and courage, Mercury hora for trade and communication, Jupiter hora for religious acts and education, Venus hora for marriage and arts, Saturn hora for labor and property matters.',
    hi: 'होरा प्रणाली प्रत्येक दिन और रात को 12-12 ग्रह होराओं में बाँटती है (कुल 24), कल्डियन क्रम में शासित: शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चन्द्र। प्रत्येक दिन की पहली होरा उस दिन के स्वामी द्वारा शासित होती है। प्रत्येक कार्य की एक पसन्दीदा होरा होती है: सूर्य होरा — सरकारी कार्य, चन्द्र होरा — यात्रा, मंगल होरा — शल्य चिकित्सा, बुध होरा — व्यापार, गुरु होरा — धार्मिक कार्य, शुक्र होरा — विवाह, शनि होरा — भूमि कार्य।',
    sa: 'होरापद्धतिः प्रत्येकदिवारात्रे द्वादश-द्वादशग्रहहोरासु विभजति (चतुर्विंशतिः सर्वे)।'
  },
  selectingTitle: { en: 'How to Select the Best Time for an Activity', hi: 'किसी कार्य के लिए सर्वोत्तम समय कैसे चुनें', sa: 'कार्याय उत्तमसमयः कथं चीयते' },
  selectingContent: {
    en: 'Muhurta selection is a layered process. Start with the broadest filter and narrow down: (1) Month/Season — some months are universally inauspicious (Adhika Masa, certain solar months). Avoid eclipses. (2) Tithi — each activity has preferred tithis (e.g., Dwithiya, Thrithiya, Panchami for marriage). Avoid Rikta tithis (4th, 9th, 14th) for auspicious work. (3) Nakshatra — Fixed nakshatras for foundations, Movable for travel, etc. (4) Yoga — avoid Vyatipata and Vaidhriti. (5) Weekday — match the planet ruling the activity. (6) Avoid Rahu Kaal, Yamaganda, Gulika Kaal. (7) Check Choghadiya/Hora for fine-tuning. (8) Advanced: verify Chandra Balam (Moon\'s strength relative to natal Moon), Tara Balam (nakshatra compatibility), and Lagna Shuddhi (ascendant purity). Our Muhurta AI tool automates this entire multi-factor process, scoring time windows on 15+ parameters simultaneously.',
    hi: 'मुहूर्त चयन एक स्तरित प्रक्रिया है। सबसे व्यापक फ़िल्टर से शुरू करें: (1) मास/ऋतु — कुछ मास सार्वभौमिक अशुभ हैं। ग्रहण से बचें। (2) तिथि — प्रत्येक कार्य की पसन्दीदा तिथियाँ हैं। (3) नक्षत्र — स्थिर नक्षत्र नींव के लिए, चर यात्रा के लिए। (4) योग — व्यतीपात और वैधृति से बचें। (5) वार — कार्य के ग्रह से मिलाएँ। (6) राहु काल, यमगण्ड, गुलिक काल से बचें। (7) चौघड़िया/होरा से सूक्ष्म समायोजन। (8) उन्नत: चन्द्र बलम, तारा बलम, लग्न शुद्धि जाँचें।',
    sa: 'मुहूर्तचयनं स्तरितप्रक्रिया। विस्तृततमात् सङ्कीर्णयतु।'
  },
};

export default function LearnMuhurtasPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;
  const isDevanagari = (locale === 'hi' || String(locale) === 'sa');

  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [expandedNight, setExpandedNight] = useState<number | null>(null);

  const daytime = MUHURTA_DATA.filter(m => m.period === 'day');
  const nighttime = MUHURTA_DATA.filter(m => m.period === 'night');

  const natureColor = (nature: string) => {
    if (nature === 'auspicious') return 'text-emerald-400 border-emerald-500/20';
    if (nature === 'inauspicious') return 'text-red-400 border-red-500/20';
    return 'text-amber-400 border-amber-500/20';
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('muhurtasTitle')}
        </h2>
        <p className="text-text-secondary">{t('muhurtasSubtitle')}</p>
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('muhurtasWhat')}</p>
      </LessonSection>

      <LessonSection title={t('stepByStep')}>
        <p>{t('muhurtasAstronomy')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Daytime Muhurta = (Sunset - Sunrise) / 15</p>
          <p className="text-gold-light font-mono text-sm mt-1">Nighttime Muhurta = (Next Sunrise - Sunset) / 15</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">Equinox: ~48 min each | Summer day: ~55-60 min | Winter day: ~38-42 min</p>
        </div>
      </LessonSection>

      {/* Abhijit Muhurta */}
      <LessonSection title={((L.abhijitTitle as Record<string, string>)[locale] ?? L.abhijitTitle.en)}>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {((L.abhijitContent as Record<string, string>)[locale] ?? L.abhijitContent.en)}
        </p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/30">
          <p className="text-gold-light font-mono text-sm mb-1">
            {(locale !== 'hi' && String(locale) !== 'sa') ? 'Abhijit Window Calculation:' : 'अभिजित् गणना:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">Local Noon = (Sunrise + Sunset) / 2</p>
          <p className="text-gold-light/80 font-mono text-xs">Abhijit Start = Noon - (1 Muhurta Duration / 2)</p>
          <p className="text-gold-light/80 font-mono text-xs">Abhijit End = Noon + (1 Muhurta Duration / 2)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {(locale !== 'hi' && String(locale) !== 'sa') ? 'Typically ~11:36 AM to 12:24 PM at equinox (varies by latitude/season)' : 'विषुव पर सामान्यतः ~11:36 से 12:24 (अक्षांश/ऋतु से भिन्न)'}
          </p>
        </div>
      </LessonSection>

      {/* Brahma Muhurta */}
      <LessonSection title={((L.brahmaTitle as Record<string, string>)[locale] ?? L.brahmaTitle.en)}>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {((L.brahmaContent as Record<string, string>)[locale] ?? L.brahmaContent.en)}
        </p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-indigo-400/20">
          <p className="text-indigo-300 font-mono text-sm mb-1">
            {(locale !== 'hi' && String(locale) !== 'sa') ? 'Brahma Muhurta Timing:' : 'ब्रह्म मुहूर्त समय:'}
          </p>
          <p className="text-indigo-200/80 font-mono text-xs">
            {locale === 'en'
              ? 'Start = Sunrise - (2 × Night Muhurta Duration) ≈ 96 minutes before sunrise'
              : 'आरम्भ = सूर्योदय - (2 × रात्रि मुहूर्त अवधि) ≈ सूर्योदय से 96 मिनट पहले'}
          </p>
          <p className="text-indigo-200/80 font-mono text-xs">
            {locale === 'en'
              ? 'End = Sunrise — the period ends exactly at dawn'
              : 'समाप्ति = सूर्योदय — यह अवधि ठीक भोर में समाप्त होती है'}
          </p>
          <p className="text-indigo-200/60 font-mono text-xs mt-2">
            {locale === 'en'
              ? 'At equinox: ~4:24 AM to 6:00 AM | Summer: ~3:30 AM to 5:00 AM | Winter: ~5:20 AM to 7:00 AM'
              : 'विषुव: ~4:24 से 6:00 | ग्रीष्म: ~3:30 से 5:00 | शीत: ~5:20 से 7:00'}
          </p>
        </div>
      </LessonSection>

      {/* Rahu Kaal, Yamaganda, Gulika */}
      <LessonSection title={((L.rahuKaalTitle as Record<string, string>)[locale] ?? L.rahuKaalTitle.en)}>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {((L.rahuKaalContent as Record<string, string>)[locale] ?? L.rahuKaalContent.en)}
        </p>
        <div className="mt-4 overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 border border-red-500/15">
          <p className="text-red-300 text-xs uppercase tracking-widest font-bold mb-3">
            {(locale !== 'hi' && String(locale) !== 'sa') ? 'Weekday Segment Positions (1-8 of daytime)' : 'सप्ताह के दिन खण्ड स्थिति (दिवा 1-8)'}
          </p>
          <table className="w-full text-xs">
            <thead><tr className="border-b border-red-500/15">
              <th className="text-left py-2 px-2 text-gold-dark">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Day' : 'दिन'}</th>
              <th className="text-left py-2 px-2 text-red-300">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Rahu Kaal' : 'राहु काल'}</th>
              <th className="text-left py-2 px-2 text-amber-300">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Yamaganda' : 'यमगण्ड'}</th>
              <th className="text-left py-2 px-2 text-purple-300">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Gulika' : 'गुलिक'}</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5 text-text-secondary">
              <tr><td className="py-1.5 px-2">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Sunday' : 'रवि'}</td><td className="py-1.5 px-2">8th</td><td className="py-1.5 px-2">5th</td><td className="py-1.5 px-2">7th</td></tr>
              <tr><td className="py-1.5 px-2">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Monday' : 'सोम'}</td><td className="py-1.5 px-2">2nd</td><td className="py-1.5 px-2">4th</td><td className="py-1.5 px-2">6th</td></tr>
              <tr><td className="py-1.5 px-2">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Tuesday' : 'मंगल'}</td><td className="py-1.5 px-2">7th</td><td className="py-1.5 px-2">3rd</td><td className="py-1.5 px-2">5th</td></tr>
              <tr><td className="py-1.5 px-2">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Wednesday' : 'बुध'}</td><td className="py-1.5 px-2">5th</td><td className="py-1.5 px-2">2nd</td><td className="py-1.5 px-2">4th</td></tr>
              <tr><td className="py-1.5 px-2">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Thursday' : 'गुरु'}</td><td className="py-1.5 px-2">6th</td><td className="py-1.5 px-2">1st</td><td className="py-1.5 px-2">3rd</td></tr>
              <tr><td className="py-1.5 px-2">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Friday' : 'शुक्र'}</td><td className="py-1.5 px-2">4th</td><td className="py-1.5 px-2">7th</td><td className="py-1.5 px-2">2nd</td></tr>
              <tr><td className="py-1.5 px-2">{(locale !== 'hi' && String(locale) !== 'sa') ? 'Saturday' : 'शनि'}</td><td className="py-1.5 px-2">3rd</td><td className="py-1.5 px-2">6th</td><td className="py-1.5 px-2">1st</td></tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Choghadiya */}
      <LessonSection title={((L.choghadiyaTitle as Record<string, string>)[locale] ?? L.choghadiyaTitle.en)}>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {((L.choghadiyaContent as Record<string, string>)[locale] ?? L.choghadiyaContent.en)}
        </p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'Amrit', planet: (locale !== 'hi' && String(locale) !== 'sa') ? 'Jupiter' : 'गुरु', nature: 'best', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
            { name: 'Shubh', planet: (locale !== 'hi' && String(locale) !== 'sa') ? 'Venus' : 'शुक्र', nature: 'good', color: 'text-emerald-300 border-emerald-500/15 bg-emerald-500/3' },
            { name: 'Labh', planet: (locale !== 'hi' && String(locale) !== 'sa') ? 'Mercury' : 'बुध', nature: 'good', color: 'text-green-300 border-green-500/15 bg-green-500/3' },
            { name: 'Char', planet: (locale !== 'hi' && String(locale) !== 'sa') ? 'Moon' : 'चन्द्र', nature: 'travel', color: 'text-amber-300 border-amber-500/15 bg-amber-500/3' },
            { name: 'Udveg', planet: (locale !== 'hi' && String(locale) !== 'sa') ? 'Sun' : 'सूर्य', nature: 'avoid', color: 'text-red-300 border-red-500/15 bg-red-500/3' },
            { name: 'Kaal', planet: (locale !== 'hi' && String(locale) !== 'sa') ? 'Saturn' : 'शनि', nature: 'avoid', color: 'text-red-400 border-red-500/20 bg-red-500/5' },
            { name: 'Rog', planet: (locale !== 'hi' && String(locale) !== 'sa') ? 'Mars' : 'मंगल', nature: 'avoid', color: 'text-red-300 border-red-500/15 bg-red-500/3' },
          ].map((ch) => (
            <div key={ch.name} className={`rounded-lg border p-3 ${ch.color}`}>
              <p className="font-bold text-sm">{ch.name}</p>
              <p className="text-xs opacity-70">{ch.planet}</p>
              <p className="text-xs uppercase tracking-wider mt-1 opacity-50">{ch.nature}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Hora */}
      <LessonSection title={((L.horaTitle as Record<string, string>)[locale] ?? L.horaTitle.en)}>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {((L.horaContent as Record<string, string>)[locale] ?? L.horaContent.en)}
        </p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {(locale !== 'hi' && String(locale) !== 'sa') ? 'Chaldean Order (descending orbital period):' : 'कल्डियन क्रम (अवरोही कक्षा अवधि):'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? 'Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon → (repeat)'
              : 'शनि → गुरु → मंगल → सूर्य → शुक्र → बुध → चन्द्र → (पुनः)'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-3">
            {(locale !== 'hi' && String(locale) !== 'sa') ? 'Why does Sunday follow Saturday?' : 'शनिवार के बाद रविवार क्यों?'}
          </p>
          <p className="text-gold-light/50 font-mono text-xs">
            {locale === 'en'
              ? 'Saturday 1st hora = Saturn. Count 24 horas through the Chaldean cycle → 25th hora (= next day\'s 1st) = Sun → Sunday!'
              : 'शनिवार की 1ली होरा = शनि। 24 होरा गिनें → 25वीं (= अगले दिन की 1ली) = सूर्य → रविवार!'}
          </p>
        </div>
      </LessonSection>

      {/* Selecting Best Time */}
      <LessonSection title={((L.selectingTitle as Record<string, string>)[locale] ?? L.selectingTitle.en)}>
        <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {((L.selectingContent as Record<string, string>)[locale] ?? L.selectingContent.en)}
        </p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-emerald-400/20">
          <p className="text-emerald-300 font-mono text-sm mb-2">
            {(locale !== 'hi' && String(locale) !== 'sa') ? 'Quick Muhurta Checklist:' : 'त्वरित मुहूर्त जाँचसूची:'}
          </p>
          <div className="space-y-1">
            {(locale === 'en'
              ? [
                  '1. No eclipse, no Adhika Masa',
                  '2. Appropriate Tithi for the activity',
                  '3. Suitable Nakshatra (Fixed/Movable/Dual)',
                  '4. No Vyatipata or Vaidhriti Yoga',
                  '5. Matching Vara (weekday planet)',
                  '6. Outside Rahu Kaal, Yamaganda, Gulika',
                  '7. Favorable Choghadiya (Amrit/Shubh/Labh)',
                  '8. Correct Hora for the activity type',
                ]
              : [
                  '1. कोई ग्रहण नहीं, अधिक मास नहीं',
                  '2. कार्य के लिए उचित तिथि',
                  '3. उपयुक्त नक्षत्र (स्थिर/चर/द्वि)',
                  '4. व्यतीपात या वैधृति योग नहीं',
                  '5. मेल खाता वार (सप्ताह का दिन)',
                  '6. राहु काल, यमगण्ड, गुलिक से बाहर',
                  '7. अनुकूल चौघड़िया (अमृत/शुभ/लाभ)',
                  '8. कार्य प्रकार के लिए सही होरा',
                ]
            ).map((step) => (
              <p key={step} className="text-emerald-200/80 font-mono text-xs">{step}</p>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 30 Muhurtas List */}
      <LessonSection title={t('completeList')}>
        <h4 className="text-lg text-gold-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {(locale !== 'hi' && String(locale) !== 'sa') ? 'Daytime Muhurtas (1-15)' : locale === 'hi' ? 'दिवा मुहूर्त (1-15)' : 'दिवामुहूर्ताः (1-15)'}
        </h4>
        <div className="space-y-3 mb-10">
          {daytime.map((m, i) => {
            const isExpanded = expandedDay === m.number;
            return (
              <motion.div
                key={m.number}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl border overflow-hidden ${m.number === 8 ? 'border-gold-primary/40 ring-1 ring-gold-primary/20' : 'border-gold-primary/10'}`}
              >
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : m.number)}
                  className="w-full text-left p-4 hover:bg-gold-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gold-primary font-bold text-xl w-8">{m.number}</span>
                      <div>
                        <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{m.name[locale]}</span>
                        {m.number === 8 && <span className="ml-2 px-2 py-0.5 bg-gold-primary/30 text-gold-light text-xs rounded-full font-bold uppercase">Abhijit</span>}
                        <span className="ml-2 text-text-secondary/70 text-xs">{m.deity[locale]}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${natureColor(m.nature)}`}>
                        {m.nature === 'auspicious' ? ((locale !== 'hi' && String(locale) !== 'sa') ? 'Auspicious' : 'शुभ') : ((locale !== 'hi' && String(locale) !== 'sa') ? 'Inauspicious' : 'अशुभ')}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-text-secondary/70 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm ml-11 leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {m.significance[locale]}
                  </p>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 ml-11 border-t border-gold-primary/10 pt-3">
                        <h4 className="text-xs font-semibold text-gold-primary/70 uppercase tracking-wider mb-1">
                          {(locale !== 'hi' && String(locale) !== 'sa') ? 'Best Activities' : 'सर्वोत्तम कार्य'}
                        </h4>
                        <p className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {m.bestFor[locale]}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <h4 className="text-lg text-indigo-300/80 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {(locale !== 'hi' && String(locale) !== 'sa') ? 'Nighttime Muhurtas (16-30)' : locale === 'hi' ? 'रात्रि मुहूर्त (16-30)' : 'रात्रिमुहूर्ताः (16-30)'}
        </h4>
        <div className="space-y-3">
          {nighttime.map((m, i) => {
            const isExpanded = expandedNight === m.number;
            const isBrahma = m.number === 26 || m.number === 27;
            return (
              <motion.div
                key={m.number}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl border overflow-hidden ${isBrahma ? 'border-indigo-400/30 ring-1 ring-indigo-400/15' : 'border-gold-primary/10'}`}
              >
                <button
                  onClick={() => setExpandedNight(isExpanded ? null : m.number)}
                  className="w-full text-left p-4 hover:bg-gold-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-300/80 font-bold text-xl w-8">{m.number}</span>
                      <div>
                        <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{m.name[locale]}</span>
                        {isBrahma && <span className="ml-2 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full font-bold">{(locale !== 'hi' && String(locale) !== 'sa') ? 'BRAHMA' : 'ब्राह्म'}</span>}
                        <span className="ml-2 text-text-secondary/70 text-xs">{m.deity[locale]}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${natureColor(m.nature)}`}>
                        {m.nature === 'auspicious' ? ((locale !== 'hi' && String(locale) !== 'sa') ? 'Auspicious' : 'शुभ') : ((locale !== 'hi' && String(locale) !== 'sa') ? 'Inauspicious' : 'अशुभ')}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-text-secondary/70 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm ml-11 leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {m.significance[locale]}
                  </p>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 ml-11 border-t border-gold-primary/10 pt-3">
                        <h4 className="text-xs font-semibold text-gold-primary/70 uppercase tracking-wider mb-1">
                          {(locale !== 'hi' && String(locale) !== 'sa') ? 'Best Activities' : 'सर्वोत्तम कार्य'}
                        </h4>
                        <p className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {m.bestFor[locale]}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* Links */}
      <div className="mt-8 space-y-3">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {(locale !== 'hi' && String(locale) !== 'sa') ? 'Explore Further' : 'और जानें'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: (locale !== 'hi' && String(locale) !== 'sa') ? 'Muhurta AI — Find Auspicious Times' : 'मुहूर्त AI — शुभ समय खोजें', href: '/muhurta-ai', color: 'border-emerald-500/20 hover:border-emerald-500/40' },
            { label: (locale !== 'hi' && String(locale) !== 'sa') ? 'Daily Panchang' : 'दैनिक पंचांग', href: '/panchang', color: 'border-gold-primary/20 hover:border-gold-primary/40' },
            { label: (locale !== 'hi' && String(locale) !== 'sa') ? 'Muhurta Wheel & Conflict Analysis' : 'मुहूर्त चक्र और विरोध विश्लेषण', href: '/panchang/muhurta', color: 'border-gold-primary/20 hover:border-gold-primary/40' },
            { label: (locale !== 'hi' && String(locale) !== 'sa') ? 'Module 17-1: Muhurta Foundations' : 'मॉड्यूल 17-1: मुहूर्त आधार', href: '/learn/modules/17-1', color: 'border-blue-500/20 hover:border-blue-500/40' },
            { label: (locale !== 'hi' && String(locale) !== 'sa') ? 'Module 17-2: Activity-Specific Rules' : 'मॉड्यूल 17-2: कार्य-विशिष्ट नियम', href: '/learn/modules/17-2', color: 'border-blue-500/20 hover:border-blue-500/40' },
            { label: (locale !== 'hi' && String(locale) !== 'sa') ? 'Module 17-3: Chandra & Tara Balam' : 'मॉड्यूल 17-3: चन्द्र और तारा बलम', href: '/learn/modules/17-3', color: 'border-blue-500/20 hover:border-blue-500/40' },
            { label: (locale !== 'hi' && String(locale) !== 'sa') ? 'Module 17-4: Panchaka & Lagna Shuddhi' : 'मॉड्यूल 17-4: पंचक और लग्न शुद्धि', href: '/learn/modules/17-4', color: 'border-blue-500/20 hover:border-blue-500/40' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border ${link.color} transition-colors text-sm text-gold-light hover:bg-gold-primary/5`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

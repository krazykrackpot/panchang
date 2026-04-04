'use client';

import { motion } from 'framer-motion';
import type { Locale } from '@/types/panchang';
import ConflictTimeline from './ConflictTimeline';
import { AlertTriangle, Shield, Clock, Calendar, Sun } from 'lucide-react';

interface ConflictSectionProps {
  locale: Locale;
}

interface ConflictCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  borderColor?: string;
}

function ConflictCard({ icon, title, children, borderColor = 'border-gold-primary/10' }: ConflictCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-card rounded-xl p-6 border ${borderColor}`}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h4 className="text-lg font-semibold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h4>
      </div>
      <div className="text-text-secondary text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </motion.div>
  );
}

export default function ConflictSection({ locale }: ConflictSectionProps) {
  const en = locale === 'en';

  return (
    <div className="space-y-6">
      {/* Conflict Timeline Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6"
      >
        <h4 className="text-lg font-semibold text-gold-light mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {en ? 'Muhurta & Rahu Kalam Conflict Map' : 'मुहूर्त एवं राहु काल विरोध मानचित्र'}
        </h4>
        <p className="text-text-secondary text-sm mb-4">
          {en
            ? 'The purple zones show where Rahu Kalam falls across different weekdays, overlaid on the 15 daytime Muhurtas. Notice how it can overlap with auspicious Muhurtas, including the Abhijit Muhurta on certain days.'
            : 'बैंगनी क्षेत्र विभिन्न सप्ताह के दिनों में राहु काल की स्थिति दिखाते हैं, 15 दिवा मुहूर्तों पर आच्छादित। ध्यान दें कि कुछ दिनों में यह शुभ मुहूर्तों और अभिजित् मुहूर्त से भी ओवरलैप करता है।'}
        </p>
        <ConflictTimeline locale={locale} />
      </motion.div>

      {/* 1. Abhijit vs Rahu Kalam */}
      <ConflictCard
        icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
        title={en ? '1. Abhijit Muhurta vs Rahu Kalam' : '1. अभिजित् मुहूर्त बनाम राहु काल'}
        borderColor="border-amber-500/20"
      >
        <p>
          {en
            ? 'The Abhijit Muhurta (8th daytime muhurta, around midday) is considered the most auspicious time of the day — "victory is assured" for any activity started during this period. However, Rahu Kalam (an inauspicious period of ~90 minutes ruled by Rahu) varies by weekday and can sometimes overlap with Abhijit.'
            : 'अभिजित् मुहूर्त (8वाँ दिवा मुहूर्त, मध्याह्न के आसपास) दिन का सर्वाधिक शुभ समय माना जाता है। किन्तु राहु काल (राहु द्वारा शासित ~90 मिनट का अशुभ काल) सप्ताह के दिन के अनुसार बदलता है और कभी-कभी अभिजित् से ओवरलैप कर सकता है।'}
        </p>
        <div className="p-3 bg-bg-primary/50 rounded-lg border border-amber-500/10">
          <p className="text-gold-light text-xs font-semibold mb-2">
            {en ? 'When does this conflict occur?' : 'यह विरोध कब होता है?'}
          </p>
          <p className="text-xs">
            {en
              ? 'On Wednesdays, Rahu Kalam falls around 12:00-1:30 PM, which directly overlaps with the Abhijit Muhurta period. On Thursdays, it falls around 1:30-3:00 PM, causing partial overlap.'
              : 'बुधवार को राहु काल लगभग 12:00-1:30 बजे होता है, जो सीधे अभिजित् मुहूर्त काल से ओवरलैप करता है। गुरुवार को यह लगभग 1:30-3:00 बजे पड़ता है।'}
          </p>
        </div>
        <div className="p-3 bg-bg-primary/50 rounded-lg border border-emerald-500/10">
          <p className="text-emerald-400 text-xs font-semibold mb-1">
            {en ? 'Classical Resolution (Muhurta Chintamani):' : 'शास्त्रीय समाधान (मुहूर्त चिन्तामणि):'}
          </p>
          <p className="text-xs">
            {en
              ? 'The classical text Muhurta Chintamani states that Abhijit Muhurta OVERRIDES Rahu Kalam. The inherent auspiciousness of the midday Abhijit is so powerful that Rahu\'s influence is nullified. Important ceremonies like marriages, housewarming, and coronations can proceed.'
              : 'शास्त्रीय ग्रन्थ मुहूर्त चिन्तामणि के अनुसार अभिजित् मुहूर्त राहु काल को निष्प्रभ करता है। मध्याह्न अभिजित् की शुभता इतनी प्रबल है कि राहु का प्रभाव शून्य हो जाता है।'}
          </p>
        </div>
        <div className="p-3 bg-bg-primary/50 rounded-lg border border-blue-500/10">
          <p className="text-blue-400 text-xs font-semibold mb-1">
            {en ? 'Conservative Approach:' : 'रूढ़िवादी दृष्टिकोण:'}
          </p>
          <p className="text-xs">
            {en
              ? 'Some practitioners advise avoiding the overlapping portion, especially for highly sensitive activities (medical procedures, financial investments). For spiritual activities, the Abhijit override is generally accepted.'
              : 'कुछ विद्वान ओवरलैपिंग भाग से बचने की सलाह देते हैं, विशेषकर अत्यन्त संवेदनशील कार्यों (चिकित्सा, वित्तीय निवेश) के लिए। आध्यात्मिक कार्यों के लिए अभिजित् की प्रधानता सामान्यतः स्वीकृत है।'}
          </p>
        </div>
      </ConflictCard>

      {/* 2. Auspicious Muhurta during Inauspicious Tithi/Nakshatra */}
      <ConflictCard
        icon={<Shield className="w-5 h-5 text-blue-400" />}
        title={en ? '2. Muhurta vs Tithi vs Nakshatra Hierarchy' : '2. मुहूर्त-तिथि-नक्षत्र पदानुक्रम'}
        borderColor="border-blue-500/20"
      >
        <p>
          {en
            ? 'What happens when a favorable muhurta falls on an inauspicious Tithi or Nakshatra? Classical texts establish a clear hierarchy of influence:'
            : 'क्या होता है जब शुभ मुहूर्त अशुभ तिथि या नक्षत्र पर पड़ता है? शास्त्रीय ग्रन्थ प्रभाव का स्पष्ट पदानुक्रम स्थापित करते हैं:'}
        </p>
        <div className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <div className="flex items-center gap-2 text-xs font-mono text-gold-light">
            <span className="text-text-secondary">Strongest →</span>
            <span className="px-2 py-0.5 bg-gold-primary/10 rounded">Nakshatra</span>
            <span className="text-text-secondary">&gt;</span>
            <span className="px-2 py-0.5 bg-gold-primary/10 rounded">Tithi</span>
            <span className="text-text-secondary">&gt;</span>
            <span className="px-2 py-0.5 bg-gold-primary/10 rounded">Yoga</span>
            <span className="text-text-secondary">&gt;</span>
            <span className="px-2 py-0.5 bg-gold-primary/10 rounded">Muhurta</span>
            <span className="text-text-secondary">← Weakest</span>
          </div>
        </div>
        <p>
          {en
            ? 'This means: a good Muhurta cannot override a bad Nakshatra. If the day\'s Nakshatra is considered inauspicious (e.g., Bharani for marriages), no amount of Muhurta optimization will help. Always check the broader Panchang first, then select the best Muhurta within that framework.'
            : 'इसका अर्थ: शुभ मुहूर्त अशुभ नक्षत्र को निष्प्रभ नहीं कर सकता। यदि दिन का नक्षत्र अशुभ माना गया है (जैसे विवाह के लिए भरणी), तो कोई भी मुहूर्त अनुकूलन सहायक नहीं होगा। पहले व्यापक पञ्चाङ्ग जाँचें, फिर उस ढाँचे के भीतर सर्वोत्तम मुहूर्त चुनें।'}
        </p>
      </ConflictCard>

      {/* 3. Brahma Muhurta vs Yama Ghantaka */}
      <ConflictCard
        icon={<Clock className="w-5 h-5 text-indigo-400" />}
        title={en ? '3. Brahma Muhurta vs Yama Ghantaka' : '3. ब्राह्म मुहूर्त बनाम यम घण्टक'}
        borderColor="border-indigo-500/20"
      >
        <p>
          {en
            ? 'Brahma Muhurta (Muhurtas 26-27, roughly 96 minutes before sunrise) is the supreme time for spiritual practice, meditation, and Vedic study. However, Yama Ghantaka — an inauspicious sub-period associated with Yama (lord of death) — can overlap on certain weekdays.'
            : 'ब्राह्म मुहूर्त (मुहूर्त 26-27, सूर्योदय से लगभग 96 मिनट पूर्व) आध्यात्मिक अभ्यास, ध्यान और वैदिक अध्ययन के लिए सर्वोत्तम काल है। किन्तु यम घण्टक — यम (मृत्यु के देवता) से सम्बद्ध अशुभ उपकाल — कुछ दिनों में ओवरलैप कर सकता है।'}
        </p>
        <div className="p-3 bg-bg-primary/50 rounded-lg border border-indigo-500/10">
          <p className="text-indigo-300 text-xs font-semibold mb-1">
            {en ? 'Practical Guidance:' : 'व्यावहारिक मार्गदर्शन:'}
          </p>
          <p className="text-xs">
            {en
              ? 'For purely spiritual activities (meditation, japa, pranayama), Brahma Muhurta\'s sanctity is considered paramount — Yama Ghantaka does not diminish its spiritual potency. However, for worldly activities begun during this time (journeys, business), caution is advised on affected weekdays.'
              : 'विशुद्ध आध्यात्मिक कार्यों (ध्यान, जप, प्राणायाम) के लिए ब्राह्म मुहूर्त की पवित्रता सर्वोपरि मानी जाती है — यम घण्टक इसकी आध्यात्मिक शक्ति को क्षीण नहीं करता। किन्तु इस काल में आरम्भ किए लौकिक कार्यों के लिए प्रभावित दिनों पर सावधानी उचित है।'}
          </p>
        </div>
      </ConflictCard>

      {/* 4. Seasonal Variation */}
      <ConflictCard
        icon={<Sun className="w-5 h-5 text-gold-primary" />}
        title={en ? '4. Seasonal Variation Impact' : '4. ऋतुगत भिन्नता का प्रभाव'}
        borderColor="border-gold-primary/20"
      >
        <p>
          {en
            ? 'Since Muhurta duration depends on the actual length of day and night, the same numbered Muhurta falls at different clock times across seasons.'
            : 'चूँकि मुहूर्त की अवधि दिन और रात की वास्तविक लम्बाई पर निर्भर करती है, एक ही क्रमांक का मुहूर्त ऋतुओं में भिन्न घड़ी-समय पर पड़ता है।'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
            <p className="text-gold-light text-xs font-semibold mb-1">{en ? 'Summer (Grishma Ritu)' : 'ग्रीष्म ऋतु'}</p>
            <p className="text-text-secondary text-xs">{en ? 'Daytime muhurta: ~55-60 minutes' : 'दिवा मुहूर्त: ~55-60 मिनट'}</p>
            <p className="text-text-secondary text-xs">{en ? 'Nighttime muhurta: ~36-40 minutes' : 'रात्रि मुहूर्त: ~36-40 मिनट'}</p>
            <p className="text-text-secondary text-xs mt-1">{en ? 'Abhijit falls later (~12:30-1:30 PM)' : 'अभिजित् देर से (~12:30-1:30)'}</p>
          </div>
          <div className="p-3 bg-bg-primary/50 rounded-lg border border-indigo-400/10">
            <p className="text-indigo-300 text-xs font-semibold mb-1">{en ? 'Winter (Shishira Ritu)' : 'शिशिर ऋतु'}</p>
            <p className="text-text-secondary text-xs">{en ? 'Daytime muhurta: ~38-42 minutes' : 'दिवा मुहूर्त: ~38-42 मिनट'}</p>
            <p className="text-text-secondary text-xs">{en ? 'Nighttime muhurta: ~54-58 minutes' : 'रात्रि मुहूर्त: ~54-58 मिनट'}</p>
            <p className="text-text-secondary text-xs mt-1">{en ? 'Abhijit falls earlier (~11:30 AM-12:15 PM)' : 'अभिजित् जल्दी (~11:30-12:15)'}</p>
          </div>
        </div>
      </ConflictCard>

      {/* 5. Weekday-Specific Rahu Kalam */}
      <ConflictCard
        icon={<Calendar className="w-5 h-5 text-purple-400" />}
        title={en ? '5. Weekday-Specific Rahu Kalam Conflicts' : '5. वार-विशिष्ट राहु काल विरोध'}
        borderColor="border-purple-500/20"
      >
        <p>
          {en
            ? 'Rahu Kalam timing follows a fixed pattern by weekday. The mnemonic "Mother Saw Father Wearing The Turban Slowly" gives the order of which 1.5-hour eighth of the day is Rahu Kalam:'
            : 'राहु काल का समय सप्ताह के दिन के अनुसार निश्चित क्रम में आता है:'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { day: en ? 'Monday' : 'सोमवार', time: '7:30-9:00 AM', muhurtas: '2-3', conflict: en ? 'Ahi (inauspicious anyway)' : 'अहि (वैसे भी अशुभ)' },
            { day: en ? 'Saturday' : 'शनिवार', time: '9:00-10:30 AM', muhurtas: '3-4', conflict: en ? 'Mitra, Pitru' : 'मित्र, पितृ' },
            { day: en ? 'Friday' : 'शुक्रवार', time: '10:30-12:00 PM', muhurtas: '5-6', conflict: en ? 'Vasu, Vara' : 'वसु, वाराह' },
            { day: en ? 'Wednesday' : 'बुधवार', time: '12:00-1:30 PM', muhurtas: '7-8', conflict: en ? 'Vishvedeva, ABHIJIT!' : 'विश्वदेव, अभिजित्!' },
            { day: en ? 'Thursday' : 'गुरुवार', time: '1:30-3:00 PM', muhurtas: '9-10', conflict: en ? 'Satamukhi, Puruhuta' : 'शतमुखी, पुरुहूत' },
            { day: en ? 'Tuesday' : 'मंगलवार', time: '3:00-4:30 PM', muhurtas: '11-12', conflict: en ? 'Vahini, Naktanakara (both inauspicious)' : 'वाहिनी, नक्तनकर (दोनों अशुभ)' },
            { day: en ? 'Sunday' : 'रविवार', time: '4:30-6:00 PM', muhurtas: '13-14', conflict: en ? 'Varuna, Aryaman' : 'वरुण, अर्यमन्' },
          ].map((item) => (
            <div key={item.day} className="p-2 bg-bg-primary/50 rounded-lg border border-purple-500/10 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gold-light font-semibold">{item.day}</span>
                <span className="text-text-secondary font-mono">{item.time}</span>
              </div>
              <div className="text-text-secondary/70 mt-0.5">
                {en ? 'Muhurtas affected' : 'प्रभावित मुहूर्त'}: {item.muhurtas} — {item.conflict}
              </div>
            </div>
          ))}
        </div>
      </ConflictCard>
    </div>
  );
}

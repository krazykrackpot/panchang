'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { BookOpen, ChevronRight } from 'lucide-react';
import type { Locale } from '@/types/panchang';

const PHASES = [
  { phase: 1, label: { en: 'The Sky', hi: 'आकाश' }, color: 'border-blue-500/20', topics: [
    { topic: 'Foundations', modules: [
      { id: '1-1', title: { en: 'The Night Sky & Ecliptic', hi: 'रात्रि आकाश एवं क्रान्तिवृत्त' } },
      { id: '1-2', title: { en: 'Measuring the Sky — Degrees, Signs & Nakshatras', hi: 'आकाश मापन' } },
      { id: '1-3', title: { en: 'The Zodiac Belt — Fixed Stars vs Moving Planets', hi: 'राशिचक्र पट्टी' } },
    ]},
    { topic: 'Grahas', modules: [
      { id: '2-1', title: { en: 'The Nine Grahas — Nature & Karakatva', hi: 'नवग्रह — प्रकृति एवं कारकत्व' } },
      { id: '2-2', title: { en: 'Planetary Relationships — Friendship Matrix', hi: 'ग्रह संबंध — मित्रता सारणी' } },
      { id: '2-3', title: { en: 'Dignities — Where Planets Thrive & Suffer', hi: 'ग्रह गरिमा' } },
      { id: '2-4', title: { en: 'Retrograde, Combustion & Planetary War', hi: 'वक्री, अस्त एवं ग्रह युद्ध' } },
    ]},
    { topic: 'Rashis', modules: [
      { id: '3-1', title: { en: "The 12 Rashis — Parashara's Description", hi: '12 राशियाँ' } },
      { id: '3-2', title: { en: 'Sign Qualities — Chara, Sthira, Dwiswabhava', hi: 'राशि गुण' } },
      { id: '3-3', title: { en: 'Sign Lordship & Luminaries', hi: 'राशि स्वामित्व' } },
    ]},
    { topic: 'Ayanamsha', modules: [
      { id: '4-1', title: { en: 'Earth Wobble — Precession Physics', hi: 'अयनगति भौतिकी' } },
      { id: '4-2', title: { en: 'Two Zodiacs — Tropical vs Sidereal', hi: 'दो राशिचक्र' } },
      { id: '4-3', title: { en: 'Ayanamsha Systems — The Great Debate', hi: 'अयनांश पद्धतियाँ' } },
    ]},
  ]},
  { phase: 2, label: { en: 'Pancha Anga', hi: 'पंच अंग' }, color: 'border-amber-500/20', topics: [
    { topic: 'Tithi', modules: [
      { id: '5-1', title: { en: 'What Is a Tithi?', hi: 'तिथि क्या है?' } },
      { id: '5-2', title: { en: 'Shukla & Krishna Paksha', hi: 'शुक्ल एवं कृष्ण पक्ष' } },
      { id: '5-3', title: { en: 'Special Tithis & Vrat Calendar', hi: 'विशेष तिथियाँ' } },
    ]},
    { topic: 'Nakshatra', modules: [
      { id: '6-1', title: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र' } },
      { id: '6-2', title: { en: 'Padas & Navamsha Connection', hi: 'पाद एवं नवांश' } },
      { id: '6-3', title: { en: 'Nakshatra Dasha Lords', hi: 'दशा स्वामी' } },
      { id: '6-4', title: { en: 'Gana, Yoni, Nadi & Compatibility', hi: 'गण, योनि, नाडी' } },
    ]},
    { topic: 'Yoga, Karana & Vara', modules: [
      { id: '7-1', title: { en: 'Panchang Yoga — Sun-Moon Sum', hi: 'पंचांग योग' } },
      { id: '7-2', title: { en: 'Karana — Half-Tithi System', hi: 'करण' } },
      { id: '7-3', title: { en: 'Vara & the Hora System', hi: 'वार एवं होरा' } },
    ]},
    { topic: 'Muhurta', modules: [
      { id: '8-1', title: { en: '30 Muhurtas Per Day', hi: '30 मुहूर्त' } },
    ]},
  ]},
  { phase: 3, label: { en: 'The Chart', hi: 'कुण्डली' }, color: 'border-emerald-500/20', topics: [
    { topic: 'Kundali', modules: [
      { id: '9-1', title: { en: 'What Is a Birth Chart?', hi: 'जन्म कुण्डली' } },
      { id: '9-2', title: { en: 'Computing the Lagna', hi: 'लग्न गणना' } },
      { id: '9-3', title: { en: 'Placing Planets', hi: 'ग्रह स्थापन' } },
      { id: '9-4', title: { en: 'Reading a Chart', hi: 'कुण्डली पठन' } },
    ]},
    { topic: 'Bhavas', modules: [
      { id: '10-1', title: { en: '12 Houses — Significations', hi: '12 भाव' } },
      { id: '10-2', title: { en: 'Kendra, Trikona, Dusthana', hi: 'केंद्र, त्रिकोण, दुःस्थान' } },
      { id: '10-3', title: { en: 'House Lords', hi: 'भावेश' } },
    ]},
    { topic: 'Vargas', modules: [
      { id: '11-1', title: { en: 'Why Divisional Charts?', hi: 'विभागीय चार्ट' } },
      { id: '11-2', title: { en: 'Navamsha (D9)', hi: 'नवांश' } },
      { id: '11-3', title: { en: 'Key Vargas D2-D60', hi: 'प्रमुख वर्ग' } },
    ]},
    { topic: 'Dashas', modules: [
      { id: '12-1', title: { en: 'Vimshottari — 120-Year Cycle', hi: 'विंशोत्तरी' } },
      { id: '12-2', title: { en: 'Reading Dasha Periods', hi: 'दशा पठन' } },
      { id: '12-3', title: { en: 'Timing Events', hi: 'घटना समय' } },
    ]},
    { topic: 'Transits', modules: [
      { id: '13-1', title: { en: 'How Transits Work', hi: 'गोचर' } },
      { id: '13-2', title: { en: 'Sade Sati', hi: 'साढ़े साती' } },
      { id: '13-3', title: { en: 'Ashtakavarga Transit Scoring', hi: 'अष्टकवर्ग गोचर' } },
    ]},
  ]},
  { phase: 4, label: { en: 'Applied Jyotish', hi: 'प्रयुक्त ज्योतिष' }, color: 'border-pink-500/20', topics: [
    { topic: 'Compatibility', modules: [
      { id: '14-1', title: { en: 'Ashta Kuta — 8-Factor Matching', hi: 'अष्ट कूट' } },
      { id: '14-2', title: { en: 'Key Kutas & Doshas', hi: 'प्रमुख कूट' } },
      { id: '14-3', title: { en: 'Beyond Kuta — Chart Analysis', hi: 'कूट से परे' } },
    ]},
    { topic: 'Yogas & Doshas', modules: [
      { id: '15-1', title: { en: 'Pancha Mahapurusha Yogas', hi: 'पंच महापुरुष' } },
      { id: '15-2', title: { en: 'Raja & Dhana Yogas', hi: 'राज एवं धन योग' } },
      { id: '15-3', title: { en: 'Common Doshas', hi: 'प्रमुख दोष' } },
      { id: '15-4', title: { en: 'Remedial Measures', hi: 'उपाय' } },
    ]},
  ]},
  { phase: 5, label: { en: 'Classical Knowledge', hi: 'शास्त्रीय ज्ञान' }, color: 'border-gold-primary/20', topics: [
    { topic: 'Classical Texts', modules: [
      { id: '16-1', title: { en: 'Astronomical Texts', hi: 'खगोलशास्त्रीय' } },
      { id: '16-2', title: { en: 'Hora Texts', hi: 'होरा ग्रंथ' } },
      { id: '16-3', title: { en: "India's Contributions", hi: 'भारत का योगदान' } },
    ]},
  ]},
];

export default function ModuleIndexPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  let moduleCount = 0;
  PHASES.forEach(p => p.topics.forEach(t => { moduleCount += t.modules.length; }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>
          {isHi ? 'सम्पूर्ण पाठ्यक्रम — 50 मॉड्यूल' : 'Complete Curriculum — 50 Modules'}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
          {isHi
            ? 'प्रत्येक मॉड्यूल 10-15 मिनट का गहन पाठ है — सामग्री, उदाहरण, और ज्ञान परीक्षा के साथ। मॉड्यूल 1.1 से शुरू करें और क्रम में आगे बढ़ें।'
            : 'Each module is a 10-15 minute deep lesson with content, worked examples, and a knowledge check. Start with Module 1.1 and progress in order.'}
        </p>
      </div>

      {/* Start button */}
      <div className="glass-card rounded-2xl p-5 border border-gold-primary/20 bg-gradient-to-r from-gold-primary/5 to-indigo-500/5 flex items-center justify-between">
        <div>
          <div className="text-gold-light font-bold text-lg" style={hf}>{isHi ? 'शुरू करें' : 'Start Learning'}</div>
          <p className="text-text-secondary text-xs mt-1">{isHi ? 'मॉड्यूल 1.1 — रात्रि आकाश एवं क्रान्तिवृत्त' : 'Module 1.1 — The Night Sky & Ecliptic'}</p>
        </div>
        <Link href="/learn/modules/1-1" className="shrink-0 px-6 py-2.5 rounded-xl bg-gold-primary text-bg-primary font-semibold text-sm hover:bg-gold-light transition-colors">
          {isHi ? 'आरम्भ →' : 'Begin →'}
        </Link>
      </div>

      {/* Phase sections */}
      {PHASES.map((phase) => (
        <div key={phase.phase}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-xs text-gold-primary font-bold">{phase.phase}</span>
            <h3 className="text-gold-light font-bold text-lg" style={hf}>{isHi ? phase.label.hi : phase.label.en}</h3>
          </div>

          <div className="space-y-3">
            {phase.topics.map((topic) => (
              <div key={topic.topic} className={`glass-card rounded-xl border ${phase.color} overflow-hidden`}>
                <div className="px-4 py-2 border-b border-gold-primary/5">
                  <span className="text-gold-dark text-[10px] uppercase tracking-widest font-bold">{topic.topic}</span>
                </div>
                <div className="divide-y divide-gold-primary/5">
                  {topic.modules.map((mod, i) => (
                    <motion.div key={mod.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                      <Link href={`/learn/modules/${mod.id}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gold-primary/5 transition-colors group">
                        <div className="flex items-center gap-3">
                          <span className="text-text-tertiary text-xs font-mono w-8">{mod.id.replace('-', '.')}</span>
                          <span className="text-text-primary text-sm group-hover:text-gold-light transition-colors" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                            {isHi ? mod.title.hi : mod.title.en}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-gold-primary transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

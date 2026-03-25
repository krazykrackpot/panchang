'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import { NakshatraIcon } from '@/components/icons/PanchangIcons';
import type { Locale } from '@/types/panchang';
import { ArrowLeft } from 'lucide-react';

export default function NakshatraPage() {
  const t = useTranslations('deepDive');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/panchang" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('backToPanchang')}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-6 mb-6">
        <NakshatraIcon size={72} />
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2" style={headingFont}>
            <span className="text-gold-gradient">{locale === 'en' ? 'Nakshatra' : locale === 'hi' ? 'नक्षत्र' : 'नक्षत्रम्'}</span>
          </h1>
          <p className="text-text-secondary text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {locale === 'en' ? 'The 27 Lunar Mansions — Stars that Map the Ecliptic' : locale === 'hi' ? '27 चन्द्र गृह — क्रान्तिवृत्त के तारामण्डल' : 'सप्तविंशतिः चन्द्रभवनानि — क्रान्तिवृत्तस्य ताराचित्रम्'}
          </p>
        </div>
      </motion.div>

      <GoldDivider />

      {/* What are Nakshatras */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {locale === 'en' ? 'What are Nakshatras?' : locale === 'hi' ? 'नक्षत्र क्या हैं?' : 'नक्षत्राणि किम्?'}
        </h2>
        <div className="glass-card rounded-xl p-8">
          <div className="text-text-secondary space-y-4">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? 'The word "Nakshatra" derives from Sanskrit — "naksha" (map) + "tra" (guard), literally meaning "guardians of the sky map." They are 27 divisions of the ecliptic, each spanning 13°20\' of celestial longitude, identified by prominent stars or star groups near the Moon\'s path.'
                : locale === 'hi'
                ? '"नक्षत्र" शब्द संस्कृत से आता है — "नक्ष" (मानचित्र) + "त्र" (रक्षक), अर्थात् "आकाश मानचित्र के संरक्षक।" ये क्रान्तिवृत्त के 27 विभाग हैं, प्रत्येक 13°20\' खगोलीय देशांतर का, जो चन्द्र पथ के निकट प्रमुख तारों या तारासमूहों द्वारा पहचाने जाते हैं।'
                : '"नक्षत्र" इति शब्दः संस्कृतात् आगच्छति — "नक्ष" (चित्रम्) + "त्र" (रक्षकः), यथार्थतः "आकाशचित्रस्य रक्षकाः" इति। एतानि क्रान्तिवृत्तस्य सप्तविंशतिविभागाः सन्ति।'}
            </p>
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? 'This system predates the 12-sign zodiac and represents one of humanity\'s oldest star catalogues. The Rigveda (c. 1500 BCE) references many Nakshatras, and the Vedanga Jyotisha (c. 1200 BCE) provides a systematic framework. Each Nakshatra is associated with a presiding deity, a ruling planet (Graha), a symbol representing its energy, and specific qualities that influence human activities.'
                : locale === 'hi'
                ? 'यह प्रणाली 12 राशियों की राशि से पहले की है और मानवता के सबसे पुराने तारा-सूचियों में से एक है। ऋग्वेद (लगभग 1500 ई.पू.) में अनेक नक्षत्रों का उल्लेख है, और वेदांग ज्योतिष (लगभग 1200 ई.पू.) एक व्यवस्थित ढांचा प्रदान करता है।'
                : 'एषा प्रणाली द्वादशराशिचक्रात् पूर्वतनी अस्ति मानवतायाः प्राचीनतमतारासूचीषु एका च। ऋग्वेदे (प्रा. 1500 ई.पू.) बहूनां नक्षत्राणाम् उल्लेखः अस्ति।'}
            </p>
          </div>
        </div>
      </section>

      {/* How Names Arise */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {locale === 'en' ? 'How Nakshatras Get Their Names' : locale === 'hi' ? 'नक्षत्रों के नाम कैसे पड़े' : 'नक्षत्राणां नामानि कथम्'}
        </h2>
        <div className="glass-card rounded-xl p-8">
          <div className="text-text-secondary space-y-4">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? 'Nakshatra names derive from multiple sources: the shape of their star patterns (Mrigashira — "deer\'s head"), their presiding deities (Brahma for Rohini), the qualities they embody (Pushya — "nourisher"), or mythological narratives (Ashwini — named after the divine twin horsemen, the Ashwini Kumaras, physicians of the gods).'
                : locale === 'hi'
                ? 'नक्षत्रों के नाम विभिन्न स्रोतों से आते हैं: उनके तारा-प्रतिरूपों का आकार (मृगशिरा — "हिरण का सिर"), उनके अधिष्ठाता देवता (रोहिणी के लिए ब्रह्मा), उनके गुण (पुष्य — "पोषक"), या पौराणिक कथाएं (अश्विनी — देव जुड़वां अश्वारोहियों, अश्विनी कुमारों के नाम पर)।'
                : 'नक्षत्रनामानि बहुविधस्रोतेभ्यः आगच्छन्ति — तारारूपाणाम् आकारात् (मृगशिरा — "मृगस्य शिरः"), अधिष्ठातृदेवताभ्यः (रोहिण्याः ब्रह्मा), गुणेभ्यः (पुष्यः — "पोषकः")।'}
            </p>
          </div>
        </div>
      </section>

      {/* Scientific Basis */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>{t('scientificBasis')}</h2>
        <div className="glass-card rounded-xl p-8">
          <div className="prose prose-invert max-w-none text-text-secondary">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? `The 27 Nakshatras divide the 360° ecliptic into equal segments of 13°20' (13.333°) each. They are defined by prominent stars (Yogatara) near the ecliptic plane. As the Moon completes one sidereal orbit in approximately 27.3 days, it spends roughly one day in each Nakshatra. The Nakshatra is determined by the Moon's sidereal longitude: Nakshatra number = floor(Moon_sidereal_longitude / 13.333) + 1. Each Nakshatra is further divided into 4 Padas (quarters) of 3°20' each, linking them to the Navamsha chart in Jyotish.`
                : locale === 'hi'
                ? `27 नक्षत्र 360° क्रान्तिवृत्त को 13°20' (13.333°) के बराबर खण्डों में विभाजित करते हैं। ये क्रान्तिवृत्त के निकट प्रमुख तारों (योगतारा) द्वारा परिभाषित हैं। चन्द्रमा लगभग 27.3 दिनों में एक नाक्षत्रिक परिक्रमा पूर्ण करता है, अतः प्रत्येक नक्षत्र में लगभग एक दिन व्यतीत करता है।`
                : `सप्तविंशतिः नक्षत्राणि 360° क्रान्तिवृत्तं 13°20' (13.333°) समखण्डेषु विभजन्ति। एतानि क्रान्तिवृत्तसमीपस्थप्रमुखताराभिः (योगताराभिः) परिभाष्यन्ते।`}
            </p>
            <div className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <p className="text-gold-light font-mono text-sm">
                {locale === 'en' ? 'Formula:' : 'सूत्र:'} Nakshatra = floor(Moon_sidereal_longitude / 13.333) + 1
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecliptic Belt Visualization */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {locale === 'en' ? 'Ecliptic Belt — 27 Nakshatras' : locale === 'hi' ? 'क्रान्तिवृत्त — 27 नक्षत्र' : 'क्रान्तिवृत्तम् — सप्तविंशतिनक्षत्राणि'}
        </h2>
        <div className="glass-card rounded-xl p-8 flex justify-center">
          <EclipticBelt locale={locale} isDevanagari={isDevanagari} />
        </div>
      </section>

      <GoldDivider />

      {/* Complete Listing with SVG Icons and Links */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-3" style={headingFont}>{t('completeListing')}</h2>
        <p className="text-text-secondary mb-8">
          {locale === 'en' ? 'Click any Nakshatra to explore its mythology, significance, and detailed characteristics.' : 'किसी भी नक्षत्र पर क्लिक करें उसकी पौराणिक कथा, महत्व और विस्तृत विशेषताओं का अन्वेषण करने के लिए।'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {NAKSHATRAS.map((nak, i) => (
            <motion.div
              key={nak.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ scale: 1.04, y: -4 }}
            >
              <Link
                href={`/panchang/nakshatra/${nak.id}`}
                className="glass-card rounded-xl p-5 flex items-center gap-5 hover:border-gold-primary/40 transition-all group block"
              >
                <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                  <NakshatraIconById id={nak.id} size={64} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold-dark text-xs font-mono">#{nak.id}</span>
                    <span className="text-gold-light font-bold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {nak.name[locale]}
                    </span>
                  </div>
                  <div className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {nak.deity[locale]} · {nak.rulerName[locale]}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-gold-dark/60 text-xs font-mono">{nak.startDeg.toFixed(1)}° — {nak.endDeg.toFixed(1)}°</span>
                    <span className="text-xs text-text-secondary/60" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{nak.nature[locale]}</span>
                  </div>
                </div>
                <div className="text-gold-primary/40 group-hover:text-gold-light transition-colors text-lg">→</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Ecliptic Belt — extracted to avoid hydration mismatch with SVG floats
function EclipticBelt({ locale, isDevanagari }: { locale: Locale; isDevanagari: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-full max-w-lg aspect-square" />;

  return (
    <motion.svg
      viewBox="0 0 500 500"
      className="w-full max-w-lg"
      initial={{ opacity: 0, scale: 0.85, rotate: -15 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <defs>
        <radialGradient id="nakBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1f4e" />
          <stop offset="100%" stopColor="#0a0e27" />
        </radialGradient>
        <filter id="starGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <circle cx="250" cy="250" r="245" fill="url(#nakBg)" />

      {[230, 180, 130].map((r, i) => (
        <motion.circle
          key={r} cx="250" cy="250" r={r} fill="none"
          stroke="rgba(212,168,83,0.15)" strokeWidth={i === 0 ? '1' : '0.5'}
          initial={{ r: 0, opacity: 0 }}
          animate={{ r, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
        />
      ))}

      <motion.g animate={{ rotate: 360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '250px 250px' }}>
        <circle cx="250" cy="68" r="4" fill="#f0d48a" opacity="0.7" filter="url(#starGlow)" />
        <circle cx="250" cy="68" r="6" fill="none" stroke="#f0d48a" strokeWidth="0.5" opacity="0.3" />
      </motion.g>

      {NAKSHATRAS.map((nak, i) => {
        const sectorAngle = 360 / 27;
        const angle = (i * sectorAngle - 90) * Math.PI / 180;
        const midAngle = ((i * sectorAngle + sectorAngle / 2) - 90) * Math.PI / 180;
        const x1 = 250 + 180 * Math.cos(angle);
        const y1 = 250 + 180 * Math.sin(angle);
        const x2 = 250 + 230 * Math.cos(angle);
        const y2 = 250 + 230 * Math.sin(angle);
        const textX = 250 + 205 * Math.cos(midAngle);
        const textY = 250 + 205 * Math.sin(midAngle);
        const dotX = 250 + 155 * Math.cos(midAngle);
        const dotY = 250 + 155 * Math.sin(midAngle);
        const rotationDeg = i * sectorAngle;

        return (
          <motion.g key={nak.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.03 }}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,168,83,0.2)" strokeWidth="0.5" />
            <text x={textX} y={textY} fill="#f0d48a" fontSize="5.5" textAnchor="middle" dominantBaseline="middle"
              transform={`rotate(${rotationDeg}, ${textX}, ${textY})`}
              style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {nak.name[locale]}
            </text>
            <circle cx={dotX} cy={dotY} r="3" fill="#d4a853" opacity="0.5" />
          </motion.g>
        );
      })}

      <circle cx="250" cy="250" r="70" fill="#0a0e27" stroke="rgba(212,168,83,0.1)" strokeWidth="0.5" />
      <text x="250" y="240" fill="#f0d48a" fontSize="14" textAnchor="middle" fontFamily="var(--font-heading)">
        {locale === 'en' ? 'ECLIPTIC' : locale === 'hi' ? 'क्रान्तिवृत्त' : 'क्रान्तिवृत्तम्'}
      </text>
      <text x="250" y="260" fill="rgba(212,168,83,0.5)" fontSize="9" textAnchor="middle">
        360° / 27 = 13°20&apos;
      </text>
    </motion.svg>
  );
}


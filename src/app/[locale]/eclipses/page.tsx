'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import type { Locale } from '@/types/panchang';

interface EclipseEvent {
  type: 'solar' | 'lunar';
  typeName: { en: string; hi: string; sa: string };
  date: string;
  magnitude: string;
  magnitudeName: { en: string; hi: string; sa: string };
  description: { en: string; hi: string; sa: string };
}

export default function EclipsesPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [year, setYear] = useState(new Date().getFullYear());
  const [eclipses, setEclipses] = useState<EclipseEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/eclipses?year=${year}`)
      .then(r => r.json())
      .then(data => {
        setEclipses(data.eclipses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(locale === 'en' ? 'en-IN' : 'hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">
            {locale === 'en' ? 'Eclipse Calendar' : 'ग्रहण पञ्चाङ्ग'}
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'Solar and Lunar eclipses with Grahan Kaal significance'
            : 'सूर्य एवं चन्द्र ग्रहण तथा ग्रहण काल का महत्त्व'}
        </p>
      </motion.div>

      {/* Year selector */}
      <div className="flex items-center justify-center gap-6 mb-10">
        <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronLeft className="w-5 h-5 text-gold-primary" />
        </button>
        <span className="text-4xl font-bold text-gold-gradient" style={headingFont}>{year}</span>
        <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronRight className="w-5 h-5 text-gold-primary" />
        </button>
      </div>

      {/* Grahan Kaal & Sutak Explained */}
      <InfoBlock
        id="eclipse-grahan-kaal"
        title={locale === 'en' ? 'What is Grahan Kaal & Sutak? What should you do during an eclipse?' : 'ग्रहण काल और सूतक क्या है? ग्रहण में क्या करें?'}
        defaultOpen={false}
      >
        {locale === 'en' ? (
          <div className="space-y-3">
            <p><strong>Grahan Kaal</strong> is the duration of the eclipse itself — from the moment the shadow first touches the Sun/Moon to the moment it leaves. During this period, the luminaries (Sun or Moon) are considered weakened, which affects their significations in your life.</p>
            <p><strong>Sutak Period</strong> is the preparatory restriction period <em>before</em> the eclipse:</p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-amber-300">Solar Eclipse (Surya Grahan)</strong> — Sutak begins <strong>12 hours</strong> before the eclipse. The Sun governs vitality, authority, and the father.</li>
              <li><strong className="text-indigo-300">Lunar Eclipse (Chandra Grahan)</strong> — Sutak begins <strong>9 hours</strong> before the eclipse. The Moon governs mind, emotions, and the mother.</li>
            </ul>
            <p><strong>What to do during Sutak & Grahan Kaal:</strong></p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>Chant mantras (Maha Mrityunjaya, Gayatri, or your Ishta Devata mantra)</li>
              <li>Meditate and practice pranayama</li>
              <li>Take a bath after the eclipse ends (purification)</li>
              <li>Donate food, clothes, or money after the eclipse</li>
            </ul>
            <p><strong>What to avoid:</strong></p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>Do not eat during Sutak (especially cooked food) — pre-cooked food with Tulsi/Kusha grass is acceptable</li>
              <li>Do not start new ventures, sign contracts, or make major decisions</li>
              <li>Pregnant women should stay indoors and avoid using sharp objects</li>
              <li>Do not look at the eclipse directly (especially solar)</li>
            </ul>
            <p className="text-text-secondary/60 text-xs">Note: Sutak rules are observed when the eclipse is visible from your location. If not visible, Sutak is not applicable but meditation is still recommended.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>ग्रहण काल</strong> वह अवधि है जब ग्रहण चल रहा हो। इस दौरान सूर्य/चन्द्र कमज़ोर माने जाते हैं।</p>
            <p><strong>सूतक काल</strong> ग्रहण से पहले की प्रतिबन्ध अवधि है:</p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-amber-300">सूर्य ग्रहण</strong> — सूतक ग्रहण से <strong>12 घंटे</strong> पहले शुरू।</li>
              <li><strong className="text-indigo-300">चन्द्र ग्रहण</strong> — सूतक ग्रहण से <strong>9 घंटे</strong> पहले शुरू।</li>
            </ul>
            <p><strong>क्या करें:</strong> मन्त्र जाप (महामृत्युंजय, गायत्री), ध्यान, प्राणायाम, ग्रहण बाद स्नान और दान।</p>
            <p><strong>क्या न करें:</strong> सूतक में भोजन (विशेषकर पका हुआ), नए कार्य, बड़े निर्णय, गर्भवती महिलाएं घर में रहें, ग्रहण सीधे न देखें।</p>
            <p className="text-text-secondary/60 text-xs">नोट: सूतक नियम तभी लागू होते हैं जब ग्रहण आपके स्थान से दृश्य हो।</p>
          </div>
        )}
      </InfoBlock>

      <GoldDivider />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : eclipses.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <div className="text-6xl mb-4 opacity-30">
            <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#d4a853" strokeWidth="2" strokeOpacity="0.3" />
              <circle cx="50" cy="50" r="38" fill="#0a0e27" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#d4a853" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
          <p className="text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {locale === 'en' ? 'No eclipses detected for this year.' : 'इस वर्ष कोई ग्रहण नहीं पाया गया।'}
          </p>
        </div>
      ) : (
        <div className="space-y-6 my-10">
          {eclipses.map((eclipse, i) => {
            const isSolar = eclipse.type === 'solar';
            const borderColor = isSolar ? 'border-amber-500/30' : 'border-indigo-500/30';
            const bgColor = isSolar ? 'from-amber-500/10 to-transparent' : 'from-indigo-500/10 to-transparent';
            const accentColor = isSolar ? 'text-amber-400' : 'text-indigo-400';
            const badgeColor = isSolar ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400';

            return (
              <motion.div
                key={`${eclipse.date}-${eclipse.type}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 border-2 ${borderColor} bg-gradient-to-br ${bgColor}`}
              >
                {/* Eclipse icon */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <svg viewBox="0 0 80 80" className="w-20 h-20">
                      {isSolar ? (
                        <>
                          <circle cx="40" cy="40" r="30" fill="#f59e0b" opacity="0.15" />
                          <circle cx="40" cy="40" r="25" fill="#0a0e27" />
                          <circle cx="40" cy="40" r="30" fill="none" stroke="#f59e0b" strokeWidth="2" />
                          <circle cx="40" cy="40" r="26" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3 3" />
                          {/* Corona rays */}
                          {Array.from({ length: 12 }).map((_, j) => {
                            const angle = (j * 30 * Math.PI) / 180;
                            return (
                              <line key={j} x1={40 + 32 * Math.cos(angle)} y1={40 + 32 * Math.sin(angle)}
                                x2={40 + 38 * Math.cos(angle)} y2={40 + 38 * Math.sin(angle)}
                                stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.5" />
                            );
                          })}
                        </>
                      ) : (
                        <>
                          <circle cx="40" cy="40" r="28" fill="#818cf8" opacity="0.15" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#818cf8" strokeWidth="2" />
                          <path d="M 40 12 A 28 28 0 0 1 40 68" fill="#0a0e27" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 3" />
                        </>
                      )}
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className={`text-2xl font-bold ${accentColor}`} style={headingFont}>
                        {eclipse.typeName[locale]}
                      </h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${badgeColor}`}>
                        {eclipse.magnitudeName[locale]}
                      </span>
                    </div>
                    <div className="text-gold-light text-lg font-mono mb-4">{formatDate(eclipse.date)}</div>
                    <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {eclipse.description[locale]}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div className="text-center text-text-secondary text-sm mt-6">
            {eclipses.length} {locale === 'en' ? 'eclipse(s) this year' : 'ग्रहण इस वर्ष'}
          </div>
        </div>
      )}
    </div>
  );
}

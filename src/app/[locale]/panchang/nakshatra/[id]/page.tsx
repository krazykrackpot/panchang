'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_DETAILS } from '@/lib/constants/nakshatra-details';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import type { Locale } from '@/types/panchang';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function NakshatraDetailPage() {
  const params = useParams();
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const id = parseInt(params.id as string, 10);
  const nak = NAKSHATRAS[id - 1];
  const detail = NAKSHATRA_DETAILS.find(d => d.id === id);

  if (!nak || !detail) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary text-lg">Nakshatra not found.</p>
        <Link href="/panchang/nakshatra" className="text-gold-primary hover:text-gold-light mt-4 inline-block">
          &larr; {locale === 'en' || String(locale) === 'ta' ? 'Back to Nakshatras' : 'नक्षत्रों पर वापस'}
        </Link>
      </div>
    );
  }

  const prevId = id > 1 ? id - 1 : 27;
  const nextId = id < 27 ? id + 1 : 1;
  const prevNak = NAKSHATRAS[prevId - 1];
  const nextNak = NAKSHATRAS[nextId - 1];

  const sections = [
    { title: locale === 'en' || String(locale) === 'ta' ? 'Meaning & Etymology' : 'अर्थ और व्युत्पत्ति', content: detail.meaning[locale], color: 'gold-primary' },
    { title: locale === 'en' || String(locale) === 'ta' ? 'Mythology & Legend' : 'पौराणिक कथा', content: detail.mythology[locale], color: 'gold-light' },
    { title: locale === 'en' || String(locale) === 'ta' ? 'Significance' : 'महत्व', content: detail.significance[locale], color: 'emerald-400' },
    { title: locale === 'en' || String(locale) === 'ta' ? 'Personality & Characteristics' : 'व्यक्तित्व और विशेषताएं', content: detail.characteristics[locale], color: 'gold-primary' },
    { title: locale === 'en' || String(locale) === 'ta' ? 'Favorable Activities' : 'अनुकूल गतिविधियां', content: detail.compatibleActivities[locale], color: 'emerald-400' },
    { title: locale === 'en' || String(locale) === 'ta' ? 'Remedies & Worship' : 'उपाय और पूजा', content: detail.remedies[locale], color: 'indigo-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Navigation */}
      <Link href="/panchang/nakshatra" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {locale === 'en' || String(locale) === 'ta' ? 'All Nakshatras' : 'सभी नक्षत्र'}
      </Link>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 sm:p-10 mb-10 border-2 border-gold-primary/20"
      >
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex-shrink-0"
          >
            <NakshatraIconById id={id} size={120} />
          </motion.div>
          <div className="text-center sm:text-left flex-1">
            <div className="text-gold-dark text-sm font-mono mb-2">
              #{id} of 27 · {nak.startDeg.toFixed(1)}° — {nak.endDeg.toFixed(1)}°
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={headingFont}>
              <span className="text-gold-gradient">{nak.name[locale]}</span>
            </h1>
            {locale === 'en' && (
              <p className="text-gold-dark text-lg mb-2" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>
                {nak.name.sa}
              </p>
            )}
            <p className="text-text-secondary text-lg italic" style={bodyFont}>
              &ldquo;{detail.meaning[locale]}&rdquo;
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: locale === 'en' || String(locale) === 'ta' ? 'Deity' : 'देवता', value: nak.deity[locale] },
          { label: locale === 'en' || String(locale) === 'ta' ? 'Ruler' : 'स्वामी', value: nak.rulerName[locale] },
          { label: locale === 'en' || String(locale) === 'ta' ? 'Nature' : 'स्वभाव', value: nak.nature[locale] },
          { label: locale === 'en' || String(locale) === 'ta' ? 'Gana' : 'गण', value: detail.gana[locale] },
          { label: locale === 'en' || String(locale) === 'ta' ? 'Guna' : 'गुण', value: detail.guna[locale] },
          { label: locale === 'en' || String(locale) === 'ta' ? 'Tattva' : 'तत्व', value: detail.tattva[locale] },
          { label: locale === 'en' || String(locale) === 'ta' ? 'Animal' : 'पशु', value: detail.associatedAnimal[locale] },
          { label: locale === 'en' || String(locale) === 'ta' ? 'Degrees' : 'अंश', value: `${nak.startDeg.toFixed(1)}° — ${nak.endDeg.toFixed(1)}°` },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 text-center"
          >
            <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1">{item.label}</div>
            <div className="text-gold-light text-sm font-semibold" style={bodyFont}>{item.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Ganda Mula Notice */}
      {[1, 9, 10, 18, 19, 27].includes(id) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-amber-400 font-bold text-sm">!</span>
            </div>
            <div>
              <h4 className="text-amber-300 font-semibold text-sm mb-1" style={headingFont}>
                {locale === 'en' || String(locale) === 'ta' ? 'Ganda Mula Nakshatra' : 'गण्ड मूल नक्षत्र'}
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                {locale === 'en'
                  ? `${nak.name.en} is one of the 6 Ganda Mula nakshatras — positioned at a water-fire sign junction. Birth in this nakshatra may require a Ganda Mula Shanti Puja. The effects and remedies depend on the birth pada.`
                  : `${nak.name.hi} 6 गण्ड मूल नक्षत्रों में से एक है — जल-अग्नि राशि सन्धि पर स्थित। इस नक्षत्र में जन्म के लिए गण्ड मूल शान्ति पूजा आवश्यक हो सकती है। प्रभाव और उपाय जन्म पाद पर निर्भर करते हैं।`}
              </p>
              <Link
                href="/learn/modules/24-1"
                className="inline-block mt-2 text-xs text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-2"
              >
                {locale === 'en' || String(locale) === 'ta' ? 'Learn about Ganda Mula Nakshatras & Remedies →' : 'गण्ड मूल नक्षत्र और उपाय जानें →'}
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      <GoldDivider />

      {/* Content Sections */}
      <div className="space-y-8 my-10">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <h2 className={`text-2xl font-bold text-${section.color} mb-4`} style={headingFont}>
              {section.title}
            </h2>
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6">
              <p className="text-text-secondary text-base leading-relaxed" style={bodyFont}>
                {section.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <GoldDivider />

      {/* Pada Information */}
      <section className="my-10">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {locale === 'en' || String(locale) === 'ta' ? 'Four Padas (Quarters)' : 'चार पाद'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(pada => {
            const padaDeg = 3.333;
            const start = nak.startDeg + (pada - 1) * padaDeg;
            const end = start + padaDeg;
            const navamshaRashi = ((id - 1) * 4 + (pada - 1)) % 12 + 1;
            const rashiNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
            const rashiNamesHi = ['मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'];
            return (
              <motion.div
                key={pada}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: pada * 0.1 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 text-center"
              >
                <div className="text-gold-primary text-3xl font-bold mb-2">{pada}</div>
                <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">
                  {locale === 'en' || String(locale) === 'ta' ? `Pada ${pada}` : `पाद ${pada}`}
                </div>
                <div className="text-text-secondary text-xs font-mono mb-1">
                  {start.toFixed(2)}° — {end.toFixed(2)}°
                </div>
                <div className="text-gold-light text-sm font-semibold" style={bodyFont}>
                  {locale === 'en' || String(locale) === 'ta' ? `Navamsha: ${rashiNames[navamshaRashi - 1]}` : `नवांश: ${rashiNamesHi[navamshaRashi - 1]}`}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <GoldDivider />

      {/* Navigation to prev/next */}
      <div className="flex justify-between items-center my-10">
        <Link
          href={`/panchang/nakshatra/${prevId}`}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 flex items-center gap-3 hover:border-gold-primary/40 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 text-gold-primary group-hover:-translate-x-1 transition-transform" />
          <div>
            <div className="text-gold-dark text-xs">{locale === 'en' || String(locale) === 'ta' ? 'Previous' : 'पिछला'}</div>
            <div className="text-gold-light font-semibold text-sm" style={bodyFont}>{prevNak.name[locale]}</div>
          </div>
        </Link>
        <Link
          href={`/panchang/nakshatra/${nextId}`}
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 flex items-center gap-3 hover:border-gold-primary/40 transition-all group"
        >
          <div className="text-right">
            <div className="text-gold-dark text-xs">{locale === 'en' || String(locale) === 'ta' ? 'Next' : 'अगला'}</div>
            <div className="text-gold-light font-semibold text-sm" style={bodyFont}>{nextNak.name[locale]}</div>
          </div>
          <ArrowRight className="w-5 h-5 text-gold-primary group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

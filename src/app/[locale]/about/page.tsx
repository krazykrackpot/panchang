'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { generatePersonLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

export default function AboutPage() {
  const t = useTranslations('about');
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const sections = [
    {
      title: { en: 'The Surya Siddhanta', hi: 'सूर्य सिद्धान्त', sa: 'सूर्यसिद्धान्तः' },
      content: {
        en: 'The Surya Siddhanta (c. 400 CE) is one of the most remarkable astronomical texts in human history. It accurately calculates the sidereal year at 365.2563627 days — a figure astonishingly close to the modern value of 365.25636 days. It provides precise formulas for planetary positions, eclipse predictions, and the precession of equinoxes.',
        hi: 'सूर्य सिद्धान्त (लगभग 400 ई.) मानव इतिहास के सबसे उल्लेखनीय खगोलीय ग्रन्थों में से एक है। यह नाक्षत्र वर्ष की गणना 365.2563627 दिनों पर करता है — जो आधुनिक मान के आश्चर्यजनक रूप से निकट है।',
        sa: 'सूर्यसिद्धान्तः (लगभग 400 ई.) मानवेतिहासस्य उल्लेखनीयतमेषु खगोलीयग्रन्थेषु एकः।',
      },
    },
    {
      title: { en: 'Aryabhata\'s Revolution', hi: 'आर्यभट की क्रान्ति', sa: 'आर्यभटस्य क्रान्तिः' },
      content: {
        en: 'Aryabhata (476 CE) proposed that the Earth rotates on its axis — over a millennium before Copernicus. His Aryabhatiya contains sophisticated sine tables, pi accurate to 4 decimal places (3.1416), and algorithms for planetary calculations still admired today.',
        hi: 'आर्यभट (476 ई.) ने प्रस्तावित किया कि पृथ्वी अपनी धुरी पर घूमती है — कॉपरनिकस से एक सहस्राब्दी पहले।',
        sa: 'आर्यभटः (476 ई.) प्रस्तावितवान् यत् पृथिवी स्वधुर्यां भ्रमति — कोपर्निकात् सहस्राब्दपूर्वम्।',
      },
    },
    {
      title: { en: 'The Panchang System', hi: 'पञ्चाङ्ग प्रणाली', sa: 'पञ्चाङ्गप्रणाली' },
      content: {
        en: 'The Panchang ("five limbs") is a lunisolar calendar tracking five astronomical elements: Tithi (lunar day), Nakshatra (lunar mansion), Yoga (luni-solar angle), Karana (half-tithi), and Vara (weekday). It simultaneously tracks the Moon\'s position relative to the Sun and against fixed stars.',
        hi: 'पञ्चाङ्ग ("पाँच अंग") एक चान्द्र-सौर कालदर्शिका है जो प्रतिदिन पाँच खगोलीय तत्वों को ट्रैक करती है।',
        sa: 'पञ्चाङ्गम् ("पञ्चाङ्गानि") एका चान्द्रसौरकालदर्शिका या पञ्च खगोलीयतत्त्वानि अनुसरति।',
      },
    },
    {
      title: { en: 'Ayanamsha: The Critical Correction', hi: 'अयनांश: महत्वपूर्ण सुधार', sa: 'अयनांशः: संशोधनः' },
      content: {
        en: 'Indian astronomy accounts for precession of equinoxes through Ayanamsha — the angular difference between tropical and sidereal zodiacs. This ~50.3 arc-seconds/year precession completes one cycle in ~25,920 years. The Lahiri Ayanamsha is ~24 degrees currently.',
        hi: 'भारतीय खगोल विज्ञान अयनांश के माध्यम से विषुव अयन गति का हिसाब रखता है।',
        sa: 'भारतीयखगोलविज्ञानम् अयनांशेन विषुवायनगतेः हिसाबं करोति।',
      },
    },
    {
      title: { en: 'Eclipses: Predictive Power', hi: 'ग्रहण: भविष्यवाणी शक्ति', sa: 'ग्रहणम्: भविष्यवाणीशक्तिः' },
      content: {
        en: 'Indian astronomers identified Rahu and Ketu as the ascending and descending nodes of the Moon\'s orbit — where eclipses occur. The Saros cycle (~18 years) was independently discovered. Ancient eclipse computation tables show remarkable accuracy when verified against modern calculations.',
        hi: 'भारतीय खगोलविदों ने राहु-केतु को चन्द्रमा की कक्षा के पात बिन्दुओं के रूप में पहचाना।',
        sa: 'भारतीयखगोलविदः राहुकेतू चन्द्रकक्षायाः पातबिन्दून् इति अभिज्ञातवन्तः।',
      },
    },
  ];

  const authorSection = {
    en: {
      heading: 'About the Author',
      intro: 'Dekho Panchang is built and maintained by',
      name: 'Aditya Kumar',
      heritage: 'a Maithil Brahmin with deep roots in the Vedic tradition.',
      mission: 'This project was born from a simple conviction: that the astronomical and astrological wisdom preserved in texts like the Surya Siddhanta and Brihat Parashara Hora Shastra deserves to be accessible to everyone — not locked behind paywalls or simplified beyond recognition.',
      approach: 'Every calculation on this site is done from first principles. Planetary positions use Jean Meeus\'s astronomical algorithms. Panchang elements are computed using classical Jyotish rules. There are no external astrology APIs — just mathematics, the same mathematics our ancestors encoded thousands of years ago, now running in your browser.',
      closing: 'This is a passion project, not a corporation. If you find value in it, that is the best reward.',
    },
    hi: {
      heading: 'लेखक के बारे में',
      intro: 'देखो पञ्चाङ्ग का निर्माण और रखरखाव',
      name: 'आदित्य कुमार',
      heritage: 'द्वारा किया जाता है — एक मैथिल ब्राह्मण जिनकी जड़ें वैदिक परम्परा में गहरी हैं।',
      mission: 'यह परियोजना एक सरल विश्वास से जन्मी है: सूर्य सिद्धान्त और बृहत् पराशर होरा शास्त्र जैसे ग्रन्थों में संरक्षित खगोलीय और ज्योतिषीय ज्ञान सभी के लिए सुलभ होना चाहिए — पेवॉल के पीछे बन्द नहीं, और न ही पहचान से परे सरलीकृत।',
      approach: 'इस साइट पर प्रत्येक गणना मूल सिद्धान्तों से की जाती है। ग्रहों की स्थिति जीन मीउस के खगोलीय एल्गोरिदम पर आधारित है। पञ्चाङ्ग तत्व शास्त्रीय ज्योतिष नियमों से गणित हैं। कोई बाहरी ज्योतिष API नहीं — केवल गणित, वही गणित जो हमारे पूर्वजों ने सहस्रों वर्ष पूर्व संहिताबद्ध किया था।',
      closing: 'यह एक जुनून की परियोजना है, कोई निगम नहीं। यदि आपको इसमें मूल्य मिलता है, तो वही सबसे बड़ा पुरस्कार है।',
    },
  };

  const a = (authorSection as Record<string, typeof authorSection.en>)[locale] || authorSection.en;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Person JSON-LD — E-E-A-T signal */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(generatePersonLD()) }}
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg">{t('subtitle')}</p>
      </motion.div>

      {/* Author Section — E-E-A-T */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>{a.heading}</h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 space-y-4">
          <p className="text-text-secondary leading-relaxed text-lg">
            {a.intro} <span className="text-gold-light font-semibold">{a.name}</span> — {a.heritage}
          </p>
          <p className="text-text-secondary leading-relaxed text-lg">{a.mission}</p>
          <p className="text-text-secondary leading-relaxed text-lg">{a.approach}</p>
          <p className="text-text-secondary leading-relaxed text-lg italic">{a.closing}</p>
        </div>
      </motion.section>

      <GoldDivider className="mb-12" />

      <div className="space-y-12">
        {sections.map((section, i) => (
          <motion.section key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <h2 className="text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>{(section.title as Record<string, string>)[locale] || section.title.en}</h2>
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
              <p className="text-text-secondary leading-relaxed text-lg">{(section.content as Record<string, string>)[locale] || section.content.en}</p>
            </div>
            {i < sections.length - 1 && <GoldDivider className="mt-8" />}
          </motion.section>
        ))}
      </div>
    </div>
  );
}

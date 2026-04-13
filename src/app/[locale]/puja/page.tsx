'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PUJA_VIDHIS } from '@/lib/constants/puja-vidhi';
import GoldDivider from '@/components/ui/GoldDivider';
import type { Locale , LocaleText} from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const LABELS = {
  en: {
    title: 'Puja Vidhi',
    subtitle: 'Step-by-step guides for Hindu festivals and vrats with mantras, samagri lists, and procedures.',
    festivals: 'Festivals',
    vrats: 'Vrats',
    grahaShanti: 'Graha Shanti',
    grahaShantiSubtitle: 'Planetary Remedies',
    grahaShantiDesc: 'Remedial pujas to pacify afflicted or weak planets in your horoscope. Each vidhi includes specific mantras, homam procedures, and dana (charity) prescriptions for the respective graha.',
    grahaShantiCta: 'Generate your Kundali to see personalized recommendations',
    viewVidhi: 'View Vidhi',
  },
  hi: {
    title: 'पूजा विधि',
    subtitle: 'हिन्दू त्योहारों और व्रतों की चरणबद्ध विधि — मन्त्र, सामग्री सूची और प्रक्रिया सहित।',
    festivals: 'त्योहार',
    vrats: 'व्रत',
    grahaShanti: 'ग्रह शान्ति',
    grahaShantiSubtitle: 'ग्रह उपचार',
    grahaShantiDesc: 'कुण्डली में पीड़ित या दुर्बल ग्रहों की शान्ति हेतु उपचारात्मक पूजाएँ। प्रत्येक विधि में सम्बन्धित ग्रह के विशिष्ट मन्त्र, होमम् प्रक्रिया और दान विधान सम्मिलित हैं।',
    grahaShantiCta: 'व्यक्तिगत अनुशंसा हेतु अपनी कुण्डली बनाएँ',
    viewVidhi: 'विधि देखें',
  },
  sa: {
    title: 'पूजाविधिः',
    subtitle: 'हिन्दूत्सवानां व्रतानां च क्रमशः विधिः — मन्त्रैः सामग्रीसूच्या प्रक्रियया च सह।',
    festivals: 'उत्सवाः',
    vrats: 'व्रतानि',
    grahaShanti: 'ग्रहशान्तिः',
    grahaShantiSubtitle: 'ग्रहोपचाराः',
    grahaShantiDesc: 'जातककुण्डल्यां पीडितानां दुर्बलानां वा ग्रहाणां शान्त्यर्थम् उपचारपूजाः। प्रत्येकस्यां विधौ तद्ग्रहस्य विशिष्टमन्त्राः होमविधिः दानविधानं च अन्तर्भवन्ति।',
    grahaShantiCta: 'व्यक्तिगतानुशंसनार्थं स्वकुण्डलीं रचयतु',
    viewVidhi: 'विधिं पश्यतु',
  },
  ta: {
    title: 'பூஜை விதி',
    subtitle: 'இந்து பண்டிகைகள் மற்றும் விரதங்களுக்கான படிப்படியான வழிகாட்டி — மந்திரங்கள், சாமக்ரி பட்டியல் மற்றும் நடைமுறைகள்.',
    festivals: 'பண்டிகைகள்',
    vrats: 'விரதங்கள்',
    grahaShanti: 'கிரக சாந்தி',
    grahaShantiSubtitle: 'கிரக பரிகாரங்கள்',
    grahaShantiDesc: 'உங்கள் ஜாதகத்தில் பாதிக்கப்பட்ட அல்லது பலவீனமான கிரகங்களை சாந்தப்படுத்தும் பரிகார பூஜைகள்.',
    grahaShantiCta: 'தனிப்பட்ட பரிந்துரைகளுக்கு உங்கள் குண்டலியை உருவாக்கவும்',
    viewVidhi: 'விதியைக் காண்க',
  },
  te: {
    title: 'పూజా విధి',
    subtitle: 'హిందూ పండుగలు మరియు వ్రతాల కోసం దశల వారీ మార్గదర్శి — మంత్రాలు, సామగ్రి జాబితా మరియు విధానాలతో.',
    festivals: 'పండుగలు',
    vrats: 'వ్రతాలు',
    grahaShanti: 'గ్రహ శాంతి',
    grahaShantiSubtitle: 'గ్రహ పరిహారాలు',
    grahaShantiDesc: 'మీ జాతకంలో బాధిత లేదా బలహీన గ్రహాలను శాంతింప చేసే పరిహార పూజలు.',
    grahaShantiCta: 'వ్యక్తిగత సిఫార్సుల కోసం మీ జాతకం రూపొందించండి',
    viewVidhi: 'విధి చూడండి',
  },
  bn: {
    title: 'পূজা বিধি',
    subtitle: 'হিন্দু উৎসব ও ব্রতের জন্য ধাপে ধাপে গাইড — মন্ত্র, সামগ্রী তালিকা ও পদ্ধতি সহ।',
    festivals: 'উৎসব',
    vrats: 'ব্রত',
    grahaShanti: 'গ্রহ শান্তি',
    grahaShantiSubtitle: 'গ্রহ প্রতিকার',
    grahaShantiDesc: 'আপনার জাতকে পীড়িত বা দুর্বল গ্রহ শান্ত করার প্রতিকার পূজা।',
    grahaShantiCta: 'ব্যক্তিগত পরামর্শের জন্য আপনার জাতক তৈরি করুন',
    viewVidhi: 'বিধি দেখুন',
  },
  kn: {
    title: 'ಪೂಜಾ ವಿಧಿ',
    subtitle: 'ಹಿಂದೂ ಹಬ್ಬಗಳು ಮತ್ತು ವ್ರತಗಳಿಗೆ ಹಂತ ಹಂತವಾಗಿ ಮಾರ್ಗದರ್ಶಿ — ಮಂತ್ರಗಳು, ಸಾಮಗ್ರಿ ಪಟ್ಟಿ ಮತ್ತು ಕಾರ್ಯವಿಧಾನಗಳೊಂದಿಗೆ.',
    festivals: 'ಹಬ್ಬಗಳು',
    vrats: 'ವ್ರತಗಳು',
    grahaShanti: 'ಗ್ರಹ ಶಾಂತಿ',
    grahaShantiSubtitle: 'ಗ್ರಹ ಪರಿಹಾರಗಳು',
    grahaShantiDesc: 'ನಿಮ್ಮ ಜಾತಕದಲ್ಲಿ ಪೀಡಿತ ಅಥವಾ ದುರ್ಬಲ ಗ್ರಹಗಳನ್ನು ಶಾಂತಿಗೊಳಿಸುವ ಪರಿಹಾರ ಪೂಜೆಗಳು.',
    grahaShantiCta: 'ವೈಯಕ್ತಿಕ ಶಿಫಾರಸುಗಳಿಗಾಗಿ ನಿಮ್ಮ ಜಾತಕ ರಚಿಸಿ',
    viewVidhi: 'ವಿಧಿ ನೋಡಿ',
  },
  mr: {
    title: 'पूजा विधी',
    subtitle: 'हिंदू सणांसाठी आणि व्रतांसाठी टप्प्याटप्प्याने मार्गदर्शक — मंत्र, सामग्री यादी आणि प्रक्रिया.',
    festivals: 'सण',
    vrats: 'व्रत',
    grahaShanti: 'ग्रह शांती',
    grahaShantiSubtitle: 'ग्रह उपाय',
    grahaShantiDesc: 'आपल्या कुंडलीतील पीडित किंवा दुर्बल ग्रहांना शांत करण्यासाठी उपचारात्मक पूजा.',
    grahaShantiCta: 'वैयक्तिक शिफारशींसाठी आपली कुंडली बनवा',
    viewVidhi: 'विधी पहा',
  },
  gu: {
    title: 'પૂજા વિધિ',
    subtitle: 'હિંદુ તહેવારો અને વ્રતો માટે પગલે પગલે માર્ગદર્શિકા — મંત્રો, સામગ્રી યાદી અને પ્રક્રિયા.',
    festivals: 'તહેવારો',
    vrats: 'વ્રત',
    grahaShanti: 'ગ્રહ શાંતિ',
    grahaShantiSubtitle: 'ગ્રહ ઉપાયો',
    grahaShantiDesc: 'તમારી કુંડળીમાં પીડિત અથવા નબળા ગ્રહોને શાંત કરવા ઉપચારાત્મક પૂજાઓ.',
    grahaShantiCta: 'વ્યક્તિગત ભલામણો માટે તમારી કુંડળી બનાવો',
    viewVidhi: 'વિધિ જુઓ',
  },
  mai: {
    title: 'पूजा विधि',
    subtitle: 'हिन्दू पर्व आ व्रतक लेल चरणबद्ध विधि — मंत्र, सामग्री सूची आ प्रक्रिया सहित.',
    festivals: 'पर्व',
    vrats: 'व्रत',
    grahaShanti: 'ग्रह शांति',
    grahaShantiSubtitle: 'ग्रह उपाय',
    grahaShantiDesc: 'कुंडलीमे पीड़ित या दुर्बल ग्रहक शांतिक लेल उपचारात्मक पूजा.',
    grahaShantiCta: 'व्यक्तिगत अनुशंसाक लेल अपन कुंडली बनाउ',
    viewVidhi: 'विधि देखू',
  },
} as Record<string, Record<string, string>>;

const CARD_GRADIENTS = [
  'from-amber-500/8 via-orange-500/5 to-transparent',
  'from-rose-500/8 via-pink-500/5 to-transparent',
  'from-[#2d1b69]/30 via-[#1a1040]/20 to-transparent',
  'from-emerald-500/8 via-teal-500/5 to-transparent',
  'from-purple-500/8 via-violet-500/5 to-transparent',
  'from-[#2d1b69]/25 via-purple-900/15 to-transparent',
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function PujaCard({
  deity,
  slug,
  category,
  locale,
  index,
  viewLabel,
}: {
  deity: LocaleText;
  slug: string;
  category: string;
  locale: Locale;
  index: number;
  viewLabel: string;
}) {
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <motion.div
      variants={fadeInUp}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' as const }}
    >
      <Link href={`/${locale}/puja/${slug}`} className="block group">
        <div
          className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 hover:border-gold-primary/25 transition-all duration-300 hover:shadow-lg hover:shadow-gold-primary/5`}
        >
          <h3
            className="text-gold-light font-bold text-lg mb-1 group-hover:text-gold-primary transition-colors"
            style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
          >
            {deity[locale]}
          </h3>
          {locale !== 'en' && (
            <p className="text-text-secondary/65 text-xs mb-3">{deity.en}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                category === 'festival'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                  : category === 'graha_shanti'
                    ? 'bg-purple-500/15 text-purple-400 border-purple-500/25'
                    : 'bg-blue-500/15 text-blue-400 border-blue-500/25'
              }`}
            >
              {category === 'festival'
                ? !isDevanagariLocale(locale) ? 'Festival' : isDevanagari ? 'त्योहार' : 'उत्सवः'
                : category === 'graha_shanti'
                  ? !isDevanagariLocale(locale) ? 'Graha Shanti' : isDevanagari ? 'ग्रह शान्ति' : 'ग्रहशान्तिः'
                  : !isDevanagariLocale(locale) ? 'Vrat' : isDevanagari ? 'व्रत' : 'व्रतम्'}
            </span>
            <span className="text-gold-primary/60 text-xs group-hover:text-gold-primary transition-colors">
              {viewLabel} &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function PujaIndexPage() {
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const l = (LABELS as Record<string, Record<string, string>>)[locale] || LABELS.en;

  const allPujas = Object.values(PUJA_VIDHIS);
  const festivals = allPujas.filter((p) => p.category === 'festival');
  const vrats = allPujas.filter((p) => p.category === 'vrat');
  const grahaShanti = allPujas.filter((p) => p.category === 'graha_shanti');

  return (
    <main className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="text-center mb-10"
        >
          <h1
            className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark bg-clip-text text-transparent mb-4"
            style={headingFont}
          >
            {l.title}
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto text-sm sm:text-base">
            {l.subtitle}
          </p>
        </motion.div>

        <GoldDivider />

        {/* Festivals */}
        {festivals.length > 0 && (
          <section className="mt-10 mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' as const }}
              className="text-xl font-bold text-gold-light mb-5"
              style={headingFont}
            >
              {l.festivals}
            </motion.h2>
            <motion.div
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {festivals.map((puja, idx) => (
                <PujaCard
                  key={puja.festivalSlug}
                  deity={puja.deity}
                  slug={puja.festivalSlug}
                  category={puja.category}
                  locale={locale}
                  index={idx}
                  viewLabel={l.viewVidhi}
                />
              ))}
            </motion.div>
          </section>
        )}

        {/* Vrats */}
        {vrats.length > 0 && (
          <section className="mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' as const }}
              className="text-xl font-bold text-gold-light mb-5"
              style={headingFont}
            >
              {l.vrats}
            </motion.h2>
            <motion.div
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {vrats.map((puja, idx) => (
                <PujaCard
                  key={puja.festivalSlug}
                  deity={puja.deity}
                  slug={puja.festivalSlug}
                  category={puja.category}
                  locale={locale}
                  index={idx}
                  viewLabel={l.viewVidhi}
                />
              ))}
            </motion.div>
          </section>
        )}

        {/* Graha Shanti */}
        {grahaShanti.length > 0 && (
          <section className="mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' as const }}
              className="text-xl font-bold text-gold-light mb-1"
              style={headingFont}
            >
              {l.grahaShanti}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' as const }}
              className="text-purple-400 text-sm font-semibold mb-3"
            >
              {l.grahaShantiSubtitle}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' as const }}
              className="text-text-secondary text-sm mb-5 max-w-2xl"
            >
              {l.grahaShantiDesc}
            </motion.p>
            <motion.div
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {grahaShanti.map((puja, idx) => (
                <PujaCard
                  key={puja.festivalSlug}
                  deity={puja.deity}
                  slug={puja.festivalSlug}
                  category={puja.category}
                  locale={locale}
                  index={idx}
                  viewLabel={l.viewVidhi}
                />
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' as const }}
              className="mt-6 p-4 rounded-lg border border-purple-500/20 bg-purple-500/5"
            >
              <Link
                href={`/${locale}/kundali`}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
              >
                {l.grahaShantiCta} &rarr;
              </Link>
            </motion.div>
          </section>
        )}
      </div>
    </main>
  );
}

'use client';

import { tl } from '@/lib/utils/trilingual';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Eye, Crown, Users, Compass, ArrowRight, Star, BookOpen, Orbit } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LT from '@/messages/learn/jaimini.json';

/* Labels migrated to src/messages/learn/jaimini.json — accessed via LT + t() */

/* ── Chara Karaka data ────────────────────────────────────────────── */
const CHARA_KARAKAS = [
  { abbr: 'AK', name: { en: 'Atmakaraka', hi: 'आत्मकारक', sa: 'आत्मकारकः' }, rule: { en: 'Highest degree', hi: 'सर्वोच्च अंश', sa: 'सर्वोच्चांशः' }, signifies: { en: 'Soul\'s desire, the SELF. Most important planet in the entire Jaimini chart. Its sign, house, and Navamsha placement reveal the soul\'s deepest longing and spiritual path.', hi: 'आत्मा की इच्छा, स्वयं। सम्पूर्ण जैमिनी कुण्डली में सबसे महत्वपूर्ण ग्रह। इसकी राशि, भाव और नवांश स्थिति आत्मा की गहनतम आकांक्षा को प्रकट करती है।', sa: 'आत्मनः इच्छा, स्वम्। सम्पूर्णजैमिनीकुण्डल्यां सर्वाधिकमहत्त्वपूर्णः ग्रहः।' }, color: '#f0d48a', importance: 'critical' },
  { abbr: 'AmK', name: { en: 'Amatyakaraka', hi: 'अमात्यकारक', sa: 'अमात्यकारकः' }, rule: { en: '2nd highest degree', hi: 'द्वितीय सर्वोच्च अंश', sa: 'द्वितीयसर्वोच्चांशः' }, signifies: { en: 'Career direction, profession, the "minister" who executes the soul\'s desires. Shows what kind of work you are drawn to and how you achieve your goals.', hi: 'करियर दिशा, पेशा, "मन्त्री" जो आत्मा की इच्छाओं को कार्यान्वित करता है। दर्शाता है कि आप किस प्रकार के कार्य की ओर आकर्षित हैं।', sa: 'वृत्तिदिशा, "अमात्यः" यः आत्मनः इच्छाः कार्यान्वयति।' }, color: '#7dd3fc', importance: 'high' },
  { abbr: 'BK', name: { en: 'Bhratrikaraka', hi: 'भ्रातृकारक', sa: 'भ्रातृकारकः' }, rule: { en: '3rd highest degree', hi: 'तृतीय सर्वोच्च अंश', sa: 'तृतीयसर्वोच्चांशः' }, signifies: { en: 'Siblings, courage, initiative. The planet that drives your willpower and relationship with brothers/sisters.', hi: 'भाई-बहन, साहस, पहल। वह ग्रह जो आपकी इच्छाशक्ति और भाई-बहनों के साथ सम्बन्ध को संचालित करता है।', sa: 'भ्रातरः, शौर्यं, पहलम्।' }, color: '#fca5a5', importance: 'medium' },
  { abbr: 'MK', name: { en: 'Matrikaraka', hi: 'मातृकारक', sa: 'मातृकारकः' }, rule: { en: '4th highest degree', hi: 'चतुर्थ सर्वोच्च अंश', sa: 'चतुर्थसर्वोच्चांशः' }, signifies: { en: 'Mother, emotional security, property, education. Reveals the nature of your relationship with your mother and your emotional foundation.', hi: 'माता, भावनात्मक सुरक्षा, सम्पत्ति, शिक्षा। आपकी माँ के साथ सम्बन्ध और भावनात्मक आधार को प्रकट करता है।', sa: 'माता, भावनात्मकसुरक्षा, सम्पत्तिः, शिक्षा।' }, color: '#86efac', importance: 'medium' },
  { abbr: 'PK', name: { en: 'Putrakaraka', hi: 'पुत्रकारक', sa: 'पुत्रकारकः' }, rule: { en: '5th highest degree', hi: 'पञ्चम सर्वोच्च अंश', sa: 'पञ्चमसर्वोच्चांशः' }, signifies: { en: 'Children, creative intelligence, past-life merit (Poorva Punya). The planet shaping your relationship with children and creative expression.', hi: 'सन्तान, सृजनात्मक बुद्धि, पूर्वजन्म पुण्य। वह ग्रह जो सन्तान और सृजनात्मक अभिव्यक्ति को आकार देता है।', sa: 'सन्तानाः, सृजनात्मकबुद्धिः, पूर्वपुण्यम्।' }, color: '#c4b5fd', importance: 'medium' },
  { abbr: 'GK', name: { en: 'Gnatikaraka', hi: 'ज्ञातिकारक', sa: 'ज्ञातिकारकः' }, rule: { en: '6th highest degree', hi: 'षष्ठ सर्वोच्च अंश', sa: 'षष्ठसर्वोच्चांशः' }, signifies: { en: 'Enemies, disease, obstacles, litigation. The planet that brings challenges and tests — but also the strength to overcome them.', hi: 'शत्रु, रोग, बाधाएँ, मुकदमे। वह ग्रह जो चुनौतियाँ और परीक्षाएँ लाता है — लेकिन उन पर विजय पाने की शक्ति भी।', sa: 'शत्रवः, रोगाः, बाधाः। ग्रहः यः आव्हानानि परीक्षाश्च आनयति।' }, color: '#fbbf24', importance: 'medium' },
  { abbr: 'DK', name: { en: 'Darakaraka', hi: 'दारकारक', sa: 'दारकारकः' }, rule: { en: 'Lowest degree', hi: 'न्यूनतम अंश', sa: 'न्यूनतमांशः' }, signifies: { en: 'Spouse, partnerships, business partner. THE planet that describes your future spouse — their nature, appearance, temperament. The Navamsha sign of DK = the kind of partner you attract.', hi: 'जीवनसाथी, साझेदारी। वह ग्रह जो आपके भावी जीवनसाथी का वर्णन करता है — उनका स्वभाव, रूप, मिज़ाज। DK की नवांश राशि = आप किस प्रकार का साथी आकर्षित करते हैं।', sa: 'पत्नी/पतिः, साझेदारी। ग्रहः यः भाविजीवनसहचरं वर्णयति।' }, color: '#f9a8d4', importance: 'high' },
];

/* ── Rashi Drishti rules ──────────────────────────────────────────── */
const RASHI_DRISHTI = [
  { type: { en: 'Movable (Chara)', hi: 'चर राशि', sa: 'चरराशिः' }, signs: { en: 'Aries, Cancer, Libra, Capricorn', hi: 'मेष, कर्क, तुला, मकर', sa: 'मेषः, कर्कटः, तुला, मकरः' }, aspects: { en: 'Aspect all FIXED signs except the adjacent one', hi: 'समीपस्थ को छोड़कर सभी स्थिर राशियों पर दृष्टि', sa: 'समीपस्थां विहाय सर्वस्थिरराशिषु दृष्टिः' }, example: { en: 'Aries aspects Leo, Scorpio, Aquarius (but NOT Taurus — it is adjacent)', hi: 'मेष → सिंह, वृश्चिक, कुम्भ पर दृष्टि (वृषभ नहीं — वह समीपस्थ है)', sa: 'मेषः → सिंहं, वृश्चिकं, कुम्भं च पश्यति (वृषभं न — सः समीपस्थः)' } },
  { type: { en: 'Fixed (Sthira)', hi: 'स्थिर राशि', sa: 'स्थिरराशिः' }, signs: { en: 'Taurus, Leo, Scorpio, Aquarius', hi: 'वृषभ, सिंह, वृश्चिक, कुम्भ', sa: 'वृषभः, सिंहः, वृश्चिकः, कुम्भः' }, aspects: { en: 'Aspect all MOVABLE signs except the adjacent one', hi: 'समीपस्थ को छोड़कर सभी चर राशियों पर दृष्टि', sa: 'समीपस्थां विहाय सर्वचरराशिषु दृष्टिः' }, example: { en: 'Taurus aspects Cancer, Libra, Capricorn (but NOT Aries — it is adjacent)', hi: 'वृषभ → कर्क, तुला, मकर पर दृष्टि (मेष नहीं — वह समीपस्थ है)', sa: 'वृषभः → कर्कटं, तुलां, मकरं च पश्यति (मेषं न)' } },
  { type: { en: 'Dual (Dwiswabhava)', hi: 'द्विस्वभाव राशि', sa: 'द्विस्वभावराशिः' }, signs: { en: 'Gemini, Virgo, Sagittarius, Pisces', hi: 'मिथुन, कन्या, धनु, मीन', sa: 'मिथुनं, कन्या, धनुः, मीनः' }, aspects: { en: 'Aspect the OTHER dual signs only', hi: 'केवल अन्य द्विस्वभाव राशियों पर दृष्टि', sa: 'केवलम् अन्यद्विस्वभावराशिषु दृष्टिः' }, example: { en: 'Gemini aspects Virgo, Sagittarius, Pisces (all other duals)', hi: 'मिथुन → कन्या, धनु, मीन पर दृष्टि (सभी अन्य द्विस्वभाव)', sa: 'मिथुनं → कन्यां, धनुं, मीनं च पश्यति' } },
];

/* ── Comparison table ─────────────────────────────────────────────── */
const COMPARISON = [
  { feature: { en: 'Primary Focus', hi: 'प्राथमिक केन्द्र', sa: 'प्राथमिककेन्द्रम्' }, parashari: { en: 'Planets', hi: 'ग्रह', sa: 'ग्रहाः' }, jaimini: { en: 'Signs (Rashis)', hi: 'राशियाँ', sa: 'राशयः' } },
  { feature: { en: 'Significators', hi: 'कारक', sa: 'कारकाः' }, parashari: { en: 'Fixed (Sun=father always)', hi: 'स्थिर (सूर्य सदा=पिता)', sa: 'स्थिराः' }, jaimini: { en: 'Variable (Chara Karakas)', hi: 'चर (चर कारक)', sa: 'चराः (चरकारकाः)' } },
  { feature: { en: 'Aspects', hi: 'दृष्टि', sa: 'दृष्टिः' }, parashari: { en: 'Planet-to-planet/house', hi: 'ग्रह से ग्रह/भाव', sa: 'ग्रहात् ग्रहं/भावम्' }, jaimini: { en: 'Sign-to-sign', hi: 'राशि से राशि', sa: 'राशेः राशिम्' } },
  { feature: { en: 'Timing System', hi: 'समय पद्धति', sa: 'समयपद्धतिः' }, parashari: { en: 'Vimshottari Dasha (120 yr)', hi: 'विंशोत्तरी दशा (120 वर्ष)', sa: 'विंशोत्तरीदशा (120 वर्षाः)' }, jaimini: { en: 'Chara Dasha (sign periods)', hi: 'चर दशा (राशि काल)', sa: 'चरदशा (राशिकालाः)' } },
  { feature: { en: 'Perception Tool', hi: 'धारणा उपकरण', sa: 'धारणोपकरणम्' }, parashari: { en: 'Not emphasized', hi: 'बल नहीं दिया जाता', sa: 'बलं न दीयते' }, jaimini: { en: 'Arudha Padas', hi: 'अरूढ़ पद', sa: 'अरूढपदानि' } },
  { feature: { en: 'Soul Purpose', hi: 'आत्म उद्देश्य', sa: 'आत्मोद्देश्यम्' }, parashari: { en: 'Lagna + 9th house', hi: 'लग्न + 9वाँ भाव', sa: 'लग्नम् + नवमभावः' }, jaimini: { en: 'Atmakaraka + Karakamsha', hi: 'आत्मकारक + कारकांश', sa: 'आत्मकारकः + कारकांशः' } },
];

/* ── Advanced concepts ────────────────────────────────────────────── */
const ADVANCED = [
  { name: { en: 'Swamsha Analysis', hi: 'स्वांश विश्लेषण', sa: 'स्वांशविश्लेषणम्' }, desc: { en: 'The Navamsha of the Atmakaraka (Swamsha) is analyzed for spiritual inclination. Jupiter in Swamsha → Vedantic path. Venus → devotional/artistic path. Saturn → renunciation. Ketu → Moksha-oriented soul.', hi: 'आत्मकारक का नवांश (स्वांश) आध्यात्मिक झुकाव के लिए विश्लेषित किया जाता है। स्वांश में गुरु → वेदान्तिक मार्ग। शुक्र → भक्ति/कलात्मक मार्ग।', sa: 'आत्मकारकस्य नवांशः (स्वांशः) आध्यात्मिकप्रवृत्त्यर्थं विश्लेष्यते।' } },
  { name: { en: 'Pada System (12 Padas)', hi: 'पद पद्धति (12 पद)', sa: 'पदपद्धतिः (12 पदानि)' }, desc: { en: 'Each of the 12 houses has an Arudha Pada. Key padas: A1/AL (self-image), A7 (public partnerships), A10 (career image), A11 (gains image), A12 (losses/foreign). The interaction between padas reveals social and material life patterns.', hi: 'प्रत्येक 12 भावों का एक अरूढ़ पद है। मुख्य पद: A1/AL (आत्म-छवि), A7 (सार्वजनिक साझेदारी), A10 (करियर छवि)।', sa: 'प्रत्येकस्य 12 भावस्य अरूढपदम् अस्ति।' } },
  { name: { en: 'Jaimini Rajayogas', hi: 'जैमिनी राजयोग', sa: 'जैमिनीराजयोगाः' }, desc: { en: 'Jaimini has its own Rajayoga system: when AK and AmK are in Kendra/Trikona from each other, a powerful Rajayoga forms. When AK, AmK, and PK combine in auspicious houses, the yoga is extraordinarily powerful — indicating fame, authority, and spiritual elevation.', hi: 'जैमिनी की अपनी राजयोग पद्धति है: जब AK और AmK एक-दूसरे से केन्द्र/त्रिकोण में हों, शक्तिशाली राजयोग बनता है।', sa: 'जैमिन्याः स्वकीया राजयोगपद्धतिः: यदा AK AmK च केन्द्रत्रिकोणयोः, शक्तिशालिराजयोगः भवति।' } },
  { name: { en: 'Argala in Jaimini', hi: 'जैमिनी में अर्गला', sa: 'जैमिन्याम् अर्गला' }, desc: { en: 'Argala (planetary intervention) takes on special significance in Jaimini — it is sign-based rather than house-based. Planets in the 2nd, 4th, 11th, and 5th signs from any reference sign create Argala. This integrates naturally with Rashi Drishti for comprehensive sign-level analysis.', hi: 'अर्गला जैमिनी में विशेष महत्व रखती है — यह भाव-आधारित नहीं बल्कि राशि-आधारित है।', sa: 'अर्गला जैमिन्यां विशेषमहत्त्वं धारयति — इयं राश्याधारिता न भावाधारिता।' } },
];

/* ── Practical tips ───────────────────────────────────────────────── */
const PRACTICAL_TIPS = [
  { en: 'Always identify the Atmakaraka FIRST. Everything else in Jaimini revolves around it. Check its Navamsha sign (Karakamsha) immediately after.', hi: 'सदैव पहले आत्मकारक की पहचान करें। जैमिनी में बाकी सब इसके इर्द-गिर्द घूमता है। तुरन्त बाद इसकी नवांश राशि (कारकांश) जाँचें।', sa: 'सदा प्रथमम् आत्मकारकम् अभिज्ञात। जैमिन्यां शेषं सर्वं तस्य परितः भ्रमति।' },
  { en: 'Use Jaimini Chara Dasha alongside Vimshottari. When both systems agree on an event timing, confidence is very high. When they disagree, the event may be weaker than expected.', hi: 'जैमिनी चर दशा को विंशोत्तरी के साथ उपयोग करें। जब दोनों पद्धतियाँ किसी घटना के समय पर सहमत हों, विश्वास बहुत अधिक होता है।', sa: 'जैमिनीचरदशां विंशोत्तर्या सह उपयुञ्जत।' },
  { en: 'For marriage prediction, combine the Darakaraka (DK) analysis with the 7th house Arudha Pada (A7). DK shows the spouse\'s nature; A7 shows how society perceives the marriage.', hi: 'विवाह भविष्यवाणी के लिए दारकारक (DK) विश्लेषण को 7वें भाव के अरूढ़ पद (A7) के साथ मिलाएँ।', sa: 'विवाहभविष्यवाण्यर्थं दारकारकविश्लेषणम् अरूढपदेन (A7) सह संयोजयत।' },
  { en: 'Rashi Drishti is particularly powerful for transit analysis. When a transiting planet enters a sign that aspects your natal Karakamsha, significant soul-level events occur.', hi: 'गोचर विश्लेषण के लिए राशि दृष्टि विशेष रूप से शक्तिशाली है। जब गोचरी ग्रह ऐसी राशि में प्रवेश करता है जो आपके कारकांश पर दृष्टि डालती है, महत्वपूर्ण आत्म-स्तरीय घटनाएँ होती हैं।', sa: 'गोचरविश्लेषणाय राशिदृष्टिः विशेषरूपेण शक्तिशाली।' },
];

/* ── Cross-references ─────────────────────────────────────────────── */
const CROSS_REFS = [
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएं', sa: 'स्वकुण्डलीं रचयत' }, desc: { en: 'Identify your Chara Karakas', hi: 'अपने चर कारक पहचानें', sa: 'स्वचरकारकान् अभिजानीत' } },
  { href: '/learn/argala', label: { en: 'Argala (Intervention)', hi: 'अर्गला (हस्तक्षेप)', sa: 'अर्गला (हस्तक्षेपः)' }, desc: { en: 'Deep dive into Jaimini Argala system', hi: 'जैमिनी अर्गला पद्धति में गहन अध्ययन', sa: 'जैमिनीअर्गलापद्धत्यां गभीरम् अध्ययनम्' } },
  { href: '/learn/vargas', label: { en: 'Divisional Charts (Vargas)', hi: 'वर्ग कुण्डलियाँ', sa: 'वर्गकुण्डल्यः' }, desc: { en: 'Navamsha — key to Karakamsha', hi: 'नवांश — कारकांश की कुंजी', sa: 'नवांशः — कारकांशस्य कुञ्चिका' } },
  { href: '/learn/dashas', label: { en: 'Dasha Systems', hi: 'दशा पद्धतियाँ', sa: 'दशापद्धतयः' }, desc: { en: 'Chara Dasha vs Vimshottari', hi: 'चर दशा बनाम विंशोत्तरी', sa: 'चरदशा विंशोत्तरी च' } },
];

/* ── Page component ───────────────────────────────────────────────── */
export default function JaiminiPage() {
  const locale = useLocale() as Locale;
  const t = (key: string) => lt((LT as unknown as Record<string, LocaleText>)[key], locale);
  const loc = isDevanagariLocale(locale) ? 'hi' as const : 'en' as const;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-2">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-primary/15 border border-gold-primary/30 mb-4">
          <Eye className="w-8 h-8 text-gold-primary" />
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('title')}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          {t('subtitle')}
        </p>
      </motion.div>

      {/* ── Section 1: What is Jaimini? ───────────────────────────── */}
      <LessonSection number={1} title={t('whatTitle')}>
        <p>{t('whatContent')}</p>
        <p>{t('whatContent2')}</p>
      </LessonSection>

      {/* ── Section 2: Chara Karakas ──────────────────────────────── */}
      <LessonSection number={2} title={t('karakaTitle')}>
        <p>{t('karakaContent')}</p>
        <div className="mt-4 p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/15">
          <p className="text-gold-light/80 text-sm italic">{t('karakaNote')}</p>
        </div>

        <div className="mt-6 space-y-4">
          {CHARA_KARAKAS.map((ck, i) => (
            <motion.div
              key={ck.abbr}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border transition-colors ${
                ck.importance === 'critical'
                  ? 'border-gold-primary/30 bg-gold-primary/5'
                  : ck.importance === 'high'
                  ? 'border-gold-primary/15'
                  : 'border-gold-primary/8'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: ck.color + '20', color: ck.color }}
                >
                  {ck.abbr}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-gold-light font-semibold">{tl(ck.name, locale)}</h4>
                    <span className="text-text-secondary/70 text-xs font-mono px-2 py-0.5 rounded bg-bg-primary/50">
                      {tl(ck.rule, locale)}
                    </span>
                    {ck.importance === 'critical' && (
                      <span className="text-amber-400 text-xs font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {t('mostImportant')}
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{tl(ck.signifies, locale)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 3: Karakamsha ─────────────────────────────────── */}
      <LessonSection number={3} title={t('karakamshaTitle')}>
        <p>{t('karakamshaContent')}</p>
        <p>{t('karakamshaContent2')}</p>

        <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-indigo-500/15">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h4 className="text-indigo-300 font-semibold text-sm">{t('quickKarakamshaGuide')}</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-text-secondary">
            {[
              { en: 'Fire signs (Ar/Le/Sg) → Leadership, dharma', hi: 'अग्नि राशि (मेष/सिंह/धनु) → नेतृत्व, धर्म' },
              { en: 'Earth signs (Ta/Vi/Cp) → Material mastery', hi: 'पृथ्वी राशि (वृषभ/कन्या/मकर) → भौतिक निपुणता' },
              { en: 'Air signs (Ge/Li/Aq) → Intellectual pursuit', hi: 'वायु राशि (मिथुन/तुला/कुम्भ) → बौद्धिक अनुसन्धान' },
              { en: 'Water signs (Cn/Sc/Pi) → Emotional/spiritual depth', hi: 'जल राशि (कर्क/वृश्चिक/मीन) → भावनात्मक/आध्यात्मिक गहराई' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-bg-primary/30">
                <ArrowRight className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                <span>{item[loc]}</span>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* ── Section 4: Rashi Drishti ──────────────────────────────── */}
      <LessonSection number={4} title={t('drishtiTitle')}>
        <p>{t('drishtiContent')}</p>

        <div className="mt-6 space-y-4">
          {RASHI_DRISHTI.map((rd, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5"
            >
              <h4 className="text-gold-light font-semibold mb-1">{tl(rd.type, locale)}</h4>
              <p className="text-text-secondary/75 text-xs mb-2 font-mono">{tl(rd.signs, locale)}</p>
              <p className="text-text-secondary text-sm mb-2">{tl(rd.aspects, locale)}</p>
              <div className="p-2 rounded bg-bg-primary/40 text-text-secondary/70 text-xs">
                {t('example')}{tl(rd.example, locale)}
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 5: Arudha Padas ───────────────────────────────── */}
      <LessonSection number={5} title={t('arudhaTitle')}>
        <p>{t('arudhaContent')}</p>
        <p>{t('arudhaContent2')}</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/15">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-cyan-400" />
              <h4 className="text-cyan-300 font-semibold text-sm">{t('lagnaReality')}</h4>
            </div>
            <p className="text-cyan-200/60 text-sm">
              {locale === 'en'
                ? 'Who you ACTUALLY are — your true nature, health, personality, and self-perception. The internal reality.'
                : 'आप वास्तव में कौन हैं — आपका सच्चा स्वभाव, स्वास्थ्य, व्यक्तित्व। आन्तरिक वास्तविकता।'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h4 className="text-amber-300 font-semibold text-sm">{t('arudhaLagnaPerception')}</h4>
            </div>
            <p className="text-amber-200/60 text-sm">
              {locale === 'en'
                ? 'How the WORLD sees you — your reputation, social image, and public persona. The external projection.'
                : 'संसार आपको कैसे देखता है — आपकी प्रतिष्ठा, सामाजिक छवि। बाहरी प्रक्षेपण।'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ── Section 6: Chara Dasha ────────────────────────────────── */}
      <LessonSection number={6} title={t('charaDashaTitle')}>
        <p>{t('charaDashaContent')}</p>
        <p>{t('charaDashaContent2')}</p>
      </LessonSection>

      {/* ── Section 7: Comparison Table ───────────────────────────── */}
      <LessonSection number={7} title={t('keyDiffTitle')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-3 px-4 text-gold-light font-semibold">{t('feature')}</th>
                <th className="text-left py-3 px-4 text-gold-light font-semibold">{t('parashari')}</th>
                <th className="text-left py-3 px-4 text-gold-light font-semibold">{t('jaiminiLabel')}</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors"
                >
                  <td className="py-3 px-4 text-gold-primary/80 font-medium">{tl(row.feature, locale)}</td>
                  <td className="py-3 px-4 text-text-secondary">{tl(row.parashari, locale)}</td>
                  <td className="py-3 px-4 text-text-secondary font-semibold">{tl(row.jaimini, locale)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* ── Section 8: Advanced Concepts ──────────────────────────── */}
      <LessonSection number={8} title={t('advancedTitle')}>
        <div className="space-y-4">
          {ADVANCED.map((adv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-5"
            >
              <h4 className="text-gold-light font-semibold text-sm mb-2">{tl(adv.name, locale)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed">{tl(adv.desc, locale)}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 9: Practical Tips ─────────────────────────────── */}
      <LessonSection number={9} title={t('practicalTitle')}>
        <div className="space-y-3">
          {PRACTICAL_TIPS.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <Star className="w-4 h-4 text-gold-primary flex-shrink-0 mt-1" />
              <p className="text-text-secondary text-sm leading-relaxed">{tip[loc]}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 10: Cross References ──────────────────────────── */}
      <LessonSection number={10} title={t('crossRefTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CROSS_REFS.map((ref) => (
            <Link
              key={ref.href}
              href={ref.href as '/learn/argala'}
              className="block p-4 rounded-lg border border-gold-primary/10 bg-bg-primary/30 hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-all group"
            >
              <div className="text-gold-light font-semibold text-sm group-hover:text-gold-primary transition-colors">{ref.label[loc]}</div>
              <p className="text-text-secondary/75 text-xs mt-1">{ref.desc[loc]}</p>
            </Link>
          ))}
        </div>
      </LessonSection>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {!isDevanagariLocale(locale) ? 'Find Your Atmakaraka' : 'अपना आत्मकारक खोजें'}
        </Link>
      </div>
    </div>
  );
}

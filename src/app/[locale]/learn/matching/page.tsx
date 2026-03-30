'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Kundali Matching — Ashta Kuta', hi: 'कुण्डली मिलान — अष्ट कूट', sa: 'कुण्डलीमेलनम् — अष्टकूटम्' },
  subtitle: { en: 'The 8-fold compatibility system used for marriage matching', hi: 'विवाह मिलान के लिए प्रयुक्त 8 कूट अनुकूलता प्रणाली', sa: 'विवाहमेलनार्थं प्रयुक्ता अष्टकूटानुकूलतापद्धतिः' },
  whatTitle: { en: 'What is Kundali Matching?', hi: 'कुण्डली मिलान क्या है?', sa: 'कुण्डलीमेलनं किम्?' },
  whatContent: {
    en: 'Kundali Matching (Horoscope Matching) compares two birth charts to assess compatibility for marriage. The primary system is Ashta Kuta — 8 factors scored from the Moon\'s Nakshatra of both partners. The maximum score is 36 points (Gunas). Traditionally, a minimum of 18 Gunas (50%) is required for an acceptable match.',
    hi: 'कुण्डली मिलान दो जन्म कुण्डलियों की तुलना करता है विवाह के लिए अनुकूलता आँकने हेतु। प्राथमिक प्रणाली अष्ट कूट है — दोनों साथियों के चन्द्र नक्षत्र से 8 कारक अंकित किए जाते हैं। अधिकतम अंक 36 (गुण) है।',
    sa: 'कुण्डलीमेलनं द्वयोः जन्मकुण्डल्योः तुलनां करोति विवाहार्थम् अनुकूलतायाः आकलनाय।'
  },
  kutaTitle: { en: 'The 8 Kutas Explained', hi: 'अष्ट कूट — विस्तृत व्याख्या', sa: 'अष्टकूटानि — विस्तृतव्याख्या' },
  calcTitle: { en: 'How Matching is Calculated', hi: 'मिलान कैसे गणना होती है', sa: 'मेलनं कथं गण्यते' },
  calcContent: {
    en: 'Our software calculates matching using the birth Moon Nakshatra of both partners. Each Kuta has specific rules — some use Nakshatra number, some use Rashi number, some use Nakshatra lord, and some use the Nakshatra\'s Yoni (animal symbol) or Gana (temperament). The algorithm checks all 8 factors and sums the points.',
    hi: 'हमारा सॉफ़्टवेयर दोनों साथियों के जन्म चन्द्र नक्षत्र से मिलान की गणना करता है। प्रत्येक कूट के विशिष्ट नियम हैं। एल्गोरिथ्म सभी 8 कारकों की जाँच करता है और अंकों का योग करता है।',
    sa: 'अस्माकं सॉफ़्टवेयरं उभयोः जन्मचन्द्रनक्षत्राभ्यां मेलनस्य गणनां करोति।'
  },
  doshaTitle: { en: 'Doshas in Matching', hi: 'मिलान में दोष', sa: 'मेलने दोषाः' },
  doshaContent: {
    en: 'Beyond Ashta Kuta points, certain Doshas (afflictions) are checked: Mangal Dosha (Mars in houses 1,4,7,8,12 from Lagna, Moon, or Venus), Nadi Dosha (same Nadi — most serious, 8 points lost), and Bhakoot Dosha (specific Rashi pairs that are inauspicious). Dosha cancellation rules also apply — for example, Mangal Dosha is considered cancelled if both partners have it.',
    hi: 'अष्ट कूट अंकों के अतिरिक्त, कुछ दोषों की जाँच होती है: मांगलिक दोष (लग्न, चन्द्र या शुक्र से 1,4,7,8,12 भाव में मंगल), नाड़ी दोष (समान नाड़ी — सबसे गम्भीर, 8 अंक हानि), और भकूट दोष।',
    sa: 'अष्टकूटाङ्कानाम् अतिरिक्तं केचन दोषाः परीक्ष्यन्ते।'
  },
  scoreTitle: { en: 'Score Interpretation', hi: 'अंकों की व्याख्या', sa: 'अङ्कानां व्याख्या' },
  tryIt: { en: 'Try Kundali Matching →', hi: 'कुण्डली मिलान करें →', sa: 'कुण्डलीमेलनं कुर्वन्तु →' },
};

const KUTAS = [
  { num: 1, name: { en: 'Varna', hi: 'वर्ण', sa: 'वर्णः' }, points: 1, what: { en: 'Spiritual compatibility', hi: 'आध्यात्मिक अनुकूलता', sa: 'आध्यात्मिकानुकूलता' }, how: { en: 'Compares the Varna (caste/class) assigned to each Nakshatra. Groom\'s Varna should be equal or higher than bride\'s. 4 varnas: Brahmin > Kshatriya > Vaishya > Shudra.', hi: 'प्रत्येक नक्षत्र को दिए गए वर्ण की तुलना करता है। वर का वर्ण वधू के बराबर या अधिक होना चाहिए।', sa: 'प्रत्येकनक्षत्रस्य वर्णं तुलयति। वरस्य वर्णः वध्वाः समानः उच्चतरः वा भवेत्।' } },
  { num: 2, name: { en: 'Vashya', hi: 'वश्य', sa: 'वश्यम्' }, points: 2, what: { en: 'Mutual attraction & control', hi: 'पारस्परिक आकर्षण और वश', sa: 'पारस्परिकाकर्षणं वश्यं च' }, how: { en: 'Each Rashi has an attraction category (Chatushpada, Manava, Jalachara, Vanachara, Keeta). Full points if one partner\'s Rashi is Vashya to the other\'s.', hi: 'प्रत्येक राशि का आकर्षण वर्ग होता है। पूर्ण अंक यदि एक साथी की राशि दूसरे की वश्य हो।', sa: 'प्रत्येकराशेः आकर्षणवर्गः भवति। पूर्णाङ्काः यदि एकस्य राशिः अन्यस्य वश्या।' } },
  { num: 3, name: { en: 'Tara', hi: 'तारा', sa: 'तारा' }, points: 3, what: { en: 'Birth star compatibility', hi: 'जन्म नक्षत्र अनुकूलता', sa: 'जन्मनक्षत्रानुकूलता' }, how: { en: 'Count from bride\'s Nakshatra to groom\'s and vice versa. Divide by 9 — remainder determines the Tara. Taras 1,2,4,6,8,9 = auspicious. Both directions must be checked.', hi: 'वधू के नक्षत्र से वर के तक और विपरीत गिनें। 9 से भाग दें — शेषफल तारा निर्धारित करता है।', sa: 'वध्वाः नक्षत्रात् वरस्य पर्यन्तं गणयन्तु। 9 भागं कुर्वन्तु।' } },
  { num: 4, name: { en: 'Yoni', hi: 'योनि', sa: 'योनिः' }, points: 4, what: { en: 'Physical/sexual compatibility', hi: 'शारीरिक/यौन अनुकूलता', sa: 'शारीरिकानुकूलता' }, how: { en: 'Each Nakshatra has an animal symbol (Yoni) — Horse, Elephant, Sheep, Snake, Dog, Cat, Rat, Cow, Buffalo, Tiger, Deer, Monkey, Mongoose, Lion. Same Yoni = 4 pts, friendly = 3, neutral = 2, enemy = 1, sworn enemy = 0.', hi: 'प्रत्येक नक्षत्र का एक पशु चिह्न (योनि) होता है। समान योनि = 4 अंक, मित्र = 3, तटस्थ = 2, शत्रु = 1, परम शत्रु = 0।', sa: 'प्रत्येकनक्षत्रस्य पशुचिह्नं (योनिः) भवति। समानयोनिः = 4 अङ्काः।' } },
  { num: 5, name: { en: 'Graha Maitri', hi: 'ग्रह मैत्री', sa: 'ग्रहमैत्री' }, points: 5, what: { en: 'Mental compatibility (Moon sign lords)', hi: 'मानसिक अनुकूलता (चन्द्र राशि स्वामी)', sa: 'मानसिकानुकूलता' }, how: { en: 'Compares the planetary lords of both Moon signs. If both lords are friends = 5, one friend/one neutral = 4, both neutral = 3, one friend/one enemy = 1, both enemies = 0. Uses the natural friendship table of planets.', hi: 'दोनों चन्द्र राशियों के ग्रह स्वामियों की तुलना। दोनों मित्र = 5, एक मित्र/एक तटस्थ = 4, दोनों तटस्थ = 3।', sa: 'उभयोः चन्द्रराशिस्वामिनोः तुलनां करोति। उभौ मित्रौ = 5।' } },
  { num: 6, name: { en: 'Gana', hi: 'गण', sa: 'गणः' }, points: 6, what: { en: 'Temperament match', hi: 'स्वभाव मिलान', sa: 'स्वभावमेलनम्' }, how: { en: 'Each Nakshatra belongs to one of 3 Ganas: Deva (divine), Manushya (human), Rakshasa (demonic). Same Gana = 6 pts. Deva-Manushya = 5. Deva-Rakshasa = 0. Manushya-Rakshasa = 1. This affects daily temperament compatibility.', hi: 'प्रत्येक नक्षत्र 3 गणों में से एक का होता है: देव, मनुष्य, राक्षस। समान गण = 6 अंक।', sa: 'प्रत्येकनक्षत्रं त्रिषु गणेषु एकस्मिन् भवति: देवः, मनुष्यः, राक्षसः। समानगणः = 6 अङ्काः।' } },
  { num: 7, name: { en: 'Bhakoot', hi: 'भकूट', sa: 'भकूटम्' }, points: 7, what: { en: 'Health & prosperity of couple', hi: 'दम्पत्ति का स्वास्थ्य और समृद्धि', sa: 'दम्पत्योः स्वास्थ्यं समृद्धिः च' }, how: { en: 'Compares Moon Rashis. Certain pairs are inauspicious: 2/12 (financial issues), 5/9 (progeny issues), 6/8 (health/longevity issues). If none of these pairs match → 7 points. Dosha cancellation applies if lords are friends.', hi: 'चन्द्र राशियों की तुलना। कुछ जोड़े अशुभ: 2/12 (आर्थिक), 5/9 (सन्तान), 6/8 (स्वास्थ्य)।', sa: 'चन्द्रराश्योः तुलनां करोति। केचन युग्मानि अशुभानि: 2/12, 5/9, 6/8।' } },
  { num: 8, name: { en: 'Nadi', hi: 'नाड़ी', sa: 'नाडी' }, points: 8, what: { en: 'Health & genes — most critical', hi: 'स्वास्थ्य और जीन — सबसे महत्वपूर्ण', sa: 'स्वास्थ्यं जीनानि — सर्वाधिकमहत्त्वपूर्णम्' }, how: { en: 'Each Nakshatra belongs to one of 3 Nadis: Aadi (Vata), Madhya (Pitta), Antya (Kapha). Same Nadi = 0 points (Nadi Dosha — worst defect). Different Nadi = 8 points. Nadi Dosha is believed to affect progeny health. Cancellation rules exist based on Rashi and Nakshatra.', hi: 'प्रत्येक नक्षत्र 3 नाड़ियों में से एक का: आदि (वात), मध्य (पित्त), अन्त्य (कफ)। समान नाड़ी = 0 अंक (नाड़ी दोष)।', sa: 'प्रत्येकनक्षत्रं त्रिषु नाडीषु एकस्मिन्: आदिः, मध्यः, अन्त्यः। समाननाडी = 0 अङ्काः।' } },
];

const SCORE_RANGES = [
  { range: '0-17', label: { en: 'Poor Match', hi: 'कमज़ोर मिलान', sa: 'दुर्बलमेलनम्' }, desc: { en: 'Not recommended. Significant incompatibilities exist.', hi: 'अनुशंसित नहीं। महत्वपूर्ण असंगतताएँ हैं।', sa: 'अनुशंसितं न। महत्त्वपूर्णासंगतताः सन्ति।' }, color: 'text-red-400', bg: 'border-red-400/20 bg-red-400/5' },
  { range: '18-24', label: { en: 'Acceptable', hi: 'स्वीकार्य', sa: 'स्वीकार्यम्' }, desc: { en: 'Average match. Some areas need attention and compromise.', hi: 'औसत मिलान। कुछ क्षेत्रों में ध्यान और समझौते की ज़रूरत।', sa: 'मध्यममेलनम्। केषुचित् क्षेत्रेषु ध्यानं समझौतं च आवश्यकम्।' }, color: 'text-amber-400', bg: 'border-amber-400/20 bg-amber-400/5' },
  { range: '25-32', label: { en: 'Good Match', hi: 'अच्छा मिलान', sa: 'उत्तममेलनम्' }, desc: { en: 'Strong compatibility. Well-suited for a harmonious partnership.', hi: 'मज़बूत अनुकूलता। सामंजस्यपूर्ण साझेदारी के लिए उपयुक्त।', sa: 'सुदृढानुकूलता। सामंजस्यपूर्णसाझेदार्यै उपयुक्तम्।' }, color: 'text-emerald-400', bg: 'border-emerald-400/20 bg-emerald-400/5' },
  { range: '33-36', label: { en: 'Excellent Match', hi: 'उत्कृष्ट मिलान', sa: 'उत्कृष्टमेलनम्' }, desc: { en: 'Exceptional compatibility across all dimensions.', hi: 'सभी आयामों में असाधारण अनुकूलता।', sa: 'सर्वेषु आयामेषु असाधारणानुकूलता।' }, color: 'text-gold-primary', bg: 'border-gold-primary/20 bg-gold-primary/5' },
];

export default function LearnMatchingPage() {
  const locale = useLocale() as Locale;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {L.title[locale]}
        </h2>
        <p className="text-text-secondary">{L.subtitle[locale]}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Ashta Kuta" devanagari="अष्ट कूट" transliteration="Aṣṭa Kūṭa" meaning="Eight points / factors" />
        <SanskritTermCard term="Guna" devanagari="गुण" transliteration="Guṇa" meaning="Quality / Point" />
        <SanskritTermCard term="Dosha" devanagari="दोष" transliteration="Doṣa" meaning="Affliction / Defect" />
        <SanskritTermCard term="Mangalik" devanagari="मांगलिक" transliteration="Māṅgalika" meaning="Mars affliction" />
      </div>

      <LessonSection number={1} title={L.whatTitle[locale]}>
        <p>{L.whatContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            {locale === 'en' ? 'Total Ashta Kuta Points: 1+2+3+4+5+6+7+8 = 36 Gunas' : 'कुल अष्ट कूट अंक: 1+2+3+4+5+6+7+8 = 36 गुण'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en' ? 'Minimum for marriage: 18/36 (50%)' : 'विवाह के लिए न्यूनतम: 18/36 (50%)'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs">
            {locale === 'en' ? 'Both charts compared using Moon\'s Nakshatra position' : 'दोनों कुण्डलियों की चन्द्र नक्षत्र स्थिति से तुलना'}
          </p>
        </div>
      </LessonSection>

      <LessonSection number={2} title={L.kutaTitle[locale]}>
        <div className="space-y-4">
          {KUTAS.map((k, i) => (
            <motion.div
              key={k.num}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-lg p-4 border border-gold-primary/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light font-bold flex-shrink-0 text-sm">
                  {k.num}
                </span>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-gold-light font-semibold">{k.name[locale]}</span>
                  {locale === 'en' && <span className="text-gold-primary/50 text-xs" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{k.name.sa}</span>}
                  <span className="ml-auto text-gold-primary font-mono text-sm">{k.points} {locale === 'en' ? 'pts' : 'अंक'}</span>
                </div>
              </div>
              <div className="ml-11">
                <p className="text-amber-300/80 text-sm mb-1">{k.what[locale]}</p>
                <p className="text-text-secondary text-xs">{k.how[locale]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      <LessonSection number={3} title={L.calcTitle[locale]}>
        <p>{L.calcContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' ? 'Algorithm Steps:' : 'एल्गोरिथ्म चरण:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">1. {locale === 'en' ? 'Input: Birth Moon Nakshatra of both partners' : 'इनपुट: दोनों साथियों का जन्म चन्द्र नक्षत्र'}</p>
          <p className="text-gold-light/80 font-mono text-xs">2. {locale === 'en' ? 'For each Kuta, apply specific comparison rules' : 'प्रत्येक कूट के लिए, विशिष्ट तुलना नियम लागू करें'}</p>
          <p className="text-gold-light/80 font-mono text-xs">3. {locale === 'en' ? 'Sum all points → total Guna score out of 36' : 'सभी अंकों का योग → 36 में से कुल गुण अंक'}</p>
          <p className="text-gold-light/80 font-mono text-xs">4. {locale === 'en' ? 'Check for Doshas (Mangal, Nadi, Bhakoot)' : 'दोषों की जाँच (मांगलिक, नाड़ी, भकूट)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">5. {locale === 'en' ? 'Apply cancellation rules if applicable' : 'यदि लागू हो तो निरसन नियम लागू करें'}</p>
          <p className="text-gold-light/80 font-mono text-xs">6. {locale === 'en' ? 'Generate detailed compatibility report' : 'विस्तृत अनुकूलता रिपोर्ट तैयार करें'}</p>
        </div>
      </LessonSection>

      <LessonSection number={4} title={L.doshaTitle[locale]}>
        <p>{L.doshaContent[locale]}</p>
      </LessonSection>

      <LessonSection number={5} title={L.scoreTitle[locale]} variant="highlight">
        <div className="space-y-3">
          {SCORE_RANGES.map((s) => (
            <div key={s.range} className={`rounded-lg p-3 border ${s.bg}`}>
              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold ${s.color}`}>{s.range}</span>
                <span className={`font-semibold text-sm ${s.color}`}>{s.label[locale]}</span>
              </div>
              <p className="text-text-secondary text-xs mt-1">{s.desc[locale]}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/matching"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {L.tryIt[locale]}
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, Gem, Music, Heart, Flame } from 'lucide-react';
import type { Locale } from '@/types/panchang';

const DOSHAS = [
  { id: 'mangal', name: { en: 'Mangal Dosha (Manglik)', hi: 'मांगलिक दोष' }, severity: 'high', planets: 'Mars',
    condition: { en: 'Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus', hi: 'लग्न, चंद्र या शुक्र से 1, 2, 4, 7, 8, 12वें भाव में मंगल' },
    effect: { en: 'Delays or disturbances in marriage, aggressive temperament, conflicts with spouse. Severity depends on sign, aspects, and which reference point (Lagna/Moon/Venus).', hi: 'विवाह में देरी या बाधा, आक्रामक स्वभाव, जीवनसाथी से संघर्ष।' },
    cancellation: { en: 'Mars in own sign/exaltation, Jupiter aspect on Mars, spouse also Manglik, Mars in benefic sign in 2nd/12th', hi: 'मंगल अपनी/उच्च राशि में, गुरु दृष्टि, जीवनसाथी भी मांगलिक' },
    remedy: { en: 'Kumbh Vivah (ritual marriage before actual), Mangal Shanti puja, wearing Red Coral (after consultation), Hanuman Chalisa on Tuesdays, donate red lentils', hi: 'कुम्भ विवाह, मंगल शांति पूजा, मूंगा धारण, हनुमान चालीसा (मंगलवार), लाल मसूर दान' },
    classical: 'BPHS Ch.35, Phaladeepika Ch.7' },
  { id: 'kala_sarpa', name: { en: 'Kala Sarpa Dosha', hi: 'काल सर्प दोष' }, severity: 'high', planets: 'Rahu-Ketu axis',
    condition: { en: 'All 7 planets (Sun-Saturn) between Rahu and Ketu on one side. 12 types named after serpents (Ananta, Kulika, Vasuki, etc.) based on Rahu\'s house position.', hi: 'सभी 7 ग्रह राहु-केतु के बीच एक तरफ। राहु की भाव स्थिति अनुसार 12 प्रकार।' },
    effect: { en: 'Cyclical hardships, sudden reversals of fortune, intense karmic experiences. Life follows a build-up and collapse pattern. Mental anxiety and fear of snakes/sudden events.', hi: 'चक्रीय कठिनाइयाँ, अचानक भाग्य परिवर्तन, तीव्र कार्मिक अनुभव।' },
    cancellation: { en: 'One planet outside the axis, partial Kala Sarpa (only some planets), benefic aspects on Rahu/Ketu', hi: 'एक ग्रह अक्ष के बाहर, आंशिक काल सर्प, शुभ दृष्टि' },
    remedy: { en: 'Kala Sarpa Dosha puja (Trimbakeshwar/Kukke), Rahu-Ketu homam, Naga puja, Maha Mrityunjaya japa (125,000), silver Naga idol worship', hi: 'काल सर्प दोष पूजा (त्र्यम्बकेश्वर), राहु-केतु होमम, नाग पूजा, महामृत्युंजय जप' },
    classical: 'Manasagari, Hora Sara' },
  { id: 'pitra', name: { en: 'Pitra Dosha', hi: 'पित्र दोष' }, severity: 'medium', planets: 'Sun + Rahu/Ketu',
    condition: { en: 'Sun conjunct Rahu or Ketu (especially in 1st, 5th, or 9th house). Also 9th house heavily afflicted by malefics.', hi: 'सूर्य राहु या केतु के साथ (विशेषकर 1, 5, 9वें भाव में)।' },
    effect: { en: 'Ancestral karmic debt manifesting as obstacles from father/authority figures, difficulty with government matters, childlessness, or children facing problems.', hi: 'पूर्वजों का कार्मिक ऋण — पिता/अधिकारियों से बाधा, सरकारी कार्यों में कठिनाई, संतान समस्या।' },
    cancellation: { en: 'Jupiter aspect on 9th house, Sun in exaltation/own sign, strong benefics in 9th', hi: 'गुरु दृष्टि 9वें भाव पर, सूर्य उच्च/स्वराशि में' },
    remedy: { en: 'Pitra Tarpan on Amavasya (especially Sarva Pitri Amavasya), Narayan Nagbali (Trimbak), Pind Daan at Gaya, feed Brahmins on father\'s shraddha', hi: 'पित्र तर्पण अमावस्या पर, नारायण नागबली, गया पिंड दान, श्राद्ध पर ब्राह्मण भोजन' },
    classical: 'BPHS Ch.35' },
  { id: 'shrapit', name: { en: 'Shrapit Dosha', hi: 'श्रापित दोष' }, severity: 'high', planets: 'Saturn + Rahu',
    condition: { en: 'Saturn and Rahu conjunct in any house. Especially severe in kendras or 5th/9th houses.', hi: 'शनि और राहु की युति किसी भी भाव में। केंद्र या 5/9 भाव में विशेष गंभीर।' },
    effect: { en: 'Past-life curse manifesting as chronic obstacles, unexplainable suffering, financial losses, and isolation. The person feels "cursed" without understanding why.', hi: 'पूर्वजन्म का शाप — दीर्घकालिक बाधाएं, अकथनीय कष्ट, आर्थिक हानि, एकांत।' },
    cancellation: { en: 'Jupiter aspect on the conjunction, both in benefic signs, or strong lagna lord', hi: 'गुरु दृष्टि युति पर, शुभ राशि में, बलवान लग्नेश' },
    remedy: { en: 'Shani-Rahu shanti homam, recite Vishnu Sahasranama daily, donate black sesame and iron on Saturdays, Rudrabhishek', hi: 'शनि-राहु शांति होमम, विष्णु सहस्रनाम पाठ, शनिवार को काले तिल-लोहा दान, रुद्राभिषेक' },
    classical: 'BPHS, Lal Kitab' },
  { id: 'kemdrum', name: { en: 'Kemadruma Dosha', hi: 'केमद्रुम दोष' }, severity: 'medium', planets: 'Moon isolated',
    condition: { en: 'No planet (except Sun, Rahu, Ketu) in 2nd or 12th house from Moon', hi: 'चंद्र से 2nd और 12th में कोई ग्रह नहीं (सूर्य, राहु, केतु छोड़कर)' },
    effect: { en: 'Emotional isolation, poverty despite effort, lack of support systems, mental distress. Moon needs planetary "companions" for emotional stability.', hi: 'भावनात्मक अकेलापन, प्रयास के बावजूद गरीबी, सहायता की कमी, मानसिक कष्ट।' },
    cancellation: { en: 'Planet in kendra from Moon, Moon in kendra aspected by benefic, Full Moon, Moon in strong sign (Taurus exaltation)', hi: 'चंद्र से केंद्र में ग्रह, शुभ दृष्टि, पूर्णिमा का चंद्र, वृषभ में चंद्र' },
    remedy: { en: 'Worship Lord Shiva on Mondays, Pearl wearing (after analysis), Chandra Graha shanti, donate white items (rice, milk, white cloth) on Mondays', hi: 'सोमवार को शिव पूजा, मोती धारण, चंद्र ग्रह शांति, सोमवार को सफेद वस्तुएं दान' },
    classical: 'Phaladeepika Ch.6 v.8' },
  { id: 'marana_karaka', name: { en: 'Marana Karaka Sthana', hi: 'मरण कारक स्थान' }, severity: 'medium', planets: 'Any planet',
    condition: { en: 'Planet in its "death house": Sun in 12th, Moon in 8th, Mars in 7th, Mercury in 4th, Jupiter in 3rd, Venus in 6th, Saturn in 1st, Rahu in 9th, Ketu in 3rd', hi: 'ग्रह अपने मृत्यु-भाव में: सूर्य 12वें, चंद्र 8वें, मंगल 7वें, बुध 4वें...' },
    effect: { en: 'The planet becomes extremely weak — its significations suffer greatly. Like a person imprisoned in a place of death. The karakatvas (natural significations) are severely impaired.', hi: 'ग्रह अत्यंत दुर्बल — उसके कारकत्व बहुत पीड़ित। मृत्यु स्थान में कैदी के समान।' },
    cancellation: { en: 'Benefic aspect, planet in own/exaltation sign (partially mitigates), strong dispositor', hi: 'शुभ दृष्टि, स्वराशि/उच्च (आंशिक शमन), बलवान स्वामी' },
    remedy: { en: 'Strengthen the afflicted planet through its gemstone, mantra, and charity items. Worship the deity associated with that planet.', hi: 'पीड़ित ग्रह को रत्न, मंत्र और दान से सशक्त करें। ग्रह के देवता की पूजा।' },
    classical: 'BPHS Ch.44' },
];

const REMEDY_TYPES = [
  { icon: Gem, name: { en: 'Gemstones (Ratna)', hi: 'रत्न' }, desc: { en: 'Each planet has a primary gemstone and alternatives. Worn on specific finger, in specific metal, on the planet\'s day after energization (prana pratishtha).', hi: 'प्रत्येक ग्रह का प्राथमिक रत्न और विकल्प। विशिष्ट अंगुली, धातु और दिन पर प्राण प्रतिष्ठा के बाद धारण।' }, color: 'text-violet-400' },
  { icon: Music, name: { en: 'Mantras (Japa)', hi: 'मंत्र (जप)' }, desc: { en: 'Beej mantras (seed syllables) and Vedic mantras specific to each planet. Typically chanted 108 times or multiples. Most effective during planet\'s hora.', hi: 'बीज मंत्र और वैदिक मंत्र। आमतौर पर 108 बार या गुणक में जाप। ग्रह की होरा में सर्वाधिक प्रभावी।' }, color: 'text-gold-light' },
  { icon: Heart, name: { en: 'Charity (Daan)', hi: 'दान' }, desc: { en: 'Donating items associated with the planet on its day. E.g., wheat/jaggery/copper on Sunday for Sun, rice/white cloth on Monday for Moon.', hi: 'ग्रह से संबंधित वस्तुओं का उसके दिन दान। जैसे रविवार को गेहूं/गुड़ (सूर्य), सोमवार को चावल (चंद्र)।' }, color: 'text-emerald-400' },
  { icon: Flame, name: { en: 'Rituals (Homa/Puja)', hi: 'अनुष्ठान (होम/पूजा)' }, desc: { en: 'Fire rituals (homa/homam) for specific planets. Graha Shanti puja, Navagraha Homam, and deity-specific worship according to the dosha.', hi: 'विशिष्ट ग्रहों के लिए अग्नि अनुष्ठान। ग्रह शांति पूजा, नवग्रह होमम, दोष अनुसार देवता पूजा।' }, color: 'text-orange-400' },
];

export default function DoshasPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const [expanded, setExpanded] = useState<string | null>('mangal');

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {isHi ? 'दोष एवं उपाय' : 'Doshas & Remedies'}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {isHi
            ? 'दोष ज्योतिषीय कष्ट हैं जो ग्रहों की विशिष्ट अशुभ स्थितियों से बनते हैं। प्रत्येक दोष के उपचार हैं — रत्न, मंत्र, दान और अनुष्ठान। महत्वपूर्ण: अधिकांश दोषों में "रद्दीकरण" शर्तें हैं जो उनके प्रभाव को कम या समाप्त कर देती हैं।'
            : 'Doshas are astrological afflictions formed by specific inauspicious planetary configurations. Each dosha has remedies — gemstones, mantras, charity, and rituals. Important: most doshas have "cancellation" conditions that reduce or eliminate their effects.'}
        </p>
      </div>

      {/* Severity legend */}
      <div className="flex gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> {isHi ? 'गंभीर' : 'Severe'}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> {isHi ? 'मध्यम' : 'Moderate'}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> {isHi ? 'हल्का' : 'Mild'}</span>
      </div>

      {/* Dosha cards */}
      <div className="space-y-3">
        {DOSHAS.map((dosha) => {
          const isExpanded = expanded === dosha.id;
          const sevColor = dosha.severity === 'high' ? 'border-red-500/20' : 'border-amber-500/20';
          const sevDot = dosha.severity === 'high' ? 'bg-red-500' : 'bg-amber-500';
          return (
            <div key={dosha.id} className={`glass-card rounded-2xl border ${sevColor} overflow-hidden`}>
              <button onClick={() => setExpanded(isExpanded ? null : dosha.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gold-primary/3 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${sevDot}`} />
                  <span className="text-gold-light font-bold" style={headingFont}>{isHi ? dosha.name.hi : dosha.name.en}</span>
                  <span className="text-text-tertiary text-xs">{dosha.planets}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gold-primary/10">
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-1">{isHi ? 'निर्माण शर्त' : 'Formation'}</div>
                          <div className="text-text-secondary text-xs leading-relaxed">{isHi ? dosha.condition.hi : dosha.condition.en}</div>
                        </div>
                        <div>
                          <div className="text-amber-400 text-[10px] uppercase tracking-widest font-bold mb-1">{isHi ? 'प्रभाव' : 'Effects'}</div>
                          <div className="text-text-secondary text-xs leading-relaxed">{isHi ? dosha.effect.hi : dosha.effect.en}</div>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                        <div className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-1">{isHi ? 'रद्दीकरण शर्तें' : 'Cancellation Conditions'}</div>
                        <div className="text-emerald-300 text-xs leading-relaxed">{isHi ? dosha.cancellation.hi : dosha.cancellation.en}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-gold-primary/5 border border-gold-primary/15">
                        <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-1">{isHi ? 'उपाय' : 'Remedies'}</div>
                        <div className="text-text-secondary text-xs leading-relaxed">{isHi ? dosha.remedy.hi : dosha.remedy.en}</div>
                      </div>
                      <div className="text-text-tertiary text-[10px]">{dosha.classical}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Remedy System Overview */}
      <div>
        <h3 className="text-gold-gradient text-xl font-bold mb-4" style={headingFont}>
          {isHi ? 'उपचार पद्धतियाँ' : 'The Remedy System'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REMEDY_TYPES.map((rt, i) => {
            const Icon = rt.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-6 h-6 ${rt.color}`} />
                  <span className={`font-bold ${rt.color}`} style={headingFont}>{isHi ? rt.name.hi : rt.name.en}</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">{isHi ? rt.desc.hi : rt.desc.en}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Planet remedy quick reference */}
      <div className="glass-card rounded-2xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-light font-bold mb-3" style={headingFont}>{isHi ? 'ग्रह उपचार त्वरित संदर्भ' : 'Planet Remedy Quick Reference'}</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-3 text-gold-dark">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{isHi ? 'रत्न' : 'Gemstone'}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{isHi ? 'दिन' : 'Day'}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{isHi ? 'रंग' : 'Color'}</th>
                <th className="text-left py-2 px-3 text-gold-dark">{isHi ? 'दान' : 'Charity'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { p: 'Sun/सूर्य', gem: 'Ruby/माणिक्य', day: 'Sunday', color: 'Red', charity: 'Wheat, jaggery, copper' },
                { p: 'Moon/चन्द्र', gem: 'Pearl/मोती', day: 'Monday', color: 'White', charity: 'Rice, milk, white cloth' },
                { p: 'Mars/मंगल', gem: 'Red Coral/मूंगा', day: 'Tuesday', color: 'Red', charity: 'Masoor dal, red cloth' },
                { p: 'Mercury/बुध', gem: 'Emerald/पन्ना', day: 'Wednesday', color: 'Green', charity: 'Moong dal, green items' },
                { p: 'Jupiter/गुरु', gem: 'Yellow Sapphire/पुखराज', day: 'Thursday', color: 'Yellow', charity: 'Chana dal, turmeric, bananas' },
                { p: 'Venus/शुक्र', gem: 'Diamond/हीरा', day: 'Friday', color: 'White', charity: 'Sugar, ghee, white items' },
                { p: 'Saturn/शनि', gem: 'Blue Sapphire/नीलम', day: 'Saturday', color: 'Black/Blue', charity: 'Sesame, iron, mustard oil' },
                { p: 'Rahu/राहु', gem: 'Hessonite/गोमेद', day: 'Saturday', color: 'Smoky', charity: 'Coconut, blanket, coal' },
                { p: 'Ketu/केतु', gem: "Cat's Eye/लहसुनिया", day: 'Tuesday', color: 'Grey', charity: 'Sesame, dog food, blanket' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-gold-primary/3">
                  <td className="py-2 px-3 text-gold-light font-medium">{r.p}</td>
                  <td className="py-2 px-3 text-text-secondary">{r.gem}</td>
                  <td className="py-2 px-3 text-text-secondary">{r.day}</td>
                  <td className="py-2 px-3 text-text-secondary">{r.color}</td>
                  <td className="py-2 px-3 text-text-secondary">{r.charity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

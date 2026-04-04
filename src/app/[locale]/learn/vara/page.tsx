'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import type { Locale } from '@/types/panchang';

const VARAS = [
  { day: 0, en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः', planet: { en: 'Sun (Surya)', hi: 'सूर्य' }, color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5',
    deity: { en: 'Surya Deva', hi: 'सूर्य देव' },
    nature: { en: 'Cruel (Krura)', hi: 'क्रूर' },
    activities: { en: 'Government work, meeting authorities, starting leadership roles, Sun-related remedies, health matters, father-related activities', hi: 'सरकारी कार्य, अधिकारियों से मिलना, नेतृत्व, स्वास्थ्य, पिता संबंधी कार्य' },
    avoid: { en: 'Travel to East (Disha Shool), starting new medicines, lending money', hi: 'पूर्व दिशा में यात्रा, नई दवाई, ऋण देना' },
    hora: { en: 'Sun hora at sunrise, then Venus, Mercury, Moon, Saturn, Jupiter, Mars cycle', hi: 'सूर्योदय पर सूर्य होरा, फिर शुक्र, बुध, चंद्र, शनि, गुरु, मंगल' },
    significance: { en: 'The Sun rules Sunday — the king of planets. This day carries solar energy: authority, vitality, self-expression. Government offices, temples of Surya, and activities requiring courage and initiative are favored. The Sun\'s hora (first hour after sunrise) is especially powerful for starting authoritative endeavors.', hi: 'सूर्य रविवार का स्वामी है — ग्रहों का राजा। इस दिन सौर ऊर्जा: अधिकार, जीवन शक्ति, आत्म-अभिव्यक्ति। सरकारी कार्यालय, सूर्य मंदिर और साहस के कार्य अनुकूल।' },
  },
  { day: 1, en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः', planet: { en: 'Moon (Chandra)', hi: 'चन्द्र' }, color: 'text-blue-300', border: 'border-blue-500/20', bg: 'bg-blue-500/5',
    deity: { en: 'Lord Shiva', hi: 'भगवान शिव' },
    nature: { en: 'Gentle (Saumya)', hi: 'सौम्य' },
    activities: { en: 'Starting journeys, agriculture, dealing with public, water-related work, mother-related activities, white items, silver purchase', hi: 'यात्रा आरम्भ, कृषि, जन संपर्क, जल कार्य, मातृ संबंधी, चांदी खरीद' },
    avoid: { en: 'Travel to East (Disha Shool), hair cutting (some traditions), starting construction', hi: 'पूर्व दिशा यात्रा, केश कटाना (कुछ परंपराओं में)' },
    hora: { en: 'Moon hora at sunrise', hi: 'सूर्योदय पर चन्द्र होरा' },
    significance: { en: 'Moon governs Monday — the mind, emotions, mother, and public perception. This gentle day favors activities involving water, nurturing, travel, and public dealings. Shiva temples are especially visited on Mondays. The waxing Moon (Shukla Paksha Monday) is more auspicious than waning.', hi: 'चंद्र सोमवार का स्वामी — मन, भावनाएं, माता। यह सौम्य दिन जल, यात्रा और जनसंपर्क के लिए अनुकूल। शिव मंदिर विशेष महत्वपूर्ण।' },
  },
  { day: 2, en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः', planet: { en: 'Mars (Mangal)', hi: 'मंगल' }, color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5',
    deity: { en: 'Lord Hanuman / Kartikeya', hi: 'हनुमान / कार्तिकेय' },
    nature: { en: 'Cruel (Krura)', hi: 'क्रूर' },
    activities: { en: 'Property purchase, land dealings, surgery, weapons, fire-related work, competition, sports, legal battles', hi: 'संपत्ति खरीद, भूमि, शल्यक्रिया, अग्नि कार्य, प्रतियोगिता, खेल, कानूनी' },
    avoid: { en: 'Travel to North (Disha Shool), marriage, starting gentle/creative work, lending', hi: 'उत्तर दिशा यात्रा, विवाह, कोमल/रचनात्मक कार्य' },
    hora: { en: 'Mars hora at sunrise', hi: 'सूर्योदय पर मंगल होरा' },
    significance: { en: 'Mars rules Tuesday — courage, aggression, property, and physical energy. This fiery day favors bold action: property transactions, surgery, competitive events, and overcoming enemies. Hanuman worship on Tuesday is considered extremely powerful for removing obstacles and building courage.', hi: 'मंगल मंगलवार का स्वामी — साहस, आक्रामकता, संपत्ति। इस अग्निमय दिन में साहसिक कार्य, संपत्ति, शल्यक्रिया अनुकूल। हनुमान पूजा अत्यंत शक्तिशाली।' },
  },
  { day: 3, en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः', planet: { en: 'Mercury (Budha)', hi: 'बुध' }, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5',
    deity: { en: 'Lord Vishnu / Ganesha', hi: 'विष्णु / गणेश' },
    nature: { en: 'Mixed (depends on association)', hi: 'मिश्रित (संगति पर निर्भर)' },
    activities: { en: 'Education, writing, commerce, communication, accounting, starting business, learning new skills, technology', hi: 'शिक्षा, लेखन, वाणिज्य, संचार, लेखांकन, व्यवसाय आरम्भ, नई कला सीखना' },
    avoid: { en: 'Travel to North (Disha Shool), heavy physical labor', hi: 'उत्तर दिशा यात्रा, भारी शारीरिक श्रम' },
    hora: { en: 'Mercury hora at sunrise', hi: 'सूर्योदय पर बुध होरा' },
    significance: { en: 'Mercury governs Wednesday — intellect, speech, trade, and adaptability. This is the best day for intellectual pursuits: starting education, signing contracts, launching businesses, and any work involving communication or numbers. Mercury is called "Prince" (Kumara) among planets.', hi: 'बुध बुधवार का स्वामी — बुद्धि, वाणी, व्यापार। बौद्धिक कार्यों के लिए सर्वोत्तम: शिक्षा, अनुबंध, व्यवसाय।' },
  },
  { day: 4, en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः', planet: { en: 'Jupiter (Guru/Brihaspati)', hi: 'गुरु/बृहस्पति' }, color: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5',
    deity: { en: 'Lord Vishnu / Brihaspati', hi: 'विष्णु / बृहस्पति' },
    nature: { en: 'Benefic (Shubha)', hi: 'शुभ' },
    activities: { en: 'Religious ceremonies, education, marriage (excellent), starting new ventures, meeting teachers/gurus, charity, spiritual initiation', hi: 'धार्मिक अनुष्ठान, शिक्षा, विवाह (उत्कृष्ट), नए उपक्रम, गुरु मिलन, दान, दीक्षा' },
    avoid: { en: 'Travel to South (Disha Shool), lending money, hair cutting', hi: 'दक्षिण दिशा यात्रा, ऋण देना, केश कटाना' },
    hora: { en: 'Jupiter hora at sunrise', hi: 'सूर्योदय पर गुरु होरा' },
    significance: { en: 'Jupiter rules Thursday — wisdom, dharma, expansion, and blessings. The most auspicious weekday for religious and educational activities. Marriage on Thursday is highly favored. Jupiter is the Guru (teacher) of the Devas, and his day carries the energy of grace, prosperity, and righteous expansion.', hi: 'गुरु गुरुवार का स्वामी — ज्ञान, धर्म, विस्तार। धार्मिक और शैक्षिक कार्यों के लिए सर्वाधिक शुभ। गुरुवार विवाह अत्यधिक अनुकूल।' },
  },
  { day: 5, en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः', planet: { en: 'Venus (Shukra)', hi: 'शुक्र' }, color: 'text-pink-300', border: 'border-pink-500/20', bg: 'bg-pink-500/5',
    deity: { en: 'Goddess Lakshmi / Santoshi Maa', hi: 'लक्ष्मी / संतोषी माँ' },
    nature: { en: 'Benefic (Shubha)', hi: 'शुभ' },
    activities: { en: 'Marriage, romance, buying clothes/jewelry/vehicles, arts, music, dance, beauty treatments, entertainment, luxury purchases', hi: 'विवाह, प्रेम, वस्त्र/आभूषण/वाहन खरीद, कला, संगीत, नृत्य, सौंदर्य, मनोरंजन' },
    avoid: { en: 'Travel to West (Disha Shool), austerities, fasting (unless for Santoshi Maa)', hi: 'पश्चिम दिशा यात्रा, तपस्या' },
    hora: { en: 'Venus hora at sunrise', hi: 'सूर्योदय पर शुक्र होरा' },
    significance: { en: 'Venus governs Friday — love, beauty, luxury, arts, and material pleasures. Excellent for marriage, buying vehicles/jewelry, artistic pursuits, and anything related to comfort and aesthetics. Venus is the Guru of the Asuras, and his day carries the energy of desire, creativity, and refinement.', hi: 'शुक्र शुक्रवार का स्वामी — प्रेम, सौंदर्य, विलासिता, कला। विवाह, वाहन/आभूषण खरीद, कला के लिए उत्कृष्ट।' },
  },
  { day: 6, en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः', planet: { en: 'Saturn (Shani)', hi: 'शनि' }, color: 'text-slate-300', border: 'border-slate-500/20', bg: 'bg-slate-500/5',
    deity: { en: 'Lord Shani / Hanuman / Bhairav', hi: 'शनि देव / हनुमान / भैरव' },
    nature: { en: 'Cruel (Krura)', hi: 'क्रूर' },
    activities: { en: 'Iron/steel work, mining, oil industry, labor, servant hiring, property repair (not new), dealing with chronic matters', hi: 'लोहा/इस्पात कार्य, खनन, तेल उद्योग, श्रम, सेवक नियुक्ति, संपत्ति मरम्मत' },
    avoid: { en: 'Travel to East (Disha Shool), starting new ventures, marriage, buying new items, auspicious ceremonies', hi: 'पूर्व दिशा यात्रा, नए उपक्रम, विवाह, नई वस्तु खरीद, शुभ कार्य' },
    hora: { en: 'Saturn hora at sunrise', hi: 'सूर्योदय पर शनि होरा' },
    significance: { en: 'Saturn rules Saturday — discipline, karma, delays, and hard work. The most feared but also the most just planet. Saturday is generally avoided for starting new ventures, but excellent for completing tasks, dealing with laborers/servants, and confronting karmic debts. Oil and iron-related activities are favored.', hi: 'शनि शनिवार का स्वामी — अनुशासन, कर्म, विलंब। सबसे भयंकर लेकिन न्यायप्रिय ग्रह। नए कार्य आरम्भ से बचें, लेकिन कार्य पूर्ण करने के लिए उत्तम।' },
  },
];

export default function VaraPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  // Which day is today?
  const todayDay = new Date().getDay();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {isHi ? 'वार — सप्ताह के सात दिन' : 'Vara — The Seven Weekdays'}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {isHi
            ? 'वार (वासर) पञ्चाङ्ग का पाँचवाँ अंग है। प्रत्येक दिन एक ग्रह द्वारा शासित होता है, जो उस दिन की ऊर्जा, शुभ कार्यों और वर्जनाओं को निर्धारित करता है। वार ज्ञान मुहूर्त शास्त्र का आधार है — सही दिन पर सही कार्य करना सफलता का मूल है।'
            : 'Vara (weekday) is the 5th limb of the Panchang (पञ्च + अङ्ग = five limbs: Tithi, Nakshatra, Yoga, Karana, Vara). Each day is ruled by a planet, which determines the day\'s energy, favorable activities, and restrictions. Vara knowledge is foundational to Muhurta — choosing the right day for the right action is the essence of electional astrology.'}
        </p>
      </div>

      {/* The 5 Angas visual */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 border border-gold-primary/15">
        <h3 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 text-center">{isHi ? 'पञ्चाङ्ग — पाँच अंग' : 'Panchanga — The Five Limbs'}</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { name: { en: 'Tithi', hi: 'तिथि' }, desc: { en: 'Lunar day', hi: 'चंद्र दिन' }, color: 'text-amber-400' },
            { name: { en: 'Nakshatra', hi: 'नक्षत्र' }, desc: { en: 'Lunar mansion', hi: 'चंद्र गृह' }, color: 'text-blue-300' },
            { name: { en: 'Yoga', hi: 'योग' }, desc: { en: 'Sun+Moon sum', hi: 'सूर्य+चंद्र योग' }, color: 'text-emerald-400' },
            { name: { en: 'Karana', hi: 'करण' }, desc: { en: 'Half tithi', hi: 'अर्ध तिथि' }, color: 'text-violet-400' },
            { name: { en: 'Vara', hi: 'वार' }, desc: { en: 'Weekday', hi: 'सप्ताह दिन' }, color: 'text-gold-light' },
          ].map((anga, i) => (
            <div key={i} className={`px-4 py-3 rounded-xl border border-gold-primary/15 text-center min-w-[100px] ${i === 4 ? 'bg-gold-primary/10 border-gold-primary/30 ring-1 ring-gold-primary/20' : 'bg-bg-secondary/30'}`}>
              <div className={`font-bold text-sm ${anga.color}`} style={headingFont}>{isHi ? anga.name.hi : anga.name.en}</div>
              <div className="text-text-tertiary text-[10px] mt-0.5">{isHi ? anga.desc.hi : anga.desc.en}</div>
            </div>
          ))}
        </div>
        <p className="text-text-tertiary text-[10px] text-center mt-3">{isHi ? 'वार वर्तमान पृष्ठ पर प्रकाशित (हाइलाइट)' : 'Vara is highlighted — you are here'}</p>
      </div>

      {/* ═══ India's Contribution: Why This Order? ═══ */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <h3 className="text-gold-gradient font-bold text-xl mb-4" style={headingFont}>
          {isHi ? 'भारत का योगदान: सप्ताह के दिनों का क्रम क्यों?' : "India's Gift to the World: Why This Weekday Order?"}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          {isHi
            ? 'सोमवार के बाद मंगलवार क्यों? बुधवार के बाद गुरुवार क्यों? यह क्रम यादृच्छिक नहीं है — यह प्राचीन भारतीय खगोल विज्ञान से आता है। ग्रहों की कक्षीय गति और होरा (ग्रह घंटे) प्रणाली का यह अद्भुत गणितीय परिणाम है जो पूरी दुनिया ने अपनाया।'
            : 'Why does Monday follow Sunday? Why Tuesday after Monday? This sequence is NOT random — it derives from ancient Indian astronomy. It is an elegant mathematical consequence of orbital speeds and the Hora (planetary hour) system. This Indian innovation was adopted by the entire world.'}
        </p>

        {/* Step 1: Orbital Speed Order */}
        <div className="mb-6">
          <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">
            {isHi ? 'चरण 1: कक्षीय गति क्रम (सबसे धीमे से तेज़)' : 'Step 1: Orbital Speed Order (Slowest to Fastest)'}
          </div>
          <p className="text-text-secondary text-xs mb-3 leading-relaxed">
            {isHi
              ? 'प्राचीन भारतीय खगोलशास्त्रियों ने सात दृश्य ग्रहों (पंचग्रह + सूर्य + चन्द्र) को उनकी आभासी गति के आधार पर क्रमबद्ध किया। सबसे धीमा ग्रह (शनि, ~29 वर्ष) सबसे दूर माना गया, सबसे तेज़ (चन्द्र, ~27 दिन) सबसे निकट:'
              : 'Ancient Indian astronomers ordered the seven visible celestial bodies by their apparent orbital period. The slowest (Saturn, ~29 years) was considered farthest, the fastest (Moon, ~27 days) nearest. This gave the "Chaldean order":'}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 mb-2">
            {[
              { name: { en: 'Saturn', hi: 'शनि' }, period: '29.5 yr', color: 'text-slate-300', border: 'border-slate-500/20' },
              { name: { en: 'Jupiter', hi: 'गुरु' }, period: '11.9 yr', color: 'text-yellow-400', border: 'border-yellow-500/20' },
              { name: { en: 'Mars', hi: 'मंगल' }, period: '1.88 yr', color: 'text-red-400', border: 'border-red-500/20' },
              { name: { en: 'Sun', hi: 'सूर्य' }, period: '1 yr', color: 'text-amber-400', border: 'border-amber-500/20' },
              { name: { en: 'Venus', hi: 'शुक्र' }, period: '225 d', color: 'text-pink-300', border: 'border-pink-500/20' },
              { name: { en: 'Mercury', hi: 'बुध' }, period: '88 d', color: 'text-emerald-400', border: 'border-emerald-500/20' },
              { name: { en: 'Moon', hi: 'चन्द्र' }, period: '27.3 d', color: 'text-blue-300', border: 'border-blue-500/20' },
            ].map((p, i) => (
              <div key={i} className="flex flex-col items-center">
                {i > 0 && <span className="text-text-tertiary text-[10px] mb-0.5">→</span>}
                <div className={`px-3 py-2 rounded-lg border ${p.border} text-center min-w-[70px]`}>
                  <div className={`font-bold text-xs ${p.color}`}>{isHi ? p.name.hi : p.name.en}</div>
                  <div className="text-text-tertiary text-[9px]">{p.period}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-text-tertiary text-[10px] text-center">{isHi ? 'शनि ← सबसे धीमा (दूर) | चन्द्र ← सबसे तेज़ (निकट)' : 'Saturn ← slowest (farthest) | Moon ← fastest (nearest)'}</p>
        </div>

        {/* Step 2: Hora System */}
        <div className="mb-6">
          <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">
            {isHi ? 'चरण 2: होरा प्रणाली — प्रत्येक घंटे का ग्रह स्वामी' : 'Step 2: The Hora System — Each Hour Has a Planetary Ruler'}
          </div>
          <p className="text-text-secondary text-xs mb-3 leading-relaxed">
            {isHi
              ? 'प्रत्येक दिन को 24 होराओं (घंटों) में विभाजित किया गया, प्रत्येक होरा ऊपर के क्रम में एक ग्रह द्वारा शासित। यह क्रम निरंतर चलता है — शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चन्द्र, फिर शनि... अनंत।'
              : 'Each day was divided into 24 horas (hours), each ruled by a planet in the orbital speed order above. This cycle repeats endlessly: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Saturn, Jupiter...'}
          </p>

          {/* Hora table for Saturday-Sunday showing the derivation */}
          <div className="overflow-x-auto mb-3">
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 border border-gold-primary/10">
              <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'शनिवार की 24 होराएं' : "Saturday's 24 Horas"}</div>
              <div className="flex flex-wrap gap-1 text-[9px]">
                {['Sa','Ju','Ma','Su','Ve','Me','Mo', 'Sa','Ju','Ma','Su','Ve','Me','Mo', 'Sa','Ju','Ma','Su','Ve','Me','Mo', 'Sa','Ju','Ma'].map((h, i) => (
                  <span key={i} className={`px-1.5 py-0.5 rounded ${i === 0 ? 'bg-gold-primary/20 text-gold-light font-bold ring-1 ring-gold-primary/40' : 'bg-bg-secondary/50 text-text-tertiary'}`}>
                    {i+1}:{h}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-[9px]">
                <span className="text-text-tertiary">{isHi ? '25वीं होरा (= अगले दिन की पहली) =' : '25th hora (= next day\'s 1st) ='}</span>
                <span className="text-amber-400 font-bold ml-1">{isHi ? 'सूर्य → इसलिए अगला दिन = रविवार!' : 'Sun → so the next day = Sunday!'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: The Derivation */}
        <div className="mb-6">
          <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">
            {isHi ? 'चरण 3: वार क्रम की उत्पत्ति' : 'Step 3: Deriving the Weekday Order'}
          </div>
          <p className="text-text-secondary text-xs mb-3 leading-relaxed">
            {isHi
              ? 'प्रत्येक दिन का नाम उसकी पहली होरा के स्वामी ग्रह पर रखा गया। 24 होरा बाद (अगला दिन), 7-ग्रह चक्र में 24 mod 7 = 3 कदम आगे बढ़ जाता है। इसलिए कक्षीय क्रम (शनि-गुरु-मंगल-सूर्य-शुक्र-बुध-चन्द्र) से हर 3 कदम छोड़कर पढ़ें:'
              : 'Each day is named after its 1st hora\'s ruling planet. After 24 horas (next day), the 7-planet cycle advances by 24 mod 7 = 3 positions. So from the orbital order, skip every 3rd planet:'}
          </p>

          {/* Visual: the skip-3 derivation */}
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 border border-gold-primary/15">
            <div className="text-center space-y-2 text-xs">
              <div className="text-text-tertiary">{isHi ? 'कक्षीय क्रम:' : 'Orbital order:'} <span className="text-slate-300">Sa</span> <span className="text-yellow-400">Ju</span> <span className="text-red-400">Ma</span> <span className="text-amber-400">Su</span> <span className="text-pink-300">Ve</span> <span className="text-emerald-400">Me</span> <span className="text-blue-300">Mo</span> (repeat)</div>
              <div className="text-text-secondary">{isHi ? '3 छोड़कर पढ़ें:' : 'Read every 3rd:'}</div>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { name: 'Sa', full: { en: 'Saturn → Saturday', hi: 'शनि → शनिवार' }, color: 'text-slate-300', border: 'border-slate-500/25' },
                  { name: 'Su', full: { en: 'Sun → Sunday', hi: 'सूर्य → रविवार' }, color: 'text-amber-400', border: 'border-amber-500/25' },
                  { name: 'Mo', full: { en: 'Moon → Monday', hi: 'चन्द्र → सोमवार' }, color: 'text-blue-300', border: 'border-blue-500/25' },
                  { name: 'Ma', full: { en: 'Mars → Tuesday', hi: 'मंगल → मंगलवार' }, color: 'text-red-400', border: 'border-red-500/25' },
                  { name: 'Me', full: { en: 'Mercury → Wednesday', hi: 'बुध → बुधवार' }, color: 'text-emerald-400', border: 'border-emerald-500/25' },
                  { name: 'Ju', full: { en: 'Jupiter → Thursday', hi: 'गुरु → गुरुवार' }, color: 'text-yellow-400', border: 'border-yellow-500/25' },
                  { name: 'Ve', full: { en: 'Venus → Friday', hi: 'शुक्र → शुक्रवार' }, color: 'text-pink-300', border: 'border-pink-500/25' },
                ].map((d, i) => (
                  <div key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-gold-primary">→</span>}
                    <div className={`px-2.5 py-1.5 rounded-lg border ${d.border}`}>
                      <div className={`font-bold text-sm ${d.color}`}>{d.name}</div>
                      <div className="text-[8px] text-text-tertiary">{isHi ? d.full.hi : d.full.en}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gold-primary text-xs font-medium mt-2">
                {isHi
                  ? 'शनि → सूर्य → चन्द्र → मंगल → बुध → गुरु → शुक्र = शनिवार → रविवार → सोमवार → मंगलवार → बुधवार → गुरुवार → शुक्रवार!'
                  : 'Sa → Su → Mo → Ma → Me → Ju → Ve = Saturday → Sunday → Monday → Tuesday → Wednesday → Thursday → Friday!'}
              </p>
            </div>
          </div>
        </div>

        {/* Historical context */}
        <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
          <div className="text-indigo-400 text-[10px] uppercase tracking-widest font-bold mb-2">
            {isHi ? 'ऐतिहासिक संदर्भ' : 'Historical Context'}
          </div>
          <div className="text-text-secondary text-xs leading-relaxed space-y-2">
            <p>{isHi
              ? 'यह होरा-आधारित वार प्रणाली सूर्य सिद्धान्त (पहली शताब्दी ईस्वी से पूर्व) और वराहमिहिर के पञ्चसिद्धान्तिका (505 ई.) में प्रलेखित है। भारत से यह प्रणाली ग्रीस, रोम और फिर पूरी दुनिया में फैली।'
              : 'This Hora-based weekday system is documented in the Surya Siddhanta (pre-1st century CE) and Varahamihira\'s Pancha Siddhantika (505 CE). From India, it spread to Greece, Rome, and then the entire world.'}</p>
            <p>{isHi
              ? 'सभी भाषाओं में दिनों के नाम ग्रहों से ही हैं: Sunday (Sun), Monday (Moon), Saturday (Saturn), Tuesday (Tiw/Mars), Wednesday (Woden/Mercury), Thursday (Thor/Jupiter), Friday (Freya/Venus)। मूल भारतीय नाम — रवि, सोम, मंगल, बुध, गुरु, शुक्र, शनि — सबसे प्रत्यक्ष हैं।'
              : 'Every language names its days after planets: Sunday (Sun), Monday (Moon), Saturday (Saturn). The Germanic names use Norse gods mapped to planets: Tuesday (Tiw=Mars), Wednesday (Woden=Mercury), Thursday (Thor=Jupiter), Friday (Freya=Venus). The Indian names — Ravi, Soma, Mangal, Budha, Guru, Shukra, Shani — are the most direct and transparent.'}</p>
            <p className="text-indigo-300 font-medium">{isHi
              ? '💡 अगली बार जब कोई "Wednesday" कहे, याद रखें — यह बुधवार (बुध-वार = बुध का दिन) है, एक भारतीय खगोलीय खोज!'
              : '💡 Next time someone says "Wednesday", remember — it\'s Budhavar (Budha-vara = Mercury\'s day), an Indian astronomical discovery!'}</p>
          </div>
        </div>

        {/* Cross-cultural names table */}
        <div className="mt-6 overflow-x-auto">
          <h4 className="text-gold-light font-bold text-sm mb-3" style={headingFont}>{isHi ? 'विश्व भर में ग्रह-आधारित दिन नाम' : 'Planet-Based Day Names Across the World'}</h4>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'संस्कृत' : 'Sanskrit'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'हिन्दी' : 'Hindi'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">English</th>
                <th className="text-left py-2 px-2 text-gold-dark">Latin/French</th>
                <th className="text-left py-2 px-2 text-gold-dark">Japanese</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { planet: 'Sun', sa: 'रविवासरः', hi: 'रविवार', en: 'Sunday', latin: 'Dies Solis / Dimanche', jp: '日曜日 (Nichiyōbi)' },
                { planet: 'Moon', sa: 'सोमवासरः', hi: 'सोमवार', en: 'Monday', latin: 'Dies Lunae / Lundi', jp: '月曜日 (Getsuyōbi)' },
                { planet: 'Mars', sa: 'मङ्गलवासरः', hi: 'मंगलवार', en: 'Tuesday', latin: 'Dies Martis / Mardi', jp: '火曜日 (Kayōbi)' },
                { planet: 'Mercury', sa: 'बुधवासरः', hi: 'बुधवार', en: 'Wednesday', latin: 'Dies Mercurii / Mercredi', jp: '水曜日 (Suiyōbi)' },
                { planet: 'Jupiter', sa: 'गुरुवासरः', hi: 'गुरुवार', en: 'Thursday', latin: 'Dies Jovis / Jeudi', jp: '木曜日 (Mokuyōbi)' },
                { planet: 'Venus', sa: 'शुक्रवासरः', hi: 'शुक्रवार', en: 'Friday', latin: 'Dies Veneris / Vendredi', jp: '金曜日 (Kinyōbi)' },
                { planet: 'Saturn', sa: 'शनिवासरः', hi: 'शनिवार', en: 'Saturday', latin: 'Dies Saturni / Samedi', jp: '土曜日 (Doyōbi)' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gold-primary/3">
                  <td className="py-1.5 px-2 text-gold-light font-medium">{row.planet}</td>
                  <td className="py-1.5 px-2 text-text-secondary" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{row.sa}</td>
                  <td className="py-1.5 px-2 text-text-secondary" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{row.hi}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{row.en}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{row.latin}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{row.jp}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-text-tertiary text-[9px] mt-2 text-center">{isHi ? 'जापानी नाम भी ग्रह तत्वों पर आधारित: 日=सूर्य, 月=चन्द्र, 火=अग्नि(मंगल), 水=जल(बुध), 木=काष्ठ(गुरु), 金=धातु(शुक्र), 土=पृथ्वी(शनि)' : 'Japanese names use elemental associations: 日=Sun, 月=Moon, 火=Fire(Mars), 水=Water(Mercury), 木=Wood(Jupiter), 金=Metal(Venus), 土=Earth(Saturn)'}</p>
        </div>
      </div>

      {/* Day detail cards */}
      <div className="space-y-4">
        {VARAS.map((vara, i) => {
          const isToday = vara.day === todayDay;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl border ${vara.border} overflow-hidden ${isToday ? 'ring-2 ring-gold-primary/30' : ''}`}>
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-3 ${vara.bg}`}>
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-black ${vara.color}`} style={headingFont}>{isHi ? vara.hi : vara.en}</span>
                  {isHi && <span className="text-text-tertiary text-xs">({vara.en})</span>}
                  <span className="text-text-secondary text-xs">{isHi ? vara.planet.hi : vara.planet.en}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isToday && <span className="px-2 py-0.5 rounded-full bg-gold-primary/20 text-gold-light text-[10px] font-bold animate-pulse">{isHi ? 'आज' : 'TODAY'}</span>}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${vara.nature.en.includes('Cruel') ? 'border-red-500/20 text-red-400' : vara.nature.en.includes('Benefic') ? 'border-emerald-500/20 text-emerald-400' : 'border-amber-500/20 text-amber-400'}`}>
                    {isHi ? vara.nature.hi : vara.nature.en}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {/* Significance */}
                <p className="text-text-secondary text-xs leading-relaxed">{isHi ? vara.significance.hi : vara.significance.en}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Favourable */}
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                    <div className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-1">{isHi ? 'अनुकूल कार्य' : 'Favorable Activities'}</div>
                    <div className="text-text-secondary text-xs leading-relaxed">{isHi ? vara.activities.hi : vara.activities.en}</div>
                  </div>
                  {/* Avoid */}
                  <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/15">
                    <div className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-1">{isHi ? 'वर्जित' : 'Avoid'}</div>
                    <div className="text-text-secondary text-xs leading-relaxed">{isHi ? vara.avoid.hi : vara.avoid.en}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-text-tertiary">
                  <span>{isHi ? 'देवता' : 'Deity'}: <span className="text-gold-light">{isHi ? vara.deity.hi : vara.deity.en}</span></span>
                  <span>{isHi ? 'होरा' : 'Hora'}: <span className="text-text-secondary">{isHi ? vara.hora.hi : vara.hora.en}</span></span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Vara in Muhurta */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-gold-primary/15">
        <h3 className="text-gold-light font-bold text-lg mb-3" style={headingFont}>
          {isHi ? 'मुहूर्त में वार का महत्व' : 'Vara in Muhurta Selection'}
        </h3>
        <div className="text-text-secondary text-xs leading-relaxed space-y-2">
          <p>{isHi
            ? 'मुहूर्त शास्त्र में वार पहला विचार है। कोई भी शुभ कार्य शुरू करने से पहले, वार की उपयुक्तता जाँचें। सामान्य नियम:'
            : 'In Muhurta Shastra, Vara is the first consideration. Before starting any auspicious activity, check the suitability of the weekday. General rules:'}</p>
          <ul className="space-y-1 ml-4">
            <li>{isHi ? '• गुरुवार और शुक्रवार सर्वाधिक शुभ — लगभग सभी कार्यों के लिए' : '• Thursday and Friday are most auspicious — suitable for nearly all activities'}</li>
            <li>{isHi ? '• बुधवार बौद्धिक और व्यावसायिक कार्यों के लिए उत्तम' : '• Wednesday is excellent for intellectual and commercial activities'}</li>
            <li>{isHi ? '• सोमवार यात्रा और जन-संपर्क के लिए अच्छा' : '• Monday is good for travel and public dealings'}</li>
            <li>{isHi ? '• रविवार, मंगलवार, शनिवार "क्रूर" वार — शुभ कार्यों में सावधानी' : '• Sunday, Tuesday, Saturday are "cruel" days — caution for auspicious work'}</li>
            <li>{isHi ? '• वार + तिथि + नक्षत्र + योग + करण — पाँचों अंगों का समन्वय देखें' : '• Always check all 5 limbs together: Vara + Tithi + Nakshatra + Yoga + Karana'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

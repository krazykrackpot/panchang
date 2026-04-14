'use client';


import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/matching.json';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
const KUTAS = [
  {
    num: 1, name: { en: 'Varna', hi: 'वर्ण', sa: 'वर्णः' }, points: 1,
    what: { en: 'Spiritual compatibility & ego harmony', hi: 'आध्यात्मिक अनुकूलता और अहंकार सामंजस्य', sa: 'आध्यात्मिकानुकूलता अहंकारसामंजस्यं च' },
    how: { en: 'Compares the Varna (spiritual class) assigned to each Nakshatra. The 4 Varnas are Brahmin (highest spiritual), Kshatriya, Vaishya, and Shudra. Full point if groom\'s Varna is equal or higher than bride\'s. This Kuta reflects spiritual ego — whether one partner will feel dominated. In practice, this 1-point factor rarely makes or breaks a match.', hi: 'प्रत्येक नक्षत्र को दिए गए वर्ण (आध्यात्मिक वर्ग) की तुलना करता है। 4 वर्ण हैं: ब्राह्मण (उच्चतम), क्षत्रिय, वैश्य, शूद्र। पूर्ण अंक यदि वर का वर्ण वधू के बराबर या अधिक हो। यह कूट आध्यात्मिक अहंकार को दर्शाता है।', sa: 'प्रत्येकनक्षत्रस्य वर्णं (आध्यात्मिकवर्गम्) तुलयति। चत्वारो वर्णाः — ब्राह्मणः, क्षत्रियः, वैश्यः, शूद्रः।' },
    scoring: { en: 'Groom Varna >= Bride Varna → 1 pt | Otherwise → 0 pts', hi: 'वर वर्ण >= वधू वर्ण → 1 अंक | अन्यथा → 0', sa: 'वरवर्णः >= वधूवर्णः → 1 | अन्यथा → 0' },
    example: { en: 'Example: Groom in Ashwini (Kshatriya) + Bride in Bharani (Shudra) → 1 pt (Kshatriya > Shudra)', hi: 'उदाहरण: वर अश्विनी (क्षत्रिय) + वधू भरणी (शूद्र) → 1 अंक', sa: 'उदाहरणम्: वरः अश्विन्याम् (क्षत्रियः) + वधूः भरण्याम् (शूद्रः) → 1 अङ्कः' },
  },
  {
    num: 2, name: { en: 'Vashya', hi: 'वश्य', sa: 'वश्यम्' }, points: 2,
    what: { en: 'Mutual attraction, influence & dominance dynamics', hi: 'पारस्परिक आकर्षण, प्रभाव और प्रभुत्व गतिशीलता', sa: 'पारस्परिकाकर्षणं प्रभावः प्रभुत्वगतिशीलता च' },
    how: { en: 'Each Rashi falls into one of 5 attraction categories: Chatushpada (quadruped — Aries, Taurus, 2nd half Sagittarius, 1st half Capricorn), Manava (human — Gemini, Virgo, Libra, 1st half Sagittarius, Aquarius), Jalachara (water — Cancer, Pisces, 2nd half Capricorn), Vanachara (wild — Leo), and Keeta (insect — Scorpio). If one partner\'s Rashi is Vashya (subservient) to the other, attraction is natural.', hi: 'प्रत्येक राशि 5 आकर्षण श्रेणियों में से एक में आती है: चतुष्पाद, मानव, जलचर, वनचर, कीट। यदि एक साथी की राशि दूसरे की वश्य हो तो आकर्षण स्वाभाविक होता है।', sa: 'प्रत्येकराशिः पञ्चसु आकर्षणवर्गेषु एकस्मिन् भवति: चतुष्पादः, मानवः, जलचरः, वनचरः, कीटः।' },
    scoring: { en: 'Both Vashya to each other → 2 pts | One Vashya → 1 pt | Neither → 0.5 pts | Sworn enemies → 0 pts', hi: 'दोनों एक-दूसरे की वश्य → 2 | एक वश्य → 1 | कोई नहीं → 0.5 | परम शत्रु → 0', sa: 'उभे परस्परवश्ये → 2 | एकं वश्यम् → 1 | किमपि न → 0.5 | परमशत्रू → 0' },
    example: { en: 'Example: Aries (Chatushpada) + Leo (Vanachara) → Leo is Vashya to Aries → 1 pt', hi: 'उदाहरण: मेष (चतुष्पाद) + सिंह (वनचर) → सिंह मेष की वश्य → 1 अंक', sa: 'उदाहरणम्: मेषः (चतुष्पादः) + सिंहः (वनचरः) → 1 अङ्कः' },
  },
  {
    num: 3, name: { en: 'Tara', hi: 'तारा', sa: 'तारा' }, points: 3,
    what: { en: 'Destiny compatibility & birth star harmony', hi: 'भाग्य अनुकूलता और जन्म नक्षत्र सामंजस्य', sa: 'भाग्यानुकूलता जन्मनक्षत्रसामंजस्यं च' },
    how: { en: 'Count from bride\'s Nakshatra to groom\'s (and vice versa), then divide by 9. The remainder gives the Tara number (1-9). Each Tara has a quality: 1-Janma (birth), 2-Sampat (wealth), 3-Vipat (danger), 4-Kshema (prosperity), 5-Pratyari (obstacles), 6-Sadhaka (achievement), 7-Vadha (death), 8-Mitra (friend), 9-Parama Mitra (best friend). Taras 1, 2, 4, 6, 8, 9 are auspicious; 3, 5, 7 are inauspicious. Both directions must yield auspicious Taras for full points.', hi: 'वधू के नक्षत्र से वर के नक्षत्र तक गिनें (और विपरीत), फिर 9 से भाग दें। शेषफल तारा संख्या (1-9) देता है। तारा 1,2,4,6,8,9 शुभ; 3,5,7 अशुभ। दोनों दिशाओं में शुभ तारा होना चाहिए।', sa: 'वध्वाः नक्षत्रात् वरस्य नक्षत्रं पर्यन्तं गणयन्तु, 9 भागं कुर्वन्तु। शेषफलं ताराम् ददाति।' },
    scoring: { en: 'Both directions auspicious → 3 pts | One direction auspicious → 1.5 pts | Neither → 0 pts', hi: 'दोनों दिशाएँ शुभ → 3 | एक शुभ → 1.5 | कोई नहीं → 0', sa: 'उभे दिशे शुभे → 3 | एका शुभा → 1.5 | काऽपि न → 0' },
    example: { en: 'Example: Ashwini (1) to Rohini (4) → count = 4, 4÷9 remainder = 4 (Kshema = auspicious)', hi: 'उदाहरण: अश्विनी (1) से रोहिणी (4) → गिनती = 4, 4÷9 शेष = 4 (क्षेम = शुभ)', sa: 'उदाहरणम्: अश्विनी (1) रोहिणीं (4) प्रति → गणना = 4, 4÷9 शेषः = 4 (क्षेमम् = शुभम्)' },
  },
  {
    num: 4, name: { en: 'Yoni', hi: 'योनि', sa: 'योनिः' }, points: 4,
    what: { en: 'Physical and sexual compatibility — intimacy harmony', hi: 'शारीरिक और यौन अनुकूलता — अन्तरंगता सामंजस्य', sa: 'शारीरिकयौनानुकूलता — अन्तरंगतासामंजस्यम्' },
    how: { en: 'Each Nakshatra is assigned an animal symbol (Yoni): Horse, Elephant, Sheep, Snake, Dog, Cat, Rat, Cow, Buffalo, Tiger, Deer, Monkey, Mongoose, Lion. Each animal has a gender (male/female). Compatibility is assessed based on the relationship between the two animals — some are natural allies, others are enemies.', hi: 'प्रत्येक नक्षत्र को एक पशु चिह्न (योनि) दिया गया है: अश्व, गज, मेष, सर्प, श्वान, मार्जार, मूषक, गौ, महिष, व्याघ्र, मृग, वानर, नकुल, सिंह। प्रत्येक पशु का लिंग (नर/मादा) है। दो पशुओं के सम्बन्ध के आधार पर अनुकूलता आँकी जाती है।', sa: 'प्रत्येकनक्षत्राय पशुचिह्नं (योनिः) दीयते। द्वयोः पशूनां सम्बन्धस्य आधारेण अनुकूलता आकल्यते।' },
    scoring: { en: 'Same Yoni (same animal) → 4 pts | Friendly animals → 3 pts | Neutral → 2 pts | Enemy → 1 pt | Sworn enemies (e.g., Snake-Mongoose, Cat-Rat) → 0 pts', hi: 'समान योनि → 4 | मित्र → 3 | तटस्थ → 2 | शत्रु → 1 | परम शत्रु (सर्प-नकुल, मार्जार-मूषक) → 0', sa: 'समानयोनिः → 4 | मित्राणि → 3 | तटस्थम् → 2 | शत्रुः → 1 | परमशत्रू → 0' },
    example: { en: 'Example: Ashwini (Horse-Male) + Shatabhisha (Horse-Female) → Same Yoni → 4 pts', hi: 'उदाहरण: अश्विनी (अश्व-नर) + शतभिषा (अश्व-मादा) → समान योनि → 4 अंक', sa: 'उदाहरणम्: अश्विनी (अश्वः-पुमान्) + शतभिषा (अश्वः-स्त्री) → समानयोनिः → 4 अङ्काः' },
  },
  {
    num: 5, name: { en: 'Graha Maitri', hi: 'ग्रह मैत्री', sa: 'ग्रहमैत्री' }, points: 5,
    what: { en: 'Mental and intellectual compatibility — friendship of ruling planets', hi: 'मानसिक और बौद्धिक अनुकूलता — शासक ग्रहों की मैत्री', sa: 'मानसिकबौद्धिकानुकूलता — शासकग्रहयोः मैत्री' },
    how: { en: 'This Kuta compares the planetary lords (Rashi Adhipati) of both partners\' Moon signs. The natural friendship table of planets is used: Sun is friends with Moon, Mars, Jupiter; enemies with Venus, Saturn; neutral to Mercury — and so on. If both lords are mutual friends, the couple will think alike and have natural mental rapport.', hi: 'यह कूट दोनों साथियों की चन्द्र राशियों के ग्रह स्वामियों (राशि अधिपति) की तुलना करता है। ग्रहों की नैसर्गिक मैत्री तालिका का उपयोग होता है। यदि दोनों स्वामी परस्पर मित्र हैं तो दम्पत्ति एक-समान सोचेंगे।', sa: 'एतत् कूटम् उभयोः चन्द्रराशिस्वामिनोः तुलनां करोति। ग्रहाणां नैसर्गिकमैत्रीसारणी प्रयुज्यते।' },
    scoring: { en: 'Both lords friends → 5 pts | One friend + one neutral → 4 pts | Both neutral → 3 pts | One friend + one enemy → 1 pt | Both enemies → 0 pts', hi: 'दोनों स्वामी मित्र → 5 | एक मित्र + एक तटस्थ → 4 | दोनों तटस्थ → 3 | एक मित्र + एक शत्रु → 1 | दोनों शत्रु → 0', sa: 'उभौ स्वामिनौ मित्रौ → 5 | एकः मित्रः + एकः तटस्थः → 4 | उभौ तटस्थौ → 3 | उभौ शत्रू → 0' },
    example: { en: 'Example: Moon in Cancer (lord Moon) + Moon in Pisces (lord Jupiter) → Moon-Jupiter are friends → 5 pts', hi: 'उदाहरण: कर्क राशि (स्वामी चन्द्र) + मीन राशि (स्वामी गुरु) → चन्द्र-गुरु मित्र → 5 अंक', sa: 'उदाहरणम्: कर्कराशिः (स्वामी चन्द्रः) + मीनराशिः (स्वामी गुरुः) → चन्द्रगुरू मित्रौ → 5 अङ्काः' },
  },
  {
    num: 6, name: { en: 'Gana', hi: 'गण', sa: 'गणः' }, points: 6,
    what: { en: 'Temperament and behavioral compatibility — daily harmony', hi: 'स्वभाव और व्यवहारिक अनुकूलता — दैनिक सामंजस्य', sa: 'स्वभावव्यवहारानुकूलता — दैनिकसामंजस्यम्' },
    how: { en: 'Each Nakshatra belongs to one of 3 Ganas (temperaments): Deva (divine — gentle, pious, forgiving), Manushya (human — practical, balanced, worldly), Rakshasa (demonic — bold, independent, aggressive). Despite the names, Rakshasa Gana is not "evil" — it indicates strong willpower and self-reliance. The key is compatibility: two Deva Gana people may be too passive together; two Rakshasa may clash fiercely; a Deva-Rakshasa pair often faces the most friction.', hi: 'प्रत्येक नक्षत्र 3 गणों (स्वभावों) में से एक का है: देव (दिव्य — सौम्य, धार्मिक), मनुष्य (मानवीय — व्यावहारिक, संतुलित), राक्षस (राक्षसी — साहसी, स्वतन्त्र)। नामों के बावजूद, राक्षस गण "बुरा" नहीं है — यह दृढ़ इच्छाशक्ति दर्शाता है।', sa: 'प्रत्येकनक्षत्रं त्रिषु गणेषु एकस्मिन् भवति: देवः, मनुष्यः, राक्षसः। नामभिः विना राक्षसगणः "दुष्टः" नास्ति।' },
    scoring: { en: 'Same Gana → 6 pts | Deva-Manushya → 5 pts | Manushya-Rakshasa → 1 pt | Deva-Rakshasa → 0 pts', hi: 'समान गण → 6 | देव-मनुष्य → 5 | मनुष्य-राक्षस → 1 | देव-राक्षस → 0', sa: 'समानगणः → 6 | देवमनुष्यौ → 5 | मनुष्यराक्षसौ → 1 | देवराक्षसौ → 0' },
    example: { en: 'Example: Ashwini (Deva) + Bharani (Manushya) → Deva-Manushya → 5 pts', hi: 'उदाहरण: अश्विनी (देव) + भरणी (मनुष्य) → देव-मनुष्य → 5 अंक', sa: 'उदाहरणम्: अश्विनी (देवः) + भरणी (मनुष्यः) → देवमनुष्यौ → 5 अङ्काः' },
  },
  {
    num: 7, name: { en: 'Bhakoot', hi: 'भकूट', sa: 'भकूटम्' }, points: 7,
    what: { en: 'Emotional connection, prosperity & progeny — the couple\'s shared fortune', hi: 'भावनात्मक सम्बन्ध, समृद्धि और सन्तान — दम्पत्ति का साझा भाग्य', sa: 'भावनात्मकसम्बन्धः समृद्धिः सन्तानं च — दम्पत्योः साझाभाग्यम्' },
    how: { en: 'Compares the Moon Rashis of both partners. The relative position of their Rashis determines the score. Three combinations are considered inauspicious: 2/12 positions (financial strain, wasteful spending), 5/9 positions (difficulty with children, disagreements on values), and 6/8 positions (health troubles, separation, accidents). If neither Rashi falls in these pairs, full 7 points are awarded. Bhakoot Dosha can be cancelled if the lords of both Rashis are friends.', hi: 'दोनों साथियों की चन्द्र राशियों की तुलना। उनकी राशियों की सापेक्ष स्थिति अंक निर्धारित करती है। तीन संयोजन अशुभ: 2/12 (आर्थिक तनाव), 5/9 (सन्तान कठिनाई), 6/8 (स्वास्थ्य, वियोग)। यदि कोई अशुभ जोड़ा नहीं → पूर्ण 7 अंक।', sa: 'उभयोः चन्द्रराश्योः तुलनां करोति। तयोः सापेक्षस्थितिः अङ्कान् निर्धारयति।' },
    scoring: { en: 'No inauspicious pair → 7 pts | 2/12 or 5/9 or 6/8 pair → 0 pts (Bhakoot Dosha) | Cancelled by lord friendship → 7 pts restored', hi: 'कोई अशुभ जोड़ा नहीं → 7 | 2/12 या 5/9 या 6/8 → 0 (भकूट दोष) | स्वामी मैत्री से निरस्त → 7 पुनःस्थापित', sa: 'अशुभयुग्मं नास्ति → 7 | 2/12 वा 5/9 वा 6/8 → 0 | स्वामिमैत्र्या निरस्तम् → 7 पुनःस्थापितम्' },
    example: { en: 'Example: Aries (1) + Virgo (6) → 1/6 = 6/8 pair → Bhakoot Dosha → 0 pts. But Mars (Aries lord) and Mercury (Virgo lord) are neutral, so no cancellation.', hi: 'उदाहरण: मेष (1) + कन्या (6) → 1/6 = 6/8 जोड़ा → भकूट दोष → 0 अंक।', sa: 'उदाहरणम्: मेषः (1) + कन्या (6) → 6/8 युग्मम् → भकूटदोषः → 0 अङ्काः।' },
  },
  {
    num: 8, name: { en: 'Nadi', hi: 'नाड़ी', sa: 'नाडी' }, points: 8,
    what: { en: 'Health, genetic compatibility & progeny wellness — the most critical factor', hi: 'स्वास्थ्य, आनुवंशिक अनुकूलता और सन्तान कल्याण — सबसे महत्वपूर्ण कारक', sa: 'स्वास्थ्यम् आनुवंशिकानुकूलता सन्तानकल्याणं च — सर्वमहत्त्वपूर्णकारकः' },
    how: { en: 'Each Nakshatra is assigned one of 3 Nadis: Aadi (Vata — air/wind constitution), Madhya (Pitta — fire/bile constitution), or Antya (Kapha — water/phlegm constitution). These correspond to Ayurvedic body types. If both partners share the same Nadi, it is believed their constitutional imbalance will be amplified in their children, potentially causing health issues. Different Nadis ensure a balanced constitution in offspring. This is the highest-weighted Kuta because health and progeny are considered the foundation of marriage.', hi: 'प्रत्येक नक्षत्र 3 नाड़ियों में से एक का है: आदि (वात — वायु संविधान), मध्य (पित्त — अग्नि संविधान), अन्त्य (कफ — जल संविधान)। ये आयुर्वेदिक शरीर प्रकारों से सम्बन्धित हैं। यदि दोनों साथियों की एक ही नाड़ी हो तो माना जाता है कि उनका शारीरिक असन्तुलन सन्तान में बढ़ेगा। यह सर्वाधिक भारित कूट है।', sa: 'प्रत्येकनक्षत्रं त्रिषु नाडीषु एकस्मिन् भवति: आदिः (वातः), मध्यः (पित्तम्), अन्त्यः (कफः)। एते आयुर्वेदीयशरीरप्रकारैः सह सम्बद्धाः।' },
    scoring: { en: 'Different Nadi → 8 pts | Same Nadi → 0 pts (Nadi Dosha — most severe)', hi: 'भिन्न नाड़ी → 8 अंक | समान नाड़ी → 0 (नाड़ी दोष — सबसे गम्भीर)', sa: 'भिन्ननाडी → 8 अङ्काः | समाननाडी → 0 (नाडीदोषः — गुरुतमः)' },
    example: { en: 'Example: Ashwini (Aadi/Vata) + Bharani (Madhya/Pitta) → Different Nadi → 8 pts', hi: 'उदाहरण: अश्विनी (आदि/वात) + भरणी (मध्य/पित्त) → भिन्न नाड़ी → 8 अंक', sa: 'उदाहरणम्: अश्विनी (आदिः/वातः) + भरणी (मध्यः/पित्तम्) → भिन्ननाडी → 8 अङ्काः' },
  },
];

const SCORE_RANGES = [
  { range: '0-17', label: { en: 'Poor Match', hi: 'कमज़ोर मिलान', sa: 'दुर्बलमेलनम्' }, desc: { en: 'Not recommended. Significant incompatibilities exist. Marriage is generally advised against unless Dosha cancellation conditions or strong Kundali factors compensate.', hi: 'अनुशंसित नहीं। महत्वपूर्ण असंगतताएँ हैं। विवाह सामान्यतः वर्जित जब तक दोष निरसन या सुदृढ़ कुण्डली कारक क्षतिपूर्ति न करें।', sa: 'अनुशंसितं न। महत्त्वपूर्णासंगतताः सन्ति।' }, color: 'text-red-400', bg: 'border-red-400/20 bg-red-400/5' },
  { range: '18-24', label: { en: 'Acceptable', hi: 'स्वीकार्य', sa: 'स्वीकार्यम्' }, desc: { en: 'Average match. Some areas need attention. Recommended to check individual Kuta breakdown carefully — a score of 20 with Nadi Dosha is more concerning than 18 with balanced distribution.', hi: 'औसत मिलान। कुछ क्षेत्रों में ध्यान आवश्यक। व्यक्तिगत कूट विश्लेषण सावधानी से जाँचने की सलाह — नाड़ी दोष के साथ 20 अंक, सन्तुलित 18 से अधिक चिन्ताजनक।', sa: 'मध्यममेलनम्। केषुचित् क्षेत्रेषु ध्यानं आवश्यकम्।' }, color: 'text-amber-400', bg: 'border-amber-400/20 bg-amber-400/5' },
  { range: '25-32', label: { en: 'Good Match', hi: 'अच्छा मिलान', sa: 'उत्तममेलनम्' }, desc: { en: 'Strong compatibility. Well-suited for a harmonious partnership. Most astrologers consider 25+ a green signal for marriage.', hi: 'मज़बूत अनुकूलता। सामंजस्यपूर्ण साझेदारी के लिए उपयुक्त। अधिकांश ज्योतिषी 25+ को विवाह के लिए हरी झण्डी मानते हैं।', sa: 'सुदृढानुकूलता। सामंजस्यपूर्णसाझेदार्यै उपयुक्तम्।' }, color: 'text-emerald-400', bg: 'border-emerald-400/20 bg-emerald-400/5' },
  { range: '33-36', label: { en: 'Excellent Match', hi: 'उत्कृष्ट मिलान', sa: 'उत्कृष्टमेलनम्' }, desc: { en: 'Exceptional compatibility across all dimensions. Extremely rare — only possible when nearly all 8 Kutas score full or near-full points.', hi: 'सभी आयामों में असाधारण अनुकूलता। अत्यन्त दुर्लभ — केवल तभी सम्भव जब लगभग सभी 8 कूट पूर्ण या लगभग पूर्ण अंक प्राप्त करें।', sa: 'सर्वेषु आयामेषु असाधारणानुकूलता। अत्यन्तदुर्लभम्।' }, color: 'text-gold-primary', bg: 'border-gold-primary/20 bg-gold-primary/5' },
];

const NADI_CANCELLATIONS = [
  { en: 'Same Nakshatra but different Rashi — Nadi Dosha is cancelled', hi: 'समान नक्षत्र किन्तु भिन्न राशि — नाड़ी दोष निरस्त', sa: 'समाननक्षत्रं किन्तु भिन्नराशिः — नाडीदोषः निरस्तः' },
  { en: 'Same Rashi but different Nakshatra — Nadi Dosha is cancelled', hi: 'समान राशि किन्तु भिन्न नक्षत्र — नाड़ी दोष निरस्त', sa: 'समानराशिः किन्तु भिन्ननक्षत्रं — नाडीदोषः निरस्तः' },
  { en: 'If the Nakshatra lord of one partner is the Rashi lord of the other', hi: 'यदि एक साथी का नक्षत्र स्वामी दूसरे का राशि स्वामी हो', sa: 'यदि एकस्य नक्षत्रस्वामी अन्यस्य राशिस्वामी भवति' },
  { en: 'Certain Nakshatra pairs have traditional exemptions (e.g., Rohini-Mrigashira, Ardra-Pushya)', hi: 'कुछ नक्षत्र जोड़ियों को पारम्परिक छूट है (जैसे रोहिणी-मृगशिरा, आर्द्रा-पुष्य)', sa: 'केचन नक्षत्रयुग्मानि पारम्परिकछूटं प्राप्नुवन्ति' },
];

const BHAKOOT_PAIRS = [
  { pair: '2/12', effect: { en: 'Financial strain — one partner spends, the other struggles to save. Disagreements on money management.', hi: 'आर्थिक तनाव — एक साथी ख़र्च करता है, दूसरा बचत के लिए संघर्ष करता है।', sa: 'आर्थिकतनावः — एकः व्ययं करोति, अन्यः सञ्चयार्थं यतते।' }, cancel: { en: 'Cancelled if lords of both Rashis are friends or the same planet', hi: 'निरस्त यदि दोनों राशियों के स्वामी मित्र हों या एक ही ग्रह हो', sa: 'निरस्तं यदि उभयोः राश्योः स्वामिनौ मित्रौ वा समानग्रहः' } },
  { pair: '5/9', effect: { en: 'Progeny and ideological issues — disagreements on children, education, religion, and dharma.', hi: 'सन्तान और वैचारिक मुद्दे — बच्चों, शिक्षा, धर्म पर असहमति।', sa: 'सन्तानवैचारिकसमस्याः — बालकेषु शिक्षायां धर्मे च असहमतिः।' }, cancel: { en: 'Cancelled if lords of both Rashis are friends or the same planet', hi: 'निरस्त यदि दोनों राशियों के स्वामी मित्र हों या एक ही ग्रह हो', sa: 'निरस्तं यदि उभयोः राश्योः स्वामिनौ मित्रौ वा समानग्रहः' } },
  { pair: '6/8', effect: { en: 'Health and separation — most serious Bhakoot Dosha. Can indicate chronic health issues, accidents, or separation.', hi: 'स्वास्थ्य और वियोग — सबसे गम्भीर भकूट दोष। दीर्घकालिक स्वास्थ्य समस्या, दुर्घटना, या वियोग का संकेत हो सकता है।', sa: 'स्वास्थ्यं वियोगश्च — गुरुतमभकूटदोषः।' }, cancel: { en: 'Cancelled only if lords are mutual friends — harder to cancel than 2/12 or 5/9', hi: 'निरस्त केवल यदि स्वामी परस्पर मित्र हों — 2/12 या 5/9 से कठिन निरसन', sa: 'निरस्तं केवलं यदि स्वामिनौ परस्परमित्रौ — 2/12 वा 5/9 अपेक्षया कठिनम्' } },
];

const MANGAL_CANCEL = [
  { en: 'Both partners are Manglik — Mars energies balance each other', hi: 'दोनों साथी मांगलिक हैं — मंगल ऊर्जाएँ एक-दूसरे को सन्तुलित करती हैं', sa: 'उभौ साथिनौ माङ्गलिकौ — मङ्गलशक्तयः परस्परं सन्तुलयन्ति' },
  { en: 'Mars in its own sign (Aries, Scorpio) or exaltation (Capricorn)', hi: 'मंगल अपनी राशि (मेष, वृश्चिक) या उच्च राशि (मकर) में', sa: 'मङ्गलः स्वराशौ (मेषः, वृश्चिकः) उच्चराशौ (मकरः) वा' },
  { en: 'Mars conjunct or aspected by benefics (Jupiter, Venus)', hi: 'मंगल शुभ ग्रहों (गुरु, शुक्र) से युत या दृष्ट', sa: 'मङ्गलः शुभग्रहैः (गुरुः, शुक्रः) युतः दृष्टः वा' },
  { en: 'Mars in the 1st/2nd house in Aries or Leo ascendants (Mars is a yoga karaka)', hi: 'मेष या सिंह लग्न में मंगल 1/2 भाव में (मंगल योगकारक है)', sa: 'मेषसिंहलग्नयोः मङ्गलः 1/2 भावे (मङ्गलः योगकारकः)' },
  { en: 'Mars in the 7th house in Cancer or Capricorn (own/exalted sign in Navamsha)', hi: 'कर्क या मकर में 7वें भाव में मंगल', sa: 'कर्कमकरयोः 7 भावे मङ्गलः' },
  { en: 'If Jupiter aspects the 7th house or the 7th lord, it mitigates Mangal Dosha significantly', hi: 'यदि गुरु 7वें भाव या 7वें स्वामी को देखे तो मांगलिक दोष काफ़ी कम हो जाता है', sa: 'यदि गुरुः 7 भावं 7 स्वामिनं वा पश्यति तर्हि माङ्गलिकदोषः बहुशः शमयति' },
];

const MODERN_POINTS = [
  { en: 'Ashta Kuta uses only Moon Nakshatra — it does not consider Lagna, other planet placements, Dashas, or Divisional charts. A comprehensive assessment should include these.', hi: 'अष्ट कूट केवल चन्द्र नक्षत्र का उपयोग करता है — यह लग्न, अन्य ग्रह स्थिति, दशाएँ, या विभागीय कुण्डलियाँ नहीं देखता। व्यापक मूल्यांकन में ये शामिल होने चाहिए।', sa: 'अष्टकूटं केवलं चन्द्रनक्षत्रं प्रयुनक्ति — लग्नं, अन्यग्रहस्थितयः, दशाः, विभागीयकुण्डल्यः न विचारयति।' },
  { en: 'The 7th house lord, Venus (for men), Jupiter (for women), and the Navamsha (D9) chart are equally important for marriage assessment but are not part of Ashta Kuta.', hi: '7वें भाव का स्वामी, शुक्र (पुरुषों के लिए), गुरु (महिलाओं के लिए), और नवांश (D9) कुण्डली विवाह मूल्यांकन के लिए समान रूप से महत्वपूर्ण हैं किन्तु अष्ट कूट का भाग नहीं हैं।', sa: '7 भावस्वामी, शुक्रः (पुरुषाणाम्), गुरुः (स्त्रीणाम्), नवांशकुण्डली (D9) च विवाहमूल्याङ्कनाय समानमहत्त्वपूर्णाः किन्तु अष्टकूटस्य भागाः न।' },
  { en: 'Dasha compatibility is crucial — even a 36/36 match can face difficulties if both partners simultaneously run challenging Dasha periods (e.g., Saturn Mahadasha with Rahu Antardasha).', hi: 'दशा अनुकूलता महत्वपूर्ण है — 36/36 मिलान भी कठिनाइयों का सामना कर सकता है यदि दोनों साथी एक साथ चुनौतीपूर्ण दशा काल चला रहे हों।', sa: 'दशानुकूलता महत्त्वपूर्णा — 36/36 मेलनमपि कठिनताम् अनुभवेत् यदि उभौ युगपत् कठिनदशाकालं चलतः।' },
  { en: 'Mutual respect, communication, and personal growth are beyond any astrological calculation. Astrology provides guidance, not verdicts. Many successful marriages exist with low Guna scores, and some high-scoring matches face challenges.', hi: 'पारस्परिक सम्मान, संवाद, और व्यक्तिगत विकास किसी भी ज्योतिषीय गणना से परे हैं। ज्योतिष मार्गदर्शन प्रदान करता है, निर्णय नहीं। कम गुण अंकों वाले कई सफल विवाह हैं।', sa: 'पारस्परिकसम्मानं, संवादः, व्यक्तिगतविकासश्च कस्यापि ज्योतिषगणनायाः परम्। ज्योतिषं मार्गदर्शनं ददाति, निर्णयं न।' },
  { en: 'Some regional traditions use 10-Kuta (Dasha Kuta) or 20-point systems instead of 36. South Indian traditions often weigh different factors. Always clarify which system is being used.', hi: 'कुछ क्षेत्रीय परम्पराएँ 36 के बजाय 10-कूट (दश कूट) या 20-अंक प्रणाली का उपयोग करती हैं। दक्षिण भारतीय परम्पराएँ प्रायः अलग कारकों को भार देती हैं।', sa: 'काश्चन प्रादेशिकपरम्पराः 36 विना 10-कूटं (दशकूटम्) 20-अङ्कपद्धतिं वा प्रयुञ्जन्ति।' },
];

const CROSS_REFS = [
  { label: { en: 'Nakshatras — Birth Stars', hi: 'नक्षत्र — जन्म तारे', sa: 'नक्षत्राणि' }, href: '/learn/nakshatras' as const },
  { label: { en: 'Grahas — Planetary Friendships', hi: 'ग्रह — ग्रह मैत्री', sa: 'ग्रहाः — ग्रहमैत्री' }, href: '/learn/grahas' as const },
  { label: { en: 'Kundali — Birth Chart Basics', hi: 'कुण्डली — जन्म कुण्डली मूलभूत', sa: 'कुण्डली — जन्मकुण्डलीमूलभूतम्' }, href: '/learn/kundali' as const },
  { label: { en: 'Bhavas — The 12 Houses', hi: 'भाव — 12 भाव', sa: 'भावाः — 12 भावाः' }, href: '/learn/bhavas' as const },
  { label: { en: 'Dashas — Planetary Periods', hi: 'दशाएँ — ग्रह काल', sa: 'दशाः — ग्रहकालाः' }, href: '/learn/dashas' as const },
];

export default function LearnMatchingPage() {
  const locale = useLocale() as Locale;
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const l = (obj: Record<string, string>) => lt(obj as LocaleText, locale);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      {/* Sanskrit Key Terms */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Ashta Kuta" devanagari="अष्ट कूट" transliteration="Aṣṭa Kūṭa" meaning="Eight points / factors" />
        <SanskritTermCard term="Guna" devanagari="गुण" transliteration="Guṇa" meaning="Quality / Point" />
        <SanskritTermCard term="Dosha" devanagari="दोष" transliteration="Doṣa" meaning="Affliction / Defect" />
        <SanskritTermCard term="Mangalik" devanagari="मांगलिक" transliteration="Māṅgalika" meaning="Mars affliction" />
      </div>

      {/* Section 1: Overview */}
      <LessonSection number={1} title={t('whatTitle')}>
        <p>{t('whatContent')}</p>
        <p className="mt-3 text-text-secondary text-sm">{t('whatContentDeep')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            {tl({ en: 'Total Ashta Kuta Points: 1+2+3+4+5+6+7+8 = 36 Gunas', hi: 'कुल अष्ट कूट अंक: 1+2+3+4+5+6+7+8 = 36 गुण', sa: 'अष्टकूटाङ्काः सर्वे: 1+2+3+4+5+6+7+8 = 36 गुणाः', ta: 'மொத்த அஷ்ட கூட புள்ளிகள்: 1+2+3+4+5+6+7+8 = 36 குணங்கள்', te: 'మొత్తం అష్ట కూట పాయింట్లు: 1+2+3+4+5+6+7+8 = 36 గుణాలు', bn: 'মোট অষ্ট কূট পয়েন্ট: 1+2+3+4+5+6+7+8 = 36 গুণ', kn: 'ಒಟ್ಟು ಅಷ್ಟ ಕೂಟ ಅಂಕಗಳು: 1+2+3+4+5+6+7+8 = 36 ಗುಣಗಳು', gu: 'કુલ અષ્ટ કૂટ અંક: 1+2+3+4+5+6+7+8 = 36 ગુણ', mai: 'कुल अष्ट कूट अंक: 1+2+3+4+5+6+7+8 = 36 गुण', mr: 'एकूण अष्ट कूट गुण: 1+2+3+4+5+6+7+8 = 36 गुण' }, locale)}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {tl({ en: 'Minimum for marriage: 18/36 (50%)', hi: 'विवाह के लिए न्यूनतम: 18/36 (50%)', sa: 'विवाहाय न्यूनतमम्: 18/36 (50%)', ta: 'திருமணத்திற்கு குறைந்தபட்சம்: 18/36 (50%)', te: 'వివాహానికి కనీసం: 18/36 (50%)', bn: 'বিবাহের জন্য সর্বনিম্ন: 18/36 (50%)', kn: 'ವಿವಾಹಕ್ಕೆ ಕನಿಷ್ಠ: 18/36 (50%)', gu: 'લગ્ન માટે ન્યૂનતમ: 18/36 (50%)', mai: 'विवाहक लेल न्यूनतम: 18/36 (50%)', mr: 'विवाहासाठी किमान: 18/36 (50%)' }, locale)}
          </p>
          <p className="text-gold-light/60 font-mono text-xs">
            {tl({ en: `Both charts compared using Moon's Nakshatra position`, hi: 'दोनों कुण्डलियों की चन्द्र नक्षत्र स्थिति से तुलना', sa: 'दोनों कुण्डलियों की चन्द्र नक्षत्र स्थिति से तुलना', ta: `Both charts compared using Moon's Nakshatra position`, te: `Both charts compared using Moon's Nakshatra position`, bn: `Both charts compared using Moon's Nakshatra position`, kn: `Both charts compared using Moon's Nakshatra position`, gu: `Both charts compared using Moon's Nakshatra position`, mai: 'दोनों कुण्डलियों की चन्द्र नक्षत्र स्थिति से तुलना', mr: 'दोनों कुण्डलियों की चन्द्र नक्षत्र स्थिति से तुलना' }, locale)}
          </p>
          <p className="text-gold-light/60 font-mono text-xs">
            {tl({ en: 'Higher weight → higher importance: Nadi (8) > Bhakoot (7) > Gana (6) > ...', hi: 'अधिक भार → अधिक महत्व: नाड़ी (8) > भकूट (7) > गण (6) > ...', sa: 'अधिकः भारः → अधिकं महत्त्वम्: नाडी (8) > भकूट (7) > गण (6) > ...', ta: 'அதிக எடை → அதிக முக்கியத்துவம்: நாடி (8) > பாகூட் (7) > கண (6) > ...', te: 'అధిక బరువు → అధిక ప్రాముఖ్యత: నాడి (8) > భకూట (7) > గణ (6) > ...', bn: 'বেশি ভার → বেশি গুরুত্ব: নাড়ী (8) > ভকূট (7) > গণ (6) > ...', kn: 'ಹೆಚ್ಚು ತೂಕ → ಹೆಚ್ಚು ಮಹತ್ವ: ನಾಡಿ (8) > ಭಕೂಟ (7) > ಗಣ (6) > ...', gu: 'વધુ વજન → વધુ મહત્ત્વ: નાડી (8) > ભકૂટ (7) > ગણ (6) > ...', mai: 'अधिक भार → अधिक महत्व: नाड़ी (8) > भकूट (7) > गण (6) > ...', mr: 'जास्त वजन → जास्त महत्त्व: नाडी (8) > भकूट (7) > गण (6) > ...' }, locale)}
          </p>
        </div>
      </LessonSection>

      {/* Section 2: The 8 Kutas in Detail */}
      <LessonSection number={2} title={t('kutaTitle')}>
        <div className="space-y-5">
          {KUTAS.map((k, i) => (
            <motion.div
              key={k.num}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-9 h-9 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light font-bold flex-shrink-0 text-sm">
                  {k.num}
                </span>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-gold-light font-semibold text-lg">{l(k.name)}</span>
                  {locale === 'en' && <span className="text-gold-primary/50 text-sm" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{k.name.sa}</span>}
                  <span className="ml-auto text-gold-primary font-mono text-sm font-bold">{k.points} {tl({ en: 'pts', hi: 'अंक', sa: 'अङ्काः', ta: 'புள்ளிகள்', te: 'పాయింట్లు', bn: 'পয়েন্ট', kn: 'ಅಂಕಗಳು', gu: 'ગુણ', mai: 'अंक', mr: 'गुण' }, locale)}</span>
                </div>
              </div>
              <div className="ml-12 space-y-2">
                <p className="text-amber-300/90 text-sm font-medium">{l(k.what)}</p>
                <p className="text-text-secondary text-sm">{l(k.how)}</p>
                <div className="mt-2 p-3 bg-bg-primary/40 rounded-md border border-gold-primary/5">
                  <p className="text-gold-light/80 font-mono text-xs">{l(k.scoring)}</p>
                </div>
                <p className="text-text-secondary/70 text-xs italic">{l(k.example)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 3: Calculation */}
      <LessonSection number={3} title={t('calcTitle')}>
        <p>{t('calcContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'Algorithm Steps:', hi: 'एल्गोरिथ्म चरण:', sa: 'एल्गोरिथ्मचरणाः:', ta: 'வழிமுறை படிகள்:', te: 'అల్గారిథమ్ దశలు:', bn: 'অ্যালগরিদম ধাপ:', kn: 'ಅಲ್ಗಾರಿದಮ್ ಹಂತಗಳು:', gu: 'અલ્ગોરિધમ પગલાં:', mai: 'एल्गोरिथ्म चरण:', mr: 'अल्गोरिदम चरण:' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">1. {tl({ en: 'Input: Birth Moon Nakshatra and Rashi of both partners', hi: 'इनपुट: दोनों साथियों का जन्म चन्द्र नक्षत्र और राशि', sa: 'निवेशः: उभयोः सहचरयोः जन्मचन्द्रनक्षत्रं राशिश्च', ta: 'உள்ளீடு: இருவரின் பிறப்பு சந்திர நட்சத்திரம் மற்றும் ராசி', te: 'ఇన్‌పుట్: ఇద్దరు భాగస్వాముల జన్మ చంద్ర నక్షత్రం మరియు రాశి', bn: 'ইনপুট: উভয় অংশীদারের জন্ম চন্দ্র নক্ষত্র এবং রাশি', kn: 'ಇನ್‌ಪುಟ್: ಇಬ್ಬರು ಸಂಗಾತಿಗಳ ಜನ್ಮ ಚಂದ್ರ ನಕ್ಷತ್ರ ಮತ್ತು ರಾಶಿ', gu: 'ઇનપુટ: બંને ભાગીદારોની જન્મ ચંદ્ર નક્ષત્ર અને રાશિ', mai: 'इनपुट: दुनू साथीक जन्म चंद्र नक्षत्र आ राशि', mr: 'इनपुट: दोन्ही जोडीदारांचे जन्म चंद्र नक्षत्र आणि राशी' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">2. {tl({ en: 'For each Kuta, apply specific comparison rules', hi: 'प्रत्येक कूट के लिए, विशिष्ट तुलना नियम लागू करें', sa: 'प्रत्येकस्मै कूटाय विशिष्टतुलनानियमाः लागू कर्तव्याः', ta: 'ஒவ்வொரு கூடத்திற்கும் குறிப்பிட்ட ஒப்பீட்டு விதிகளை பயன்படுத்துங்கள்', te: 'ప్రతి కూటకు నిర్దిష్ట పోలిక నియమాలు వర్తించండి', bn: 'প্রতিটি কূটের জন্য নির্দিষ্ট তুলনা নিয়ম প্রয়োগ করুন', kn: 'ಪ್ರತಿ ಕೂಟಕ್ಕೆ ನಿರ್ದಿಷ್ಟ ತುಲನಾ ನಿಯಮಗಳನ್ನು ಅನ್ವಯಿಸಿ', gu: 'દરેક કૂટ માટે ચોક્કસ તુલના નિયમો લાગુ કરો', mai: 'प्रत्येक कूटक लेल विशिष्ट तुलना नियम लागू करू', mr: 'प्रत्येक कूटासाठी विशिष्ट तुलना नियम लागू करा' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">3. {tl({ en: 'Sum all points → total Guna score out of 36', hi: 'सभी अंकों का योग → 36 में से कुल गुण अंक', sa: 'सर्वाङ्काः संकलयतु → 36 मध्ये गुणाङ्कस्य कुलयोगः', ta: 'அனைத்து புள்ளிகளையும் கூட்டு → 36 இல் மொத்த குண மதிப்பெண்', te: 'అన్ని పాయింట్లను కూడండి → 36 లో మొత్తం గుణ స్కోర్', bn: 'সব পয়েন্ট যোগ করুন → 36 এর মধ্যে মোট গুণ স্কোর', kn: 'ಎಲ್ಲ ಅಂಕಗಳನ್ನು ಕೂಡಿಸಿ → 36 ರಲ್ಲಿ ಒಟ್ಟು ಗುಣ ಅಂಕ', gu: 'બધા ગુણ ઉમેરો → 36 માંથી કુલ ગુણ', mai: 'सभ अंकक योग → 36 मे सँ कुल गुण अंक', mr: 'सर्व गुण जोडा → 36 पैकी एकूण गुण' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">4. {tl({ en: 'Check for Doshas (Nadi, Bhakoot, Mangal)', hi: 'दोषों की जाँच (नाड़ी, भकूट, मांगलिक)', sa: 'दोषाणां परीक्षणं कुरुतु (नाडी, भकूट, मङ्गल)', ta: 'தோஷங்களை சரிபாருங்கள் (நாடி, பாகூட், மங்கல்)', te: 'దోషాలను తనిఖీ చేయండి (నాడి, భకూట, మంగళ)', bn: 'দোষ পরীক্ষা করুন (নাড়ী, ভকূট, মঙ্গল)', kn: 'ದೋಷಗಳನ್ನು ಪರಿಶೀಲಿಸಿ (ನಾಡಿ, ಭಕೂಟ, ಮಂಗಳ)', gu: 'દોષ તપાસો (નાડી, ભકૂટ, મંગળ)', mai: 'दोष जाँचू (नाड़ी, भकूट, मांगलिक)', mr: 'दोषांची तपासणी करा (नाडी, भकूट, मंगळ)' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">5. {tl({ en: 'Apply cancellation rules if applicable', hi: 'यदि लागू हो तो निरसन नियम लागू करें', sa: 'यदि लागू भवति तर्हि निरसननियमाः प्रयोक्तव्याः', ta: 'பொருந்தினால் ரத்து விதிகளை பயன்படுத்துங்கள்', te: 'వర్తించే పక్షంలో రద్దు నియమాలను వర్తించండి', bn: 'প্রযোজ্য হলে বাতিল নিয়ম প্রয়োগ করুন', kn: 'ಅನ್ವಯಿಸಿದರೆ ರದ್ದತಿ ನಿಯಮಗಳನ್ನು ಅನ್ವಯಿಸಿ', gu: 'લાગુ હોય ત્યારે રદ્દ કરવાના નિયમો લાગુ કરો', mai: 'यदि लागू हो तँ निरसन नियम लागू करू', mr: 'लागू असल्यास रद्दीकरण नियम लागू करा' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">6. {tl({ en: 'Assess Mangal Dosha separately from Lagna, Moon, and Venus', hi: 'मांगलिक दोष का लग्न, चन्द्र और शुक्र से अलग मूल्यांकन', sa: 'मङ्गलदोषस्य मूल्याङ्कनं लग्नात् चन्द्रात् शुक्राच्च पृथक् कुरुतु', ta: 'மங்கள தோஷத்தை லக்னம், சந்திரன் மற்றும் சுக்கிரனிலிருந்து தனியாக மதிப்பிடுங்கள்', te: 'మంగళ దోషాన్ని లగ్నం, చంద్రుడు మరియు శుక్రుని నుండి వేర్వేరుగా మూల్యాంకనం చేయండి', bn: 'লগ্ন, চন্দ্র এবং শুক্র থেকে আলাদাভাবে মঙ্গল দোষ মূল্যায়ন করুন', kn: 'ಲಗ್ನ, ಚಂದ್ರ ಮತ್ತು ಶುಕ್ರದಿಂದ ಪ್ರತ್ಯೇಕವಾಗಿ ಮಂಗಳ ದೋಷ ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ', gu: 'લગ્ન, ચંદ્ર અને શુક્રથી અલગ મંગળ દોષનું મૂલ્યાંકન કરો', mai: 'मांगलिक दोषक मूल्यांकन लग्न, चन्द्र आ शुक्रसँ अलग करू', mr: 'मंगळ दोषाचे मूल्यांकन लग्न, चंद्र आणि शुक्रापासून स्वतंत्रपणे करा' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">7. {tl({ en: 'Generate detailed compatibility report with Kuta-wise breakdown', hi: 'कूट-अनुसार विस्तृत अनुकूलता रिपोर्ट तैयार करें', sa: 'कूटानुसारं विस्तृतसामञ्जस्यप्रतिवेदनं निर्मातु', ta: 'கூட வாரியான விரிவான இணக்கத்தன்மை அறிக்கையை உருவாக்குங்கள்', te: 'కూట-వారీగా వివరణాత్మక అనుకూలత నివేదికను రూపొందించండి', bn: 'কূট-ভিত্তিক বিস্তারিত সামঞ্জস্য রিপোর্ট তৈরি করুন', kn: 'ಕೂಟ-ವಾರು ವಿವರವಾದ ಹೊಂದಾಣಿಕೆ ವರದಿ ರಚಿಸಿ', gu: 'કૂટ-વાર વિગતવાર અનુકૂળતા અહેવાલ તૈયાર કરો', mai: 'कूट-अनुसार विस्तृत अनुकूलता रिपोर्ट तैयार करू', mr: 'कूट-निहाय विस्तृत सुसंगतता अहवाल तयार करा' }, locale)}</p>
        </div>
      </LessonSection>

      {/* Section 4: Score Interpretation */}
      <LessonSection number={4} title={t('scoreTitle')} variant="highlight">
        <div className="space-y-3 mb-4">
          {SCORE_RANGES.map((s) => (
            <div key={s.range} className={`rounded-lg p-3 border ${s.bg}`}>
              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold ${s.color}`}>{s.range}</span>
                <span className={`font-semibold text-sm ${s.color}`}>{l(s.label)}</span>
              </div>
              <p className="text-text-secondary text-xs mt-1">{l(s.desc)}</p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-bg-primary/50 rounded-lg border border-amber-400/20">
          <p className="text-amber-300/90 text-sm">{t('scoreNote')}</p>
        </div>
      </LessonSection>

      {/* Section 5: Nadi Dosha */}
      <LessonSection number={5} title={t('nadiDoshaTitle')}>
        <p className="text-text-secondary">{t('nadiDoshaContent')}</p>
        <div className="mt-4 space-y-2">
          {NADI_CANCELLATIONS.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-emerald-400/5 border border-emerald-400/15"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0 text-xs">
                {i + 1}
              </span>
              <p className="text-text-secondary text-sm">{l(rule)}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-xs">
            {locale === 'en'
              ? 'Note: Even with cancellation, many astrologers recommend performing Nadi Shanti Puja as a precaution. The cancellation reduces severity but does not eliminate the concern entirely.'
              : 'नोट: निरसन होने पर भी कई ज्योतिषी सावधानी के रूप में नाड़ी शान्ति पूजा की सलाह देते हैं। निरसन गम्भीरता कम करता है किन्तु चिन्ता पूर्णतः समाप्त नहीं करता।'}
          </p>
        </div>
      </LessonSection>

      {/* Section 6: Bhakoot Dosha */}
      <LessonSection number={6} title={t('bhakootDoshaTitle')}>
        <p className="text-text-secondary mb-4">{t('bhakootDoshaContent')}</p>
        <div className="space-y-4">
          {BHAKOOT_PAIRS.map((bp, i) => (
            <motion.div
              key={bp.pair}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 border border-red-400/15"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-red-400 font-mono font-bold text-lg">{bp.pair}</span>
                <span className="text-red-400/60 text-xs font-mono">
                  {tl({ en: 'position pair', hi: 'स्थिति जोड़ा', sa: 'स्थितियुगलम्', ta: 'நிலை ஜோடி', te: 'స్థాన జంట', bn: 'অবস্থান জুটি', kn: 'ಸ್ಥಾನ ಜೋಡಿ', gu: 'સ્થાન જોડ', mai: 'स्थिति जोड़ा', mr: 'स्थान जोडी' }, locale)}
                </span>
              </div>
              <p className="text-text-secondary text-sm mb-2">{l(bp.effect)}</p>
              <div className="p-2 rounded bg-emerald-400/5 border border-emerald-400/10">
                <p className="text-emerald-400/80 text-xs">
                  {tl({ en: 'Cancellation: ', hi: 'निरसन: ', sa: 'निरसनम्: ', ta: 'ரத்து: ', te: 'రద్దు: ', bn: 'বাতিল: ', kn: 'ರದ್ದತಿ: ', gu: 'રદ્દ: ', mai: 'निरसन: ', mr: 'रद्दीकरण: ' }, locale)}{l(bp.cancel)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 7: Mangal Dosha */}
      <LessonSection number={7} title={t('mangalTitle')}>
        <p className="text-text-secondary">{t('mangalContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10 mb-4">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'Mars in houses 1, 4, 7, 8, 12 from:', hi: 'भाव 1, 4, 7, 8, 12 में मंगल — इनसे:', sa: 'मङ्गलः भावेषु 1, 4, 7, 8, 12 — एभ्यः:', ta: 'வீடுகள் 1, 4, 7, 8, 12 இல் செவ்வாய் — இவற்றிலிருந்து:', te: 'భావాలు 1, 4, 7, 8, 12 లో మంగళుడు — వీటి నుండి:', bn: 'ভাব 1, 4, 7, 8, 12-এ মঙ্গল — এগুলো থেকে:', kn: 'ಭಾವ 1, 4, 7, 8, 12 ರಲ್ಲಿ ಮಂಗಳ — ಇವುಗಳಿಂದ:', gu: 'ભાવ 1, 4, 7, 8, 12 માં મંગળ — આ પ્રમાણે:', mai: 'भाव 1, 4, 7, 8, 12 मे मंगल — एहिसँ:', mr: 'भाव 1, 4, 7, 8, 12 मध्ये मंगळ — यापासून:' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {tl({ en: '• Lagna (Ascendant) — checked in all traditions', hi: '• लग्न — सभी परम्पराओं में जाँचा जाता है', sa: '• लग्नम् — सर्वासु परम्पराषु परीक्षितम्', ta: '• லக்னம் — அனைத்து மரபுகளிலும் சரிபார்க்கப்படுகிறது', te: '• లగ్నం — అన్ని సంప్రదాయాలలో తనిఖీ చేయబడుతుంది', bn: '• লগ্ন — সব ঐতিহ্যে যাচাই করা হয়', kn: '• ಲಗ್ನ — ಎಲ್ಲ ಸಂಪ್ರದಾಯಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ', gu: '• લગ્ન — તમામ પરંપરાઓમાં ચકાસાય છે', mai: '• लग्न — सभ परम्परामे जाँचल जाइत अछि', mr: '• लग्न — सर्व परंपरांमध्ये तपासले जाते' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {tl({ en: '• Moon — checked in most North Indian traditions', hi: '• चन्द्र — अधिकांश उत्तर भारतीय परम्पराओं में', sa: '• चन्द्रः — अधिकेषु उत्तरभारतीयपरम्पराषु परीक्षितः', ta: '• சந்திரன் — பெரும்பாலான வட இந்திய மரபுகளில் சரிபார்க்கப்படுகிறது', te: '• చంద్రుడు — చాలా ఉత్తర భారతీయ సంప్రదాయాలలో తనిఖీ చేయబడుతుంది', bn: '• চন্দ্র — বেশিরভাগ উত্তর ভারতীয় ঐতিহ্যে যাচাই করা হয়', kn: '• ಚಂದ್ರ — ಹೆಚ್ಚಿನ ಉತ್ತರ ಭಾರತೀಯ ಸಂಪ್ರದಾಯಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ', gu: '• ચંદ્ર — મોટા ભાગની ઉત્તર ભારતીય પરંપરાઓમાં ચકાસાય છે', mai: '• चन्द्र — अधिकांश उत्तर भारतीय परम्परामे जाँचल जाइत अछि', mr: '• चंद्र — बहुतेक उत्तर भारतीय परंपरांमध्ये तपासले जाते' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {tl({ en: '• Venus — checked in South Indian traditions (Kalathra Dosha)', hi: '• शुक्र — दक्षिण भारतीय परम्पराओं में (कलत्र दोष)', sa: '• शुक्रः — दक्षिणभारतीयपरम्पराषु परीक्षितः (कलत्रदोषः)', ta: '• சுக்கிரன் — தென்னிந்திய மரபுகளில் சரிபார்க்கப்படுகிறது (களத்திர தோஷம்)', te: '• శుక్రుడు — దక్షిణ భారతీయ సంప్రదాయాలలో తనిఖీ చేయబడుతుంది (కళత్ర దోష)', bn: '• শুক্র — দক্ষিণ ভারতীয় ঐতিহ্যে যাচাই করা হয় (কলত্র দোষ)', kn: '• ಶುಕ್ರ — ದಕ್ಷಿಣ ಭಾರತೀಯ ಸಂಪ್ರದಾಯಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ (ಕಲತ್ರ ದೋಷ)', gu: '• શુક્ર — દક્ષિણ ભારતીય પરંપરાઓમાં ચકાસાય છે (કલત્ર દોષ)', mai: '• शुक्र — दक्षिण भारतीय परम्परामे जाँचल जाइत अछि (कलत्र दोष)', mr: '• शुक्र — दक्षिण भारतीय परंपरांमध्ये तपासले जाते (कलत्र दोष)' }, locale)}
          </p>
        </div>
        <h4 className="text-gold-light font-semibold text-sm mb-3">
          {tl({ en: 'Mangal Dosha Cancellation Conditions:', hi: 'मांगलिक दोष निरसन शर्तें:', sa: 'मङ्गलदोषनिरसनशर्ताः:', ta: 'மங்கள தோஷ ரத்து நிபந்தனைகள்:', te: 'మంగళ దోష రద్దు నిబంధనలు:', bn: 'মঙ্গল দোষ বাতিল শর্ত:', kn: 'ಮಂಗಳ ದೋಷ ರದ್ದತಿ ಷರತ್ತುಗಳು:', gu: 'મંગળ દોષ રદ્દ કરવાની શરતો:', mai: 'मांगलिक दोष निरसन शर्त:', mr: 'मंगळ दोष रद्दीकरण अटी:' }, locale)}
        </h4>
        <div className="space-y-2">
          {MANGAL_CANCEL.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-emerald-400/5 border border-emerald-400/15"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0 text-xs">
                {i + 1}
              </span>
              <p className="text-text-secondary text-sm">{l(rule)}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 8: Modern Considerations */}
      <LessonSection number={8} title={t('modernTitle')}>
        <p className="text-text-secondary mb-4">{t('modernContent')}</p>
        <div className="space-y-3">
          {MODERN_POINTS.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10"
            >
              <span className="w-6 h-6 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-gold-light/70 font-bold flex-shrink-0 text-xs">
                {i + 1}
              </span>
              <p className="text-text-secondary text-sm">{l(point)}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 9: Cross-References */}
      <LessonSection number={9} title={t('crossRefTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CROSS_REFS.map((ref) => (
            <Link
              key={ref.href}
              href={ref.href}
              className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10 hover:bg-gold-primary/10 hover:border-gold-primary/25 transition-colors group"
            >
              <span className="text-gold-primary/50 group-hover:text-gold-primary transition-colors text-lg">&#8594;</span>
              <span className="text-text-secondary group-hover:text-gold-light text-sm transition-colors">{l(ref.label)}</span>
            </Link>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/matching"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}

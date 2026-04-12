'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Kundali Matching — Ashta Kuta', hi: 'कुण्डली मिलान — अष्ट कूट', sa: 'कुण्डलीमेलनम् — अष्टकूटम्' , ta: 'குண்டலி பொருத்தம் — அஷ்ட கூடம்' },
  subtitle: { en: 'The 8-fold compatibility system used for marriage matching', hi: 'विवाह मिलान के लिए प्रयुक्त 8 कूट अनुकूलता प्रणाली', sa: 'विवाहमेलनार्थं प्रयुक्ता अष्टकूटानुकूलतापद्धतिः' },
  whatTitle: { en: 'What is Kundali Matching?', hi: 'कुण्डली मिलान क्या है?', sa: 'कुण्डलीमेलनं किम्?' },
  whatContent: {
    en: 'Kundali Matching (Horoscope Matching) compares two birth charts to assess compatibility for marriage. The primary system is Ashta Kuta — 8 factors scored from the Moon\'s Nakshatra of both partners. The maximum score is 36 points (Gunas). Traditionally, a minimum of 18 Gunas (50%) is required for an acceptable match.',
    hi: 'कुण्डली मिलान दो जन्म कुण्डलियों की तुलना करता है विवाह के लिए अनुकूलता आँकने हेतु। प्राथमिक प्रणाली अष्ट कूट है — दोनों साथियों के चन्द्र नक्षत्र से 8 कारक अंकित किए जाते हैं। अधिकतम अंक 36 (गुण) है।',
    sa: 'कुण्डलीमेलनं द्वयोः जन्मकुण्डल्योः तुलनां करोति विवाहार्थम् अनुकूलतायाः आकलनाय।'
  },
  whatContentDeep: {
    en: 'The system originates from the Muhurta Chintamani and other classical Jyotish texts. It is based on the principle that the Moon governs the mind (Manas), and therefore the Moon\'s Nakshatra at birth reveals one\'s emotional and psychological nature. By comparing the Nakshatras of two individuals, astrologers can assess harmony across spiritual, emotional, physical, and health dimensions. The 8 Kutas are weighted progressively — from 1 point (Varna) to 8 points (Nadi) — reflecting the increasing importance of each factor.',
    hi: 'यह प्रणाली मुहूर्त चिन्तामणि और अन्य शास्त्रीय ज्योतिष ग्रन्थों से उद्भव हुई है। यह इस सिद्धान्त पर आधारित है कि चन्द्रमा मन (मानस) का शासक है, और इसलिए जन्म का चन्द्र नक्षत्र व्यक्ति की भावनात्मक और मनोवैज्ञानिक प्रकृति प्रकट करता है। दो व्यक्तियों के नक्षत्रों की तुलना से ज्योतिषी आध्यात्मिक, भावनात्मक, शारीरिक और स्वास्थ्य आयामों में सामंजस्य आँक सकते हैं।',
    sa: 'इयं पद्धतिः मुहूर्तचिन्तामणेः अन्येभ्यः शास्त्रीयज्योतिषग्रन्थेभ्यः च उद्भवति।'
  },
  kutaTitle: { en: 'The 8 Kutas in Detail', hi: 'अष्ट कूट — विस्तृत व्याख्या', sa: 'अष्टकूटानि — विस्तृतव्याख्या' },
  calcTitle: { en: 'How Matching is Calculated', hi: 'मिलान कैसे गणना होती है', sa: 'मेलनं कथं गण्यते' },
  calcContent: {
    en: 'Our software calculates matching using the birth Moon Nakshatra of both partners. Each Kuta has specific rules — some use Nakshatra number, some use Rashi number, some use Nakshatra lord, and some use the Nakshatra\'s Yoni (animal symbol) or Gana (temperament). The algorithm checks all 8 factors and sums the points.',
    hi: 'हमारा सॉफ़्टवेयर दोनों साथियों के जन्म चन्द्र नक्षत्र से मिलान की गणना करता है। प्रत्येक कूट के विशिष्ट नियम हैं। एल्गोरिथ्म सभी 8 कारकों की जाँच करता है और अंकों का योग करता है।',
    sa: 'अस्माकं सॉफ़्टवेयरं उभयोः जन्मचन्द्रनक्षत्राभ्यां मेलनस्य गणनां करोति।'
  },
  scoreTitle: { en: 'Score Interpretation & Thresholds', hi: 'अंकों की व्याख्या और सीमाएँ', sa: 'अङ्कानां व्याख्या सीमाश्च' },
  scoreNote: {
    en: 'Important: A high score does not guarantee a happy marriage, nor does a low score doom one. The score is a starting point for deeper analysis. Many astrologers recommend that if the score is between 18-24, one should examine individual Kuta breakdowns — a score of 20 with Nadi Dosha (0/8 on Nadi) is far worse than a score of 20 with balanced distribution.',
    hi: 'महत्वपूर्ण: उच्च अंक सुखी विवाह की गारन्टी नहीं देते, न ही कम अंक विवाह को विफल करते हैं। अंक गहन विश्लेषण का प्रारम्भिक बिन्दु है। कई ज्योतिषी सलाह देते हैं कि यदि अंक 18-24 के बीच है तो व्यक्तिगत कूट विश्लेषण किया जाए।',
    sa: 'उच्चाङ्काः सुखविवाहस्य प्रत्याभूतिं न ददति।'
  },
  nadiDoshaTitle: { en: 'Nadi Dosha — The Most Critical Defect', hi: 'नाड़ी दोष — सबसे गम्भीर दोष', sa: 'नाडीदोषः — सर्वगुरुतरदोषः' },
  nadiDoshaContent: {
    en: 'Nadi Dosha occurs when both partners have the same Nadi (Aadi/Vata, Madhya/Pitta, or Antya/Kapha). Since Nadi carries the highest weight (8 points), this dosha alone reduces the score by 8 points. Classical texts warn that same-Nadi couples may face health issues in progeny. However, several cancellation conditions exist:',
    hi: 'नाड़ी दोष तब होता है जब दोनों साथियों की एक ही नाड़ी हो (आदि/वात, मध्य/पित्त, या अन्त्य/कफ)। चूँकि नाड़ी का भार सबसे अधिक (8 अंक) है, यह दोष अकेले 8 अंक घटा देता है। शास्त्रीय ग्रन्थ चेतावनी देते हैं कि समान नाड़ी दम्पत्ति को सन्तान में स्वास्थ्य समस्याएँ हो सकती हैं। हालाँकि, कई निरसन शर्तें हैं:',
    sa: 'नाडीदोषः भवति यदा उभयोः साथिनोः समाना नाडी भवति। शास्त्रीयग्रन्थाः चेतयन्ति यत् समाननाडीदम्पत्योः सन्ततौ स्वास्थ्यसमस्याः भवेयुः।'
  },
  bhakootDoshaTitle: { en: 'Bhakoot Dosha — Emotional & Financial Impact', hi: 'भकूट दोष — भावनात्मक और आर्थिक प्रभाव', sa: 'भकूटदोषः — भावनात्मकार्थिकप्रभावः' },
  bhakootDoshaContent: {
    en: 'Bhakoot Dosha arises from certain Moon-sign combinations between partners. Three inauspicious pairs exist, each affecting a different life area:',
    hi: 'भकूट दोष साथियों के बीच कुछ चन्द्र-राशि संयोजनों से उत्पन्न होता है। तीन अशुभ जोड़े हैं, प्रत्येक जीवन के अलग क्षेत्र को प्रभावित करता है:',
    sa: 'भकूटदोषः साथिनोः मध्ये केषाञ्चित् चन्द्रराशिसंयोजनेभ्यः उद्भवति।'
  },
  mangalTitle: { en: 'Mangal Dosha — Beyond Ashta Kuta', hi: 'मांगलिक दोष — अष्ट कूट से परे', sa: 'माङ्गलिकदोषः — अष्टकूटात् परम्' },
  mangalContent: {
    en: 'Mangal Dosha (Kuja Dosha) is not part of the Ashta Kuta point system, but it is always checked separately during marriage matching. Mars is a fiery, aggressive planet; when poorly placed, it is believed to bring conflict, accidents, or even danger to the spouse. A person is considered Manglik if Mars occupies houses 1, 4, 7, 8, or 12 from the Lagna, Moon, or Venus.',
    hi: 'मांगलिक दोष (कुज दोष) अष्ट कूट अंक प्रणाली का भाग नहीं है, किन्तु विवाह मिलान में इसे सदैव अलग से जाँचा जाता है। मंगल एक उग्र, आक्रामक ग्रह है; जब अनुचित स्थिति में हो तो ऐसा माना जाता है कि यह कलह, दुर्घटना, या जीवनसाथी को ख़तरा ला सकता है। एक व्यक्ति मांगलिक माना जाता है यदि मंगल लग्न, चन्द्र, या शुक्र से 1, 4, 7, 8, या 12वें भाव में हो।',
    sa: 'माङ्गलिकदोषः अष्टकूटाङ्कपद्धतेः भागः नास्ति, किन्तु विवाहमेलने सदा पृथक् परीक्ष्यते।'
  },
  modernTitle: { en: 'Modern Considerations', hi: 'आधुनिक विचार', sa: 'आधुनिकविचाराः' },
  modernContent: {
    en: 'While Ashta Kuta matching is a time-tested system rooted in Vedic wisdom, modern astrologers and scholars recognize that it is one tool among many. Here are important nuances:',
    hi: 'जबकि अष्ट कूट मिलान वैदिक ज्ञान में निहित एक कालजयी प्रणाली है, आधुनिक ज्योतिषी और विद्वान पहचानते हैं कि यह अनेक उपकरणों में से एक है। कुछ महत्वपूर्ण सूक्ष्मताएँ:',
    sa: 'अष्टकूटमेलनं वैदिकज्ञाने निहिता कालजयी पद्धतिः। आधुनिकज्योतिषिणः विद्वांसश्च जानन्ति यदिदम् अनेकेषु उपकरणेषु एकम्।'
  },
  crossRefTitle: { en: 'Cross-References', hi: 'सम्बन्धित विषय', sa: 'सम्बद्धविषयाः' },
  tryIt: { en: 'Try Kundali Matching →', hi: 'कुण्डली मिलान करें →', sa: 'कुण्डलीमेलनं कुर्वन्तु →' },
};

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

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {((L.title as Record<string, string>)[locale] ?? L.title.en)}
        </h2>
        <p className="text-text-secondary">{((L.subtitle as Record<string, string>)[locale] ?? L.subtitle.en)}</p>
      </div>

      {/* Sanskrit Key Terms */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Ashta Kuta" devanagari="अष्ट कूट" transliteration="Aṣṭa Kūṭa" meaning="Eight points / factors" />
        <SanskritTermCard term="Guna" devanagari="गुण" transliteration="Guṇa" meaning="Quality / Point" />
        <SanskritTermCard term="Dosha" devanagari="दोष" transliteration="Doṣa" meaning="Affliction / Defect" />
        <SanskritTermCard term="Mangalik" devanagari="मांगलिक" transliteration="Māṅgalika" meaning="Mars affliction" />
      </div>

      {/* Section 1: Overview */}
      <LessonSection number={1} title={((L.whatTitle as Record<string, string>)[locale] ?? L.whatTitle.en)}>
        <p>{((L.whatContent as Record<string, string>)[locale] ?? L.whatContent.en)}</p>
        <p className="mt-3 text-text-secondary text-sm">{((L.whatContentDeep as Record<string, string>)[locale] ?? L.whatContentDeep.en)}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            {locale === 'en' || String(locale) === 'ta' ? 'Total Ashta Kuta Points: 1+2+3+4+5+6+7+8 = 36 Gunas' : 'कुल अष्ट कूट अंक: 1+2+3+4+5+6+7+8 = 36 गुण'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en' || String(locale) === 'ta' ? 'Minimum for marriage: 18/36 (50%)' : 'विवाह के लिए न्यूनतम: 18/36 (50%)'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs">
            {locale === 'en' || String(locale) === 'ta' ? 'Both charts compared using Moon\'s Nakshatra position' : 'दोनों कुण्डलियों की चन्द्र नक्षत्र स्थिति से तुलना'}
          </p>
          <p className="text-gold-light/60 font-mono text-xs">
            {locale === 'en' || String(locale) === 'ta' ? 'Higher weight → higher importance: Nadi (8) > Bhakoot (7) > Gana (6) > ...' : 'अधिक भार → अधिक महत्व: नाड़ी (8) > भकूट (7) > गण (6) > ...'}
          </p>
        </div>
      </LessonSection>

      {/* Section 2: The 8 Kutas in Detail */}
      <LessonSection number={2} title={((L.kutaTitle as Record<string, string>)[locale] ?? L.kutaTitle.en)}>
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
                  <span className="text-gold-light font-semibold text-lg">{k.name[locale]}</span>
                  {locale === 'en' && <span className="text-gold-primary/50 text-sm" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{k.name.sa}</span>}
                  <span className="ml-auto text-gold-primary font-mono text-sm font-bold">{k.points} {locale === 'en' || String(locale) === 'ta' ? 'pts' : 'अंक'}</span>
                </div>
              </div>
              <div className="ml-12 space-y-2">
                <p className="text-amber-300/90 text-sm font-medium">{k.what[locale]}</p>
                <p className="text-text-secondary text-sm">{k.how[locale]}</p>
                <div className="mt-2 p-3 bg-bg-primary/40 rounded-md border border-gold-primary/5">
                  <p className="text-gold-light/80 font-mono text-xs">{k.scoring[locale]}</p>
                </div>
                <p className="text-text-secondary/70 text-xs italic">{k.example[locale]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 3: Calculation */}
      <LessonSection number={3} title={((L.calcTitle as Record<string, string>)[locale] ?? L.calcTitle.en)}>
        <p>{((L.calcContent as Record<string, string>)[locale] ?? L.calcContent.en)}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' || String(locale) === 'ta' ? 'Algorithm Steps:' : 'एल्गोरिथ्म चरण:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">1. {locale === 'en' || String(locale) === 'ta' ? 'Input: Birth Moon Nakshatra and Rashi of both partners' : 'इनपुट: दोनों साथियों का जन्म चन्द्र नक्षत्र और राशि'}</p>
          <p className="text-gold-light/80 font-mono text-xs">2. {locale === 'en' || String(locale) === 'ta' ? 'For each Kuta, apply specific comparison rules' : 'प्रत्येक कूट के लिए, विशिष्ट तुलना नियम लागू करें'}</p>
          <p className="text-gold-light/80 font-mono text-xs">3. {locale === 'en' || String(locale) === 'ta' ? 'Sum all points → total Guna score out of 36' : 'सभी अंकों का योग → 36 में से कुल गुण अंक'}</p>
          <p className="text-gold-light/80 font-mono text-xs">4. {locale === 'en' || String(locale) === 'ta' ? 'Check for Doshas (Nadi, Bhakoot, Mangal)' : 'दोषों की जाँच (नाड़ी, भकूट, मांगलिक)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">5. {locale === 'en' || String(locale) === 'ta' ? 'Apply cancellation rules if applicable' : 'यदि लागू हो तो निरसन नियम लागू करें'}</p>
          <p className="text-gold-light/80 font-mono text-xs">6. {locale === 'en' || String(locale) === 'ta' ? 'Assess Mangal Dosha separately from Lagna, Moon, and Venus' : 'मांगलिक दोष का लग्न, चन्द्र और शुक्र से अलग मूल्यांकन'}</p>
          <p className="text-gold-light/80 font-mono text-xs">7. {locale === 'en' || String(locale) === 'ta' ? 'Generate detailed compatibility report with Kuta-wise breakdown' : 'कूट-अनुसार विस्तृत अनुकूलता रिपोर्ट तैयार करें'}</p>
        </div>
      </LessonSection>

      {/* Section 4: Score Interpretation */}
      <LessonSection number={4} title={((L.scoreTitle as Record<string, string>)[locale] ?? L.scoreTitle.en)} variant="highlight">
        <div className="space-y-3 mb-4">
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
        <div className="p-4 bg-bg-primary/50 rounded-lg border border-amber-400/20">
          <p className="text-amber-300/90 text-sm">{((L.scoreNote as Record<string, string>)[locale] ?? L.scoreNote.en)}</p>
        </div>
      </LessonSection>

      {/* Section 5: Nadi Dosha */}
      <LessonSection number={5} title={((L.nadiDoshaTitle as Record<string, string>)[locale] ?? L.nadiDoshaTitle.en)}>
        <p className="text-text-secondary">{((L.nadiDoshaContent as Record<string, string>)[locale] ?? L.nadiDoshaContent.en)}</p>
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
              <p className="text-text-secondary text-sm">{rule[locale]}</p>
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
      <LessonSection number={6} title={((L.bhakootDoshaTitle as Record<string, string>)[locale] ?? L.bhakootDoshaTitle.en)}>
        <p className="text-text-secondary mb-4">{((L.bhakootDoshaContent as Record<string, string>)[locale] ?? L.bhakootDoshaContent.en)}</p>
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
                  {locale === 'en' || String(locale) === 'ta' ? 'position pair' : 'स्थिति जोड़ा'}
                </span>
              </div>
              <p className="text-text-secondary text-sm mb-2">{bp.effect[locale]}</p>
              <div className="p-2 rounded bg-emerald-400/5 border border-emerald-400/10">
                <p className="text-emerald-400/80 text-xs">
                  {locale === 'en' || String(locale) === 'ta' ? 'Cancellation: ' : 'निरसन: '}{bp.cancel[locale]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 7: Mangal Dosha */}
      <LessonSection number={7} title={((L.mangalTitle as Record<string, string>)[locale] ?? L.mangalTitle.en)}>
        <p className="text-text-secondary">{((L.mangalContent as Record<string, string>)[locale] ?? L.mangalContent.en)}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10 mb-4">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' || String(locale) === 'ta' ? 'Mars in houses 1, 4, 7, 8, 12 from:' : 'भाव 1, 4, 7, 8, 12 में मंगल — इनसे:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en' || String(locale) === 'ta' ? '• Lagna (Ascendant) — checked in all traditions' : '• लग्न — सभी परम्पराओं में जाँचा जाता है'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en' || String(locale) === 'ta' ? '• Moon — checked in most North Indian traditions' : '• चन्द्र — अधिकांश उत्तर भारतीय परम्पराओं में'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en' || String(locale) === 'ta' ? '• Venus — checked in South Indian traditions (Kalathra Dosha)' : '• शुक्र — दक्षिण भारतीय परम्पराओं में (कलत्र दोष)'}
          </p>
        </div>
        <h4 className="text-gold-light font-semibold text-sm mb-3">
          {locale === 'en' || String(locale) === 'ta' ? 'Mangal Dosha Cancellation Conditions:' : 'मांगलिक दोष निरसन शर्तें:'}
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
              <p className="text-text-secondary text-sm">{rule[locale]}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 8: Modern Considerations */}
      <LessonSection number={8} title={((L.modernTitle as Record<string, string>)[locale] ?? L.modernTitle.en)}>
        <p className="text-text-secondary mb-4">{((L.modernContent as Record<string, string>)[locale] ?? L.modernContent.en)}</p>
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
              <p className="text-text-secondary text-sm">{point[locale]}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 9: Cross-References */}
      <LessonSection number={9} title={((L.crossRefTitle as Record<string, string>)[locale] ?? L.crossRefTitle.en)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CROSS_REFS.map((ref) => (
            <Link
              key={ref.href}
              href={ref.href}
              className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10 hover:bg-gold-primary/10 hover:border-gold-primary/25 transition-colors group"
            >
              <span className="text-gold-primary/50 group-hover:text-gold-primary transition-colors text-lg">&#8594;</span>
              <span className="text-text-secondary group-hover:text-gold-light text-sm transition-colors">{ref.label[locale]}</span>
            </Link>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/matching"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {((L.tryIt as Record<string, string>)[locale] ?? L.tryIt.en)}
        </Link>
      </div>
    </div>
  );
}

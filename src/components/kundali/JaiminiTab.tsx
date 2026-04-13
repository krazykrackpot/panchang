'use client';

import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { hasRashiDrishti, getMutualRashiDrishti } from '@/lib/jaimini/rashi-drishti';
import { calculateShoolaLords } from '@/lib/kundali/additional-dashas';
import { JaiminiInterpretation } from '@/components/kundali/InterpretationHelpers';
import InfoBlock from '@/components/ui/InfoBlock';
import type { KundaliData } from '@/types/kundali';
import type { Locale , LocaleText} from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ─── Module-level constant data ─────────────────────────────────────────────

const KARAKA_INFO: Record<string, { full: LocaleText; meaning: LocaleText; governs: LocaleText }> = {
  AK: { full: { en: 'Atmakaraka', hi: 'आत्मकारक', sa: 'आत्मकारक', mai: 'आत्मकारक', mr: 'आत्मकारक', ta: 'ஆத்மகாரகன்', te: 'ఆత్మకారకుడు', bn: 'আত্মকারক', kn: 'ಆತ್ಮಕಾರಕ', gu: 'આત્મકારક' }, meaning: { en: 'Soul Significator', hi: 'आत्मा का कारक', sa: 'आत्मा का कारक', mai: 'आत्मा का कारक', mr: 'आत्मा का कारक', ta: 'ஆன்மா காரகம்', te: 'ఆత్మ కారకం', bn: 'আত্মা কারক', kn: 'ಆತ್ಮ ಕಾರಕ', gu: 'આત્મા કારક' }, governs: { en: 'Your soul\'s deepest desire and life purpose. The king of your chart — all other karakas serve this planet\'s agenda.', hi: 'आत्मा की गहनतम इच्छा और जीवन उद्देश्य। कुण्डली का राजा — सभी अन्य कारक इस ग्रह की सेवा करते हैं।' } },
  AmK: { full: { en: 'Amatyakaraka', hi: 'अमात्यकारक', sa: 'अमात्यकारक', mai: 'अमात्यकारक', mr: 'अमात्यकारक', ta: 'அமாத்தியகாரகன்', te: 'అమాత్యకారకుడు', bn: 'অমাত্যকারক', kn: 'ಅಮಾತ್ಯಕಾರಕ', gu: 'અમાત્યકારક' }, meaning: { en: 'Minister/Career', hi: 'मन्त्री/कैरियर', sa: 'मन्त्री/कैरियर', mai: 'मन्त्री/कैरियर', mr: 'मन्त्री/कैरियर', ta: 'அமைச்சர்/தொழில்', te: 'మంత్రి/వృత్తి', bn: 'মন্ত্রী/কর্মজীবন', kn: 'ಮಂತ್ರಿ/ವೃತ್ತಿ', gu: 'મંત્રી/કારકિર્દી' }, governs: { en: 'Career direction, profession, how you serve society. The minister who executes the soul\'s purpose through worldly work.', hi: 'कैरियर दिशा, पेशा, समाज सेवा। मन्त्री जो सांसारिक कार्य से आत्मा के उद्देश्य को पूर्ण करता है।' } },
  BK: { full: { en: 'Bhratrikaraka', hi: 'भ्रातृकारक', sa: 'भ्रातृकारक', mai: 'भ्रातृकारक', mr: 'भ्रातृकारक', ta: 'Bhratrikaraka', te: 'Bhratrikaraka', bn: 'Bhratrikaraka', kn: 'Bhratrikaraka', gu: 'Bhratrikaraka' }, meaning: { en: 'Sibling Significator', hi: 'भाई-बहन कारक', sa: 'भाई-बहन कारक', mai: 'भाई-बहन कारक', mr: 'भाई-बहन कारक', ta: 'Sibling Significator', te: 'Sibling Significator', bn: 'Sibling Significator', kn: 'Sibling Significator', gu: 'Sibling Significator' }, governs: { en: 'Siblings, close friends, courage, and support network. Shows the nature of your peer relationships.', hi: 'भाई-बहन, निकट मित्र, साहस और सहायता। सहकर्मी सम्बन्धों की प्रकृति।', sa: 'भाई-बहन, निकट मित्र, साहस और सहायता। सहकर्मी सम्बन्धों की प्रकृति।', mai: 'भाई-बहन, निकट मित्र, साहस और सहायता। सहकर्मी सम्बन्धों की प्रकृति।', mr: 'भाई-बहन, निकट मित्र, साहस और सहायता। सहकर्मी सम्बन्धों की प्रकृति।', ta: 'Siblings, close friends, courage, and support network. Shows the nature of your peer relationships.', te: 'Siblings, close friends, courage, and support network. Shows the nature of your peer relationships.', bn: 'Siblings, close friends, courage, and support network. Shows the nature of your peer relationships.', kn: 'Siblings, close friends, courage, and support network. Shows the nature of your peer relationships.', gu: 'Siblings, close friends, courage, and support network. Shows the nature of your peer relationships.' } },
  MK: { full: { en: 'Matrikaraka', hi: 'मातृकारक', sa: 'मातृकारक', mai: 'मातृकारक', mr: 'मातृकारक', ta: 'Matrikaraka', te: 'Matrikaraka', bn: 'Matrikaraka', kn: 'Matrikaraka', gu: 'Matrikaraka' }, meaning: { en: 'Mother Significator', hi: 'माता कारक', sa: 'माता कारक', mai: 'माता कारक', mr: 'माता कारक', ta: 'Mother Significator', te: 'Mother Significator', bn: 'Mother Significator', kn: 'Mother Significator', gu: 'Mother Significator' }, governs: { en: 'Mother, home, emotional security, property, and inner comfort. The nurturing force in your life.', hi: 'माता, घर, भावनात्मक सुरक्षा, सम्पत्ति। जीवन में पोषण शक्ति।', sa: 'माता, घर, भावनात्मक सुरक्षा, सम्पत्ति। जीवन में पोषण शक्ति।', mai: 'माता, घर, भावनात्मक सुरक्षा, सम्पत्ति। जीवन में पोषण शक्ति।', mr: 'माता, घर, भावनात्मक सुरक्षा, सम्पत्ति। जीवन में पोषण शक्ति।', ta: 'Mother, home, emotional security, property, and inner comfort. The nurturing force in your life.', te: 'Mother, home, emotional security, property, and inner comfort. The nurturing force in your life.', bn: 'Mother, home, emotional security, property, and inner comfort. The nurturing force in your life.', kn: 'Mother, home, emotional security, property, and inner comfort. The nurturing force in your life.', gu: 'Mother, home, emotional security, property, and inner comfort. The nurturing force in your life.' } },
  PK: { full: { en: 'Putrakaraka', hi: 'पुत्रकारक', sa: 'पुत्रकारक', mai: 'पुत्रकारक', mr: 'पुत्रकारक', ta: 'புத்திரகாரகன்', te: 'పుత్రకారకుడు', bn: 'পুত্রকারক', kn: 'ಪುತ್ರಕಾರಕ', gu: 'પુત્રકારક' }, meaning: { en: 'Children Significator', hi: 'सन्तान कारक', sa: 'सन्तान कारक', mai: 'सन्तान कारक', mr: 'सन्तान कारक', ta: 'Children Significator', te: 'Children Significator', bn: 'Children Significator', kn: 'Children Significator', gu: 'Children Significator' }, governs: { en: 'Children, creativity, intelligence, disciples, and merit from past lives (Poorva Punya).', hi: 'सन्तान, सृजनशीलता, बुद्धि, शिष्य और पूर्व पुण्य।', sa: 'सन्तान, सृजनशीलता, बुद्धि, शिष्य और पूर्व पुण्य।', mai: 'सन्तान, सृजनशीलता, बुद्धि, शिष्य और पूर्व पुण्य।', mr: 'सन्तान, सृजनशीलता, बुद्धि, शिष्य और पूर्व पुण्य।', ta: 'Children, creativity, intelligence, disciples, and merit from past lives (Poorva Punya).', te: 'Children, creativity, intelligence, disciples, and merit from past lives (Poorva Punya).', bn: 'Children, creativity, intelligence, disciples, and merit from past lives (Poorva Punya).', kn: 'Children, creativity, intelligence, disciples, and merit from past lives (Poorva Punya).', gu: 'Children, creativity, intelligence, disciples, and merit from past lives (Poorva Punya).' } },
  GK: { full: { en: 'Gnatikaraka', hi: 'ज्ञातिकारक', sa: 'ज्ञातिकारक', mai: 'ज्ञातिकारक', mr: 'ज्ञातिकारक', ta: 'ஞாதிகாரகன்', te: 'జ్ఞాతికారకుడు', bn: 'জ্ঞাতিকারক', kn: 'ಜ್ಞಾತಿಕಾರಕ', gu: 'જ્ઞાતિકારક' }, meaning: { en: 'Rival/Disease', hi: 'शत्रु/रोग कारक', sa: 'शत्रु/रोग कारक', mai: 'शत्रु/रोग कारक', mr: 'शत्रु/रोग कारक', ta: 'Rival/Disease', te: 'Rival/Disease', bn: 'Rival/Disease', kn: 'Rival/Disease', gu: 'Rival/Disease' }, governs: { en: 'Enemies, diseases, obstacles, and litigation. Shows the nature of challenges you face and must overcome.', hi: 'शत्रु, रोग, बाधाएँ और मुकदमे। चुनौतियों की प्रकृति जिन्हें जीतना है।', sa: 'शत्रु, रोग, बाधाएँ और मुकदमे। चुनौतियों की प्रकृति जिन्हें जीतना है।', mai: 'शत्रु, रोग, बाधाएँ और मुकदमे। चुनौतियों की प्रकृति जिन्हें जीतना है।', mr: 'शत्रु, रोग, बाधाएँ और मुकदमे। चुनौतियों की प्रकृति जिन्हें जीतना है।', ta: 'Enemies, diseases, obstacles, and litigation. Shows the nature of challenges you face and must overcome.', te: 'Enemies, diseases, obstacles, and litigation. Shows the nature of challenges you face and must overcome.', bn: 'Enemies, diseases, obstacles, and litigation. Shows the nature of challenges you face and must overcome.', kn: 'Enemies, diseases, obstacles, and litigation. Shows the nature of challenges you face and must overcome.', gu: 'Enemies, diseases, obstacles, and litigation. Shows the nature of challenges you face and must overcome.' } },
  DK: { full: { en: 'Darakaraka', hi: 'दारकारक', sa: 'दारकारक', mai: 'दारकारक', mr: 'दारकारक', ta: 'தாரகாரகன்', te: 'దారకారకుడు', bn: 'দারকারক', kn: 'ದಾರಕಾರಕ', gu: 'દારકારક' }, meaning: { en: 'Spouse Significator', hi: 'जीवनसाथी कारक', sa: 'जीवनसाथी कारक', mai: 'जीवनसाथी कारक', mr: 'जीवनसाथी कारक', ta: 'Spouse Significator', te: 'Spouse Significator', bn: 'Spouse Significator', kn: 'Spouse Significator', gu: 'Spouse Significator' }, governs: { en: 'Spouse, business partners, and significant relationships. The planet with the lowest degree reveals your partner\'s nature.', hi: 'जीवनसाथी, व्यापार साझेदार। सबसे कम अंश वाला ग्रह साथी का स्वभाव बताता है।' } },
  Atmakaraka: { full: { en: 'Atmakaraka', hi: 'आत्मकारक', sa: 'आत्मकारक', mai: 'आत्मकारक', mr: 'आत्मकारक', ta: 'ஆத்மகாரகன்', te: 'ఆత్మకారకుడు', bn: 'আত্মকারক', kn: 'ಆತ್ಮಕಾರಕ', gu: 'આત્મકારક' }, meaning: { en: 'Soul Significator', hi: 'आत्मा का कारक', sa: 'आत्मा का कारक', mai: 'आत्मा का कारक', mr: 'आत्मा का कारक', ta: 'ஆன்மா காரகம்', te: 'ఆత్మ కారకం', bn: 'আত্মা কারক', kn: 'ಆತ್ಮ ಕಾರಕ', gu: 'આત્મા કારક' }, governs: { en: 'Your soul\'s deepest desire and life purpose.', hi: 'आत्मा की गहनतम इच्छा और जीवन उद्देश्य।' } },
  Amatyakaraka: { full: { en: 'Amatyakaraka', hi: 'अमात्यकारक', sa: 'अमात्यकारक', mai: 'अमात्यकारक', mr: 'अमात्यकारक', ta: 'அமாத்தியகாரகன்', te: 'అమాత్యకారకుడు', bn: 'অমাত্যকারক', kn: 'ಅಮಾತ್ಯಕಾರಕ', gu: 'અમાત્યકારક' }, meaning: { en: 'Minister/Career', hi: 'मन्त्री/कैरियर', sa: 'मन्त्री/कैरियर', mai: 'मन्त्री/कैरियर', mr: 'मन्त्री/कैरियर', ta: 'அமைச்சர்/தொழில்', te: 'మంత్రి/వృత్తి', bn: 'মন্ত্রী/কর্মজীবন', kn: 'ಮಂತ್ರಿ/ವೃತ್ತಿ', gu: 'મંત્રી/કારકિર્દી' }, governs: { en: 'Career direction and profession.', hi: 'कैरियर दिशा और पेशा।', sa: 'कैरियर दिशा और पेशा।', mai: 'कैरियर दिशा और पेशा।', mr: 'कैरियर दिशा और पेशा।', ta: 'Career direction and profession.', te: 'Career direction and profession.', bn: 'Career direction and profession.', kn: 'Career direction and profession.', gu: 'Career direction and profession.' } },
  Bhratrikaraka: { full: { en: 'Bhratrikaraka', hi: 'भ्रातृकारक', sa: 'भ्रातृकारक', mai: 'भ्रातृकारक', mr: 'भ्रातृकारक', ta: 'Bhratrikaraka', te: 'Bhratrikaraka', bn: 'Bhratrikaraka', kn: 'Bhratrikaraka', gu: 'Bhratrikaraka' }, meaning: { en: 'Sibling Significator', hi: 'भाई-बहन कारक', sa: 'भाई-बहन कारक', mai: 'भाई-बहन कारक', mr: 'भाई-बहन कारक', ta: 'Sibling Significator', te: 'Sibling Significator', bn: 'Sibling Significator', kn: 'Sibling Significator', gu: 'Sibling Significator' }, governs: { en: 'Siblings and support network.', hi: 'भाई-बहन और सहायता।', sa: 'भाई-बहन और सहायता।', mai: 'भाई-बहन और सहायता।', mr: 'भाई-बहन और सहायता।', ta: 'Siblings and support network.', te: 'Siblings and support network.', bn: 'Siblings and support network.', kn: 'Siblings and support network.', gu: 'Siblings and support network.' } },
  Matrikaraka: { full: { en: 'Matrikaraka', hi: 'मातृकारक', sa: 'मातृकारक', mai: 'मातृकारक', mr: 'मातृकारक', ta: 'Matrikaraka', te: 'Matrikaraka', bn: 'Matrikaraka', kn: 'Matrikaraka', gu: 'Matrikaraka' }, meaning: { en: 'Mother Significator', hi: 'माता कारक', sa: 'माता कारक', mai: 'माता कारक', mr: 'माता कारक', ta: 'Mother Significator', te: 'Mother Significator', bn: 'Mother Significator', kn: 'Mother Significator', gu: 'Mother Significator' }, governs: { en: 'Mother, home, emotional security.', hi: 'माता, घर, भावनात्मक सुरक्षा।', sa: 'माता, घर, भावनात्मक सुरक्षा।', mai: 'माता, घर, भावनात्मक सुरक्षा।', mr: 'माता, घर, भावनात्मक सुरक्षा।', ta: 'Mother, home, emotional security.', te: 'Mother, home, emotional security.', bn: 'Mother, home, emotional security.', kn: 'Mother, home, emotional security.', gu: 'Mother, home, emotional security.' } },
  Putrakaraka: { full: { en: 'Putrakaraka', hi: 'पुत्रकारक', sa: 'पुत्रकारक', mai: 'पुत्रकारक', mr: 'पुत्रकारक', ta: 'புத்திரகாரகன்', te: 'పుత్రకారకుడు', bn: 'পুত্রকারক', kn: 'ಪುತ್ರಕಾರಕ', gu: 'પુત્રકારક' }, meaning: { en: 'Children Significator', hi: 'सन्तान कारक', sa: 'सन्तान कारक', mai: 'सन्तान कारक', mr: 'सन्तान कारक', ta: 'Children Significator', te: 'Children Significator', bn: 'Children Significator', kn: 'Children Significator', gu: 'Children Significator' }, governs: { en: 'Children, creativity, intelligence.', hi: 'सन्तान, सृजनशीलता, बुद्धि।', sa: 'सन्तान, सृजनशीलता, बुद्धि।', mai: 'सन्तान, सृजनशीलता, बुद्धि।', mr: 'सन्तान, सृजनशीलता, बुद्धि।', ta: 'Children, creativity, intelligence.', te: 'Children, creativity, intelligence.', bn: 'Children, creativity, intelligence.', kn: 'Children, creativity, intelligence.', gu: 'Children, creativity, intelligence.' } },
  Gnatikaraka: { full: { en: 'Gnatikaraka', hi: 'ज्ञातिकारक', sa: 'ज्ञातिकारक', mai: 'ज्ञातिकारक', mr: 'ज्ञातिकारक', ta: 'ஞாதிகாரகன்', te: 'జ్ఞాతికారకుడు', bn: 'জ্ঞাতিকারক', kn: 'ಜ್ಞಾತಿಕಾರಕ', gu: 'જ્ઞાતિકારક' }, meaning: { en: 'Rival/Disease', hi: 'शत्रु/रोग कारक', sa: 'शत्रु/रोग कारक', mai: 'शत्रु/रोग कारक', mr: 'शत्रु/रोग कारक', ta: 'Rival/Disease', te: 'Rival/Disease', bn: 'Rival/Disease', kn: 'Rival/Disease', gu: 'Rival/Disease' }, governs: { en: 'Enemies, diseases, obstacles.', hi: 'शत्रु, रोग, बाधाएँ।', sa: 'शत्रु, रोग, बाधाएँ।', mai: 'शत्रु, रोग, बाधाएँ।', mr: 'शत्रु, रोग, बाधाएँ।', ta: 'Enemies, diseases, obstacles.', te: 'Enemies, diseases, obstacles.', bn: 'Enemies, diseases, obstacles.', kn: 'Enemies, diseases, obstacles.', gu: 'Enemies, diseases, obstacles.' } },
  Darakaraka: { full: { en: 'Darakaraka', hi: 'दारकारक', sa: 'दारकारक', mai: 'दारकारक', mr: 'दारकारक', ta: 'தாரகாரகன்', te: 'దారకారకుడు', bn: 'দারকারক', kn: 'ದಾರಕಾರಕ', gu: 'દારકારક' }, meaning: { en: 'Spouse Significator', hi: 'जीवनसाथी कारक', sa: 'जीवनसाथी कारक', mai: 'जीवनसाथी कारक', mr: 'जीवनसाथी कारक', ta: 'Spouse Significator', te: 'Spouse Significator', bn: 'Spouse Significator', kn: 'Spouse Significator', gu: 'Spouse Significator' }, governs: { en: 'Spouse and partnerships.', hi: 'जीवनसाथी और साझेदारी।', sa: 'जीवनसाथी और साझेदारी।', mai: 'जीवनसाथी और साझेदारी।', mr: 'जीवनसाथी और साझेदारी।', ta: 'Spouse and partnerships.', te: 'Spouse and partnerships.', bn: 'Spouse and partnerships.', kn: 'Spouse and partnerships.', gu: 'Spouse and partnerships.' } },
};

const KARAKAMSHA_MEANING: Record<number, LocaleText> = {
  1: { en: 'Aries — Independent, pioneering soul. Drawn to leadership, military, sports, or entrepreneurship. Must learn patience.', hi: 'मेष — स्वतन्त्र, अग्रणी आत्मा। नेतृत्व, सेना, खेल या उद्यमिता की ओर। धैर्य सीखना आवश्यक।', sa: 'मेष — स्वतन्त्र, अग्रणी आत्मा। नेतृत्व, सेना, खेल या उद्यमिता की ओर। धैर्य सीखना आवश्यक।', mai: 'मेष — स्वतन्त्र, अग्रणी आत्मा। नेतृत्व, सेना, खेल या उद्यमिता की ओर। धैर्य सीखना आवश्यक।', mr: 'मेष — स्वतन्त्र, अग्रणी आत्मा। नेतृत्व, सेना, खेल या उद्यमिता की ओर। धैर्य सीखना आवश्यक।', ta: 'Aries — Independent, pioneering soul. Drawn to leadership, military, sports, or entrepreneurship. Must learn patience.', te: 'Aries — Independent, pioneering soul. Drawn to leadership, military, sports, or entrepreneurship. Must learn patience.', bn: 'Aries — Independent, pioneering soul. Drawn to leadership, military, sports, or entrepreneurship. Must learn patience.', kn: 'Aries — Independent, pioneering soul. Drawn to leadership, military, sports, or entrepreneurship. Must learn patience.', gu: 'Aries — Independent, pioneering soul. Drawn to leadership, military, sports, or entrepreneurship. Must learn patience.' },
  2: { en: 'Taurus — Soul seeks stability, beauty, and material comfort. Drawn to arts, finance, agriculture, and luxury.', hi: 'वृषभ — स्थिरता, सौन्दर्य और भौतिक सुख की खोज। कला, वित्त, कृषि और विलासिता।', sa: 'वृषभ — स्थिरता, सौन्दर्य और भौतिक सुख की खोज। कला, वित्त, कृषि और विलासिता।', mai: 'वृषभ — स्थिरता, सौन्दर्य और भौतिक सुख की खोज। कला, वित्त, कृषि और विलासिता।', mr: 'वृषभ — स्थिरता, सौन्दर्य और भौतिक सुख की खोज। कला, वित्त, कृषि और विलासिता।', ta: 'Taurus — Soul seeks stability, beauty, and material comfort. Drawn to arts, finance, agriculture, and luxury.', te: 'Taurus — Soul seeks stability, beauty, and material comfort. Drawn to arts, finance, agriculture, and luxury.', bn: 'Taurus — Soul seeks stability, beauty, and material comfort. Drawn to arts, finance, agriculture, and luxury.', kn: 'Taurus — Soul seeks stability, beauty, and material comfort. Drawn to arts, finance, agriculture, and luxury.', gu: 'Taurus — Soul seeks stability, beauty, and material comfort. Drawn to arts, finance, agriculture, and luxury.' },
  3: { en: 'Gemini — Intellectual soul seeking knowledge and communication. Drawn to writing, teaching, trade, and media.', hi: 'मिथुन — ज्ञान और संवाद की खोज करने वाली बौद्धिक आत्मा। लेखन, शिक्षण, मीडिया।', sa: 'मिथुन — ज्ञान और संवाद की खोज करने वाली बौद्धिक आत्मा। लेखन, शिक्षण, मीडिया।', mai: 'मिथुन — ज्ञान और संवाद की खोज करने वाली बौद्धिक आत्मा। लेखन, शिक्षण, मीडिया।', mr: 'मिथुन — ज्ञान और संवाद की खोज करने वाली बौद्धिक आत्मा। लेखन, शिक्षण, मीडिया।', ta: 'Gemini — Intellectual soul seeking knowledge and communication. Drawn to writing, teaching, trade, and media.', te: 'Gemini — Intellectual soul seeking knowledge and communication. Drawn to writing, teaching, trade, and media.', bn: 'Gemini — Intellectual soul seeking knowledge and communication. Drawn to writing, teaching, trade, and media.', kn: 'Gemini — Intellectual soul seeking knowledge and communication. Drawn to writing, teaching, trade, and media.', gu: 'Gemini — Intellectual soul seeking knowledge and communication. Drawn to writing, teaching, trade, and media.' },
  4: { en: 'Cancer — Nurturing soul seeking emotional fulfillment. Drawn to caregiving, home, cooking, psychology.', hi: 'कर्क — भावनात्मक पूर्णता चाहने वाली पोषक आत्मा। देखभाल, गृह, मनोविज्ञान।', sa: 'कर्क — भावनात्मक पूर्णता चाहने वाली पोषक आत्मा। देखभाल, गृह, मनोविज्ञान।', mai: 'कर्क — भावनात्मक पूर्णता चाहने वाली पोषक आत्मा। देखभाल, गृह, मनोविज्ञान।', mr: 'कर्क — भावनात्मक पूर्णता चाहने वाली पोषक आत्मा। देखभाल, गृह, मनोविज्ञान।', ta: 'Cancer — Nurturing soul seeking emotional fulfillment. Drawn to caregiving, home, cooking, psychology.', te: 'Cancer — Nurturing soul seeking emotional fulfillment. Drawn to caregiving, home, cooking, psychology.', bn: 'Cancer — Nurturing soul seeking emotional fulfillment. Drawn to caregiving, home, cooking, psychology.', kn: 'Cancer — Nurturing soul seeking emotional fulfillment. Drawn to caregiving, home, cooking, psychology.', gu: 'Cancer — Nurturing soul seeking emotional fulfillment. Drawn to caregiving, home, cooking, psychology.' },
  5: { en: 'Leo — Royal soul seeking recognition and creative expression. Drawn to politics, performance, and authority.', hi: 'सिंह — मान्यता और सृजनात्मक अभिव्यक्ति चाहने वाली राजसी आत्मा। राजनीति, प्रदर्शन।', sa: 'सिंह — मान्यता और सृजनात्मक अभिव्यक्ति चाहने वाली राजसी आत्मा। राजनीति, प्रदर्शन।', mai: 'सिंह — मान्यता और सृजनात्मक अभिव्यक्ति चाहने वाली राजसी आत्मा। राजनीति, प्रदर्शन।', mr: 'सिंह — मान्यता और सृजनात्मक अभिव्यक्ति चाहने वाली राजसी आत्मा। राजनीति, प्रदर्शन।', ta: 'Leo — Royal soul seeking recognition and creative expression. Drawn to politics, performance, and authority.', te: 'Leo — Royal soul seeking recognition and creative expression. Drawn to politics, performance, and authority.', bn: 'Leo — Royal soul seeking recognition and creative expression. Drawn to politics, performance, and authority.', kn: 'Leo — Royal soul seeking recognition and creative expression. Drawn to politics, performance, and authority.', gu: 'Leo — Royal soul seeking recognition and creative expression. Drawn to politics, performance, and authority.' },
  6: { en: 'Virgo — Service-oriented soul seeking perfection. Drawn to healing, analysis, craftsmanship, and detail work.', hi: 'कन्या — पूर्णता चाहने वाली सेवा-उन्मुख आत्मा। उपचार, विश्लेषण, शिल्प।', sa: 'कन्या — पूर्णता चाहने वाली सेवा-उन्मुख आत्मा। उपचार, विश्लेषण, शिल्प।', mai: 'कन्या — पूर्णता चाहने वाली सेवा-उन्मुख आत्मा। उपचार, विश्लेषण, शिल्प।', mr: 'कन्या — पूर्णता चाहने वाली सेवा-उन्मुख आत्मा। उपचार, विश्लेषण, शिल्प।', ta: 'Virgo — Service-oriented soul seeking perfection. Drawn to healing, analysis, craftsmanship, and detail work.', te: 'Virgo — Service-oriented soul seeking perfection. Drawn to healing, analysis, craftsmanship, and detail work.', bn: 'Virgo — Service-oriented soul seeking perfection. Drawn to healing, analysis, craftsmanship, and detail work.', kn: 'Virgo — Service-oriented soul seeking perfection. Drawn to healing, analysis, craftsmanship, and detail work.', gu: 'Virgo — Service-oriented soul seeking perfection. Drawn to healing, analysis, craftsmanship, and detail work.' },
  7: { en: 'Libra — Soul seeking balance, beauty, and harmony. Drawn to law, diplomacy, arts, and partnerships.', hi: 'तुला — सन्तुलन, सौन्दर्य और सामंजस्य की खोज। कानून, कूटनीति, कला।', sa: 'तुला — सन्तुलन, सौन्दर्य और सामंजस्य की खोज। कानून, कूटनीति, कला।', mai: 'तुला — सन्तुलन, सौन्दर्य और सामंजस्य की खोज। कानून, कूटनीति, कला।', mr: 'तुला — सन्तुलन, सौन्दर्य और सामंजस्य की खोज। कानून, कूटनीति, कला।', ta: 'Libra — Soul seeking balance, beauty, and harmony. Drawn to law, diplomacy, arts, and partnerships.', te: 'Libra — Soul seeking balance, beauty, and harmony. Drawn to law, diplomacy, arts, and partnerships.', bn: 'Libra — Soul seeking balance, beauty, and harmony. Drawn to law, diplomacy, arts, and partnerships.', kn: 'Libra — Soul seeking balance, beauty, and harmony. Drawn to law, diplomacy, arts, and partnerships.', gu: 'Libra — Soul seeking balance, beauty, and harmony. Drawn to law, diplomacy, arts, and partnerships.' },
  8: { en: 'Scorpio — Transformative soul seeking deep truth. Drawn to research, occult, medicine, and investigation.', hi: 'वृश्चिक — गहन सत्य खोजने वाली परिवर्तनकारी आत्मा। शोध, गुप्त विद्या, चिकित्सा।', sa: 'वृश्चिक — गहन सत्य खोजने वाली परिवर्तनकारी आत्मा। शोध, गुप्त विद्या, चिकित्सा।', mai: 'वृश्चिक — गहन सत्य खोजने वाली परिवर्तनकारी आत्मा। शोध, गुप्त विद्या, चिकित्सा।', mr: 'वृश्चिक — गहन सत्य खोजने वाली परिवर्तनकारी आत्मा। शोध, गुप्त विद्या, चिकित्सा।', ta: 'Scorpio — Transformative soul seeking deep truth. Drawn to research, occult, medicine, and investigation.', te: 'Scorpio — Transformative soul seeking deep truth. Drawn to research, occult, medicine, and investigation.', bn: 'Scorpio — Transformative soul seeking deep truth. Drawn to research, occult, medicine, and investigation.', kn: 'Scorpio — Transformative soul seeking deep truth. Drawn to research, occult, medicine, and investigation.', gu: 'Scorpio — Transformative soul seeking deep truth. Drawn to research, occult, medicine, and investigation.' },
  9: { en: 'Sagittarius — Dharmic soul seeking wisdom and higher learning. Drawn to philosophy, religion, law, and travel.', hi: 'धनु — ज्ञान और उच्च शिक्षा चाहने वाली धार्मिक आत्मा। दर्शन, धर्म, कानून।', sa: 'धनु — ज्ञान और उच्च शिक्षा चाहने वाली धार्मिक आत्मा। दर्शन, धर्म, कानून।', mai: 'धनु — ज्ञान और उच्च शिक्षा चाहने वाली धार्मिक आत्मा। दर्शन, धर्म, कानून।', mr: 'धनु — ज्ञान और उच्च शिक्षा चाहने वाली धार्मिक आत्मा। दर्शन, धर्म, कानून।', ta: 'Sagittarius — Dharmic soul seeking wisdom and higher learning. Drawn to philosophy, religion, law, and travel.', te: 'Sagittarius — Dharmic soul seeking wisdom and higher learning. Drawn to philosophy, religion, law, and travel.', bn: 'Sagittarius — Dharmic soul seeking wisdom and higher learning. Drawn to philosophy, religion, law, and travel.', kn: 'Sagittarius — Dharmic soul seeking wisdom and higher learning. Drawn to philosophy, religion, law, and travel.', gu: 'Sagittarius — Dharmic soul seeking wisdom and higher learning. Drawn to philosophy, religion, law, and travel.' },
  10: { en: 'Capricorn — Ambitious soul seeking lasting achievement. Drawn to governance, structure, tradition, and legacy.', hi: 'मकर — स्थायी उपलब्धि चाहने वाली महत्वाकांक्षी आत्मा। शासन, परम्परा, विरासत।', sa: 'मकर — स्थायी उपलब्धि चाहने वाली महत्वाकांक्षी आत्मा। शासन, परम्परा, विरासत।', mai: 'मकर — स्थायी उपलब्धि चाहने वाली महत्वाकांक्षी आत्मा। शासन, परम्परा, विरासत।', mr: 'मकर — स्थायी उपलब्धि चाहने वाली महत्वाकांक्षी आत्मा। शासन, परम्परा, विरासत।', ta: 'Capricorn — Ambitious soul seeking lasting achievement. Drawn to governance, structure, tradition, and legacy.', te: 'Capricorn — Ambitious soul seeking lasting achievement. Drawn to governance, structure, tradition, and legacy.', bn: 'Capricorn — Ambitious soul seeking lasting achievement. Drawn to governance, structure, tradition, and legacy.', kn: 'Capricorn — Ambitious soul seeking lasting achievement. Drawn to governance, structure, tradition, and legacy.', gu: 'Capricorn — Ambitious soul seeking lasting achievement. Drawn to governance, structure, tradition, and legacy.' },
  11: { en: 'Aquarius — Humanitarian soul seeking universal truth. Drawn to science, technology, social reform, and innovation.', hi: 'कुम्भ — सार्वभौमिक सत्य चाहने वाली मानवतावादी आत्मा। विज्ञान, समाज सुधार।', sa: 'कुम्भ — सार्वभौमिक सत्य चाहने वाली मानवतावादी आत्मा। विज्ञान, समाज सुधार।', mai: 'कुम्भ — सार्वभौमिक सत्य चाहने वाली मानवतावादी आत्मा। विज्ञान, समाज सुधार।', mr: 'कुम्भ — सार्वभौमिक सत्य चाहने वाली मानवतावादी आत्मा। विज्ञान, समाज सुधार।', ta: 'Aquarius — Humanitarian soul seeking universal truth. Drawn to science, technology, social reform, and innovation.', te: 'Aquarius — Humanitarian soul seeking universal truth. Drawn to science, technology, social reform, and innovation.', bn: 'Aquarius — Humanitarian soul seeking universal truth. Drawn to science, technology, social reform, and innovation.', kn: 'Aquarius — Humanitarian soul seeking universal truth. Drawn to science, technology, social reform, and innovation.', gu: 'Aquarius — Humanitarian soul seeking universal truth. Drawn to science, technology, social reform, and innovation.' },
  12: { en: 'Pisces — Spiritual soul seeking liberation. Drawn to meditation, healing, charity, and transcendence. Moksha-oriented.', hi: 'मीन — मोक्ष चाहने वाली आध्यात्मिक आत्मा। ध्यान, उपचार, दान। मोक्ष-उन्मुख।', sa: 'मीन — मोक्ष चाहने वाली आध्यात्मिक आत्मा। ध्यान, उपचार, दान। मोक्ष-उन्मुख।', mai: 'मीन — मोक्ष चाहने वाली आध्यात्मिक आत्मा। ध्यान, उपचार, दान। मोक्ष-उन्मुख।', mr: 'मीन — मोक्ष चाहने वाली आध्यात्मिक आत्मा। ध्यान, उपचार, दान। मोक्ष-उन्मुख।', ta: 'Pisces — Spiritual soul seeking liberation. Drawn to meditation, healing, charity, and transcendence. Moksha-oriented.', te: 'Pisces — Spiritual soul seeking liberation. Drawn to meditation, healing, charity, and transcendence. Moksha-oriented.', bn: 'Pisces — Spiritual soul seeking liberation. Drawn to meditation, healing, charity, and transcendence. Moksha-oriented.', kn: 'Pisces — Spiritual soul seeking liberation. Drawn to meditation, healing, charity, and transcendence. Moksha-oriented.', gu: 'Pisces — Spiritual soul seeking liberation. Drawn to meditation, healing, charity, and transcendence. Moksha-oriented.' },
};

const ARUDHA_MEANING: Record<number, LocaleText> = {
  1: { en: 'Arudha Lagna (AL) — How the world perceives you. Your public image and reputation.', hi: 'आरूढ़ लग्न (AL) — विश्व आपको कैसे देखता है। सार्वजनिक छवि।', sa: 'आरूढ़ लग्न (AL) — विश्व आपको कैसे देखता है। सार्वजनिक छवि।', mai: 'आरूढ़ लग्न (AL) — विश्व आपको कैसे देखता है। सार्वजनिक छवि।', mr: 'आरूढ़ लग्न (AL) — विश्व आपको कैसे देखता है। सार्वजनिक छवि।', ta: 'Arudha Lagna (AL) — How the world perceives you. Your public image and reputation.', te: 'Arudha Lagna (AL) — How the world perceives you. Your public image and reputation.', bn: 'Arudha Lagna (AL) — How the world perceives you. Your public image and reputation.', kn: 'Arudha Lagna (AL) — How the world perceives you. Your public image and reputation.', gu: 'Arudha Lagna (AL) — How the world perceives you. Your public image and reputation.' },
  2: { en: 'A2 — Perceived wealth and family status.', hi: 'A2 — प्रत्यक्ष धन और पारिवारिक स्थिति।', sa: 'A2 — प्रत्यक्ष धन और पारिवारिक स्थिति।', mai: 'A2 — प्रत्यक्ष धन और पारिवारिक स्थिति।', mr: 'A2 — प्रत्यक्ष धन और पारिवारिक स्थिति।', ta: 'A2 — Perceived wealth and family status.', te: 'A2 — Perceived wealth and family status.', bn: 'A2 — Perceived wealth and family status.', kn: 'A2 — Perceived wealth and family status.', gu: 'A2 — Perceived wealth and family status.' },
  3: { en: 'A3 — Image of courage and siblings.', hi: 'A3 — साहस और भाई-बहनों की छवि।', sa: 'A3 — साहस और भाई-बहनों की छवि।', mai: 'A3 — साहस और भाई-बहनों की छवि।', mr: 'A3 — साहस और भाई-बहनों की छवि।', ta: 'A3 — Image of courage and siblings.', te: 'A3 — Image of courage and siblings.', bn: 'A3 — Image of courage and siblings.', kn: 'A3 — Image of courage and siblings.', gu: 'A3 — Image of courage and siblings.' },
  4: { en: 'A4 — Perceived happiness and property.', hi: 'A4 — सुख और सम्पत्ति की छवि।', sa: 'A4 — सुख और सम्पत्ति की छवि।', mai: 'A4 — सुख और सम्पत्ति की छवि।', mr: 'A4 — सुख और सम्पत्ति की छवि।', ta: 'A4 — Perceived happiness and property.', te: 'A4 — Perceived happiness and property.', bn: 'A4 — Perceived happiness and property.', kn: 'A4 — Perceived happiness and property.', gu: 'A4 — Perceived happiness and property.' },
  5: { en: 'A5 — Image of intelligence and children.', hi: 'A5 — बुद्धि और सन्तान की छवि।', sa: 'A5 — बुद्धि और सन्तान की छवि।', mai: 'A5 — बुद्धि और सन्तान की छवि।', mr: 'A5 — बुद्धि और सन्तान की छवि।', ta: 'A5 — Image of intelligence and children.', te: 'A5 — Image of intelligence and children.', bn: 'A5 — Image of intelligence and children.', kn: 'A5 — Image of intelligence and children.', gu: 'A5 — Image of intelligence and children.' },
  6: { en: 'A6 — Perceived enemies and debts.', hi: 'A6 — शत्रुओं और ऋणों की छवि।', sa: 'A6 — शत्रुओं और ऋणों की छवि।', mai: 'A6 — शत्रुओं और ऋणों की छवि।', mr: 'A6 — शत्रुओं और ऋणों की छवि।', ta: 'A6 — Perceived enemies and debts.', te: 'A6 — Perceived enemies and debts.', bn: 'A6 — Perceived enemies and debts.', kn: 'A6 — Perceived enemies and debts.', gu: 'A6 — Perceived enemies and debts.' },
  7: { en: 'Darapada (A7) — How others see your marriage/partnerships. Spouse\'s public image.', hi: 'दारपद (A7) — विवाह/साझेदारी कैसी दिखती है। जीवनसाथी की सार्वजनिक छवि।' },
  8: { en: 'A8 — Perceived longevity and hidden matters.', hi: 'A8 — दीर्घायु और गुप्त विषयों की छवि।', sa: 'A8 — दीर्घायु और गुप्त विषयों की छवि।', mai: 'A8 — दीर्घायु और गुप्त विषयों की छवि।', mr: 'A8 — दीर्घायु और गुप्त विषयों की छवि।', ta: 'A8 — Perceived longevity and hidden matters.', te: 'A8 — Perceived longevity and hidden matters.', bn: 'A8 — Perceived longevity and hidden matters.', kn: 'A8 — Perceived longevity and hidden matters.', gu: 'A8 — Perceived longevity and hidden matters.' },
  9: { en: 'A9 — Image of fortune and dharma.', hi: 'A9 — भाग्य और धर्म की छवि।', sa: 'A9 — भाग्य और धर्म की छवि।', mai: 'A9 — भाग्य और धर्म की छवि।', mr: 'A9 — भाग्य और धर्म की छवि।', ta: 'A9 — Image of fortune and dharma.', te: 'A9 — Image of fortune and dharma.', bn: 'A9 — Image of fortune and dharma.', kn: 'A9 — Image of fortune and dharma.', gu: 'A9 — Image of fortune and dharma.' },
  10: { en: 'Rajapada (A10) — How your career/authority is perceived. Professional reputation.', hi: 'राजपद (A10) — कैरियर/अधिकार कैसा दिखता है। पेशेवर प्रतिष्ठा।', sa: 'राजपद (A10) — कैरियर/अधिकार कैसा दिखता है। पेशेवर प्रतिष्ठा।', mai: 'राजपद (A10) — कैरियर/अधिकार कैसा दिखता है। पेशेवर प्रतिष्ठा।', mr: 'राजपद (A10) — कैरियर/अधिकार कैसा दिखता है। पेशेवर प्रतिष्ठा।', ta: 'Rajapada (A10) — How your career/authority is perceived. Professional reputation.', te: 'Rajapada (A10) — How your career/authority is perceived. Professional reputation.', bn: 'Rajapada (A10) — How your career/authority is perceived. Professional reputation.', kn: 'Rajapada (A10) — How your career/authority is perceived. Professional reputation.', gu: 'Rajapada (A10) — How your career/authority is perceived. Professional reputation.' },
  11: { en: 'Labha Pada (A11) — Perceived gains, income, and social network.', hi: 'लाभपद (A11) — लाभ, आय और सामाजिक नेटवर्क की छवि।', sa: 'लाभपद (A11) — लाभ, आय और सामाजिक नेटवर्क की छवि।', mai: 'लाभपद (A11) — लाभ, आय और सामाजिक नेटवर्क की छवि।', mr: 'लाभपद (A11) — लाभ, आय और सामाजिक नेटवर्क की छवि।', ta: 'Labha Pada (A11) — Perceived gains, income, and social network.', te: 'Labha Pada (A11) — Perceived gains, income, and social network.', bn: 'Labha Pada (A11) — Perceived gains, income, and social network.', kn: 'Labha Pada (A11) — Perceived gains, income, and social network.', gu: 'Labha Pada (A11) — Perceived gains, income, and social network.' },
  12: { en: 'Upapada (UL/A12) — The image of your spouse. Critical for marriage analysis.', hi: 'उपपद (UL/A12) — जीवनसाथी की छवि। विवाह विश्लेषण में महत्वपूर्ण।', sa: 'उपपद (UL/A12) — जीवनसाथी की छवि। विवाह विश्लेषण में महत्वपूर्ण।', mai: 'उपपद (UL/A12) — जीवनसाथी की छवि। विवाह विश्लेषण में महत्वपूर्ण।', mr: 'उपपद (UL/A12) — जीवनसाथी की छवि। विवाह विश्लेषण में महत्वपूर्ण।', ta: 'Upapada (UL/A12) — The image of your spouse. Critical for marriage analysis.', te: 'Upapada (UL/A12) — The image of your spouse. Critical for marriage analysis.', bn: 'Upapada (UL/A12) — The image of your spouse. Critical for marriage analysis.', kn: 'Upapada (UL/A12) — The image of your spouse. Critical for marriage analysis.', gu: 'Upapada (UL/A12) — The image of your spouse. Critical for marriage analysis.' },
};

const RASHI_ARUDHA_DESC: Record<number, LocaleText> = {
  1:  { en: 'Aries here gives a bold, pioneering image — the world sees you (in this area) as someone who acts first, leads instinctively, and projects raw energy. There may be an aura of impatience or courage that precedes you.', hi: 'मेष यहाँ साहसी, अग्रणी छवि देता है — विश्व आपको इस क्षेत्र में पहले कार्य करने वाले, सहज नेतृत्व करने वाले के रूप में देखता है। एक ऊर्जावान, कभी-कभी अधीर आभा आपसे पहले पहुँचती है।', sa: 'मेष यहाँ साहसी, अग्रणी छवि देता है — विश्व आपको इस क्षेत्र में पहले कार्य करने वाले, सहज नेतृत्व करने वाले के रूप में देखता है। एक ऊर्जावान, कभी-कभी अधीर आभा आपसे पहले पहुँचती है।', mai: 'मेष यहाँ साहसी, अग्रणी छवि देता है — विश्व आपको इस क्षेत्र में पहले कार्य करने वाले, सहज नेतृत्व करने वाले के रूप में देखता है। एक ऊर्जावान, कभी-कभी अधीर आभा आपसे पहले पहुँचती है।', mr: 'मेष यहाँ साहसी, अग्रणी छवि देता है — विश्व आपको इस क्षेत्र में पहले कार्य करने वाले, सहज नेतृत्व करने वाले के रूप में देखता है। एक ऊर्जावान, कभी-कभी अधीर आभा आपसे पहले पहुँचती है।', ta: 'Aries here gives a bold, pioneering image — the world sees you (in this area) as someone who acts first, leads instinctively, and projects raw energy. There may be an aura of impatience or courage that precedes you.', te: 'Aries here gives a bold, pioneering image — the world sees you (in this area) as someone who acts first, leads instinctively, and projects raw energy. There may be an aura of impatience or courage that precedes you.', bn: 'Aries here gives a bold, pioneering image — the world sees you (in this area) as someone who acts first, leads instinctively, and projects raw energy. There may be an aura of impatience or courage that precedes you.', kn: 'Aries here gives a bold, pioneering image — the world sees you (in this area) as someone who acts first, leads instinctively, and projects raw energy. There may be an aura of impatience or courage that precedes you.', gu: 'Aries here gives a bold, pioneering image — the world sees you (in this area) as someone who acts first, leads instinctively, and projects raw energy. There may be an aura of impatience or courage that precedes you.' },
  2:  { en: 'Taurus here gives a stable, prosperous image — the world perceives this area of your life as grounded, reliable, and materially well-rooted. You project an air of permanence and sensory richness.', hi: 'वृष यहाँ स्थिर, समृद्ध छवि देता है — विश्व इस क्षेत्र को ठोस, विश्वसनीय और भौतिक रूप से सुदृढ़ मानता है। आप स्थायित्व और संवेदनशील समृद्धि का आभास देते हैं।', sa: 'वृष यहाँ स्थिर, समृद्ध छवि देता है — विश्व इस क्षेत्र को ठोस, विश्वसनीय और भौतिक रूप से सुदृढ़ मानता है। आप स्थायित्व और संवेदनशील समृद्धि का आभास देते हैं।', mai: 'वृष यहाँ स्थिर, समृद्ध छवि देता है — विश्व इस क्षेत्र को ठोस, विश्वसनीय और भौतिक रूप से सुदृढ़ मानता है। आप स्थायित्व और संवेदनशील समृद्धि का आभास देते हैं।', mr: 'वृष यहाँ स्थिर, समृद्ध छवि देता है — विश्व इस क्षेत्र को ठोस, विश्वसनीय और भौतिक रूप से सुदृढ़ मानता है। आप स्थायित्व और संवेदनशील समृद्धि का आभास देते हैं।', ta: 'Taurus here gives a stable, prosperous image — the world perceives this area of your life as grounded, reliable, and materially well-rooted. You project an air of permanence and sensory richness.', te: 'Taurus here gives a stable, prosperous image — the world perceives this area of your life as grounded, reliable, and materially well-rooted. You project an air of permanence and sensory richness.', bn: 'Taurus here gives a stable, prosperous image — the world perceives this area of your life as grounded, reliable, and materially well-rooted. You project an air of permanence and sensory richness.', kn: 'Taurus here gives a stable, prosperous image — the world perceives this area of your life as grounded, reliable, and materially well-rooted. You project an air of permanence and sensory richness.', gu: 'Taurus here gives a stable, prosperous image — the world perceives this area of your life as grounded, reliable, and materially well-rooted. You project an air of permanence and sensory richness.' },
  3:  { en: 'Gemini here gives a versatile, communicative image — this area appears witty, curious, and multi-faceted to the world. Others see adaptability and intellectual energy — sometimes flickering between too many directions.', hi: 'मिथुन यहाँ बहुमुखी, संवादी छवि देता है — यह क्षेत्र बुद्धिमान, जिज्ञासु और बहुआयामी दिखता है। दूसरे अनुकूलनशीलता देखते हैं, कभी-कभी अनेक दिशाओं में बिखरी।', sa: 'मिथुन यहाँ बहुमुखी, संवादी छवि देता है — यह क्षेत्र बुद्धिमान, जिज्ञासु और बहुआयामी दिखता है। दूसरे अनुकूलनशीलता देखते हैं, कभी-कभी अनेक दिशाओं में बिखरी।', mai: 'मिथुन यहाँ बहुमुखी, संवादी छवि देता है — यह क्षेत्र बुद्धिमान, जिज्ञासु और बहुआयामी दिखता है। दूसरे अनुकूलनशीलता देखते हैं, कभी-कभी अनेक दिशाओं में बिखरी।', mr: 'मिथुन यहाँ बहुमुखी, संवादी छवि देता है — यह क्षेत्र बुद्धिमान, जिज्ञासु और बहुआयामी दिखता है। दूसरे अनुकूलनशीलता देखते हैं, कभी-कभी अनेक दिशाओं में बिखरी।', ta: 'Gemini here gives a versatile, communicative image — this area appears witty, curious, and multi-faceted to the world. Others see adaptability and intellectual energy — sometimes flickering between too many directions.', te: 'Gemini here gives a versatile, communicative image — this area appears witty, curious, and multi-faceted to the world. Others see adaptability and intellectual energy — sometimes flickering between too many directions.', bn: 'Gemini here gives a versatile, communicative image — this area appears witty, curious, and multi-faceted to the world. Others see adaptability and intellectual energy — sometimes flickering between too many directions.', kn: 'Gemini here gives a versatile, communicative image — this area appears witty, curious, and multi-faceted to the world. Others see adaptability and intellectual energy — sometimes flickering between too many directions.', gu: 'Gemini here gives a versatile, communicative image — this area appears witty, curious, and multi-faceted to the world. Others see adaptability and intellectual energy — sometimes flickering between too many directions.' },
  4:  { en: 'Cancer here gives a nurturing, familial image — the world sees this area as emotionally rooted, home-centred, and deeply caring. There is a private, protective quality to the perception — like a house with strong walls.', hi: 'कर्क यहाँ पोषणकारी, पारिवारिक छवि देता है — विश्व इस क्षेत्र को भावनात्मक, गृह-केन्द्रित और गहरे देखभाल करने वाला मानता है। संरक्षक, निजी गुण की अनुभूति होती है।', sa: 'कर्क यहाँ पोषणकारी, पारिवारिक छवि देता है — विश्व इस क्षेत्र को भावनात्मक, गृह-केन्द्रित और गहरे देखभाल करने वाला मानता है। संरक्षक, निजी गुण की अनुभूति होती है।', mai: 'कर्क यहाँ पोषणकारी, पारिवारिक छवि देता है — विश्व इस क्षेत्र को भावनात्मक, गृह-केन्द्रित और गहरे देखभाल करने वाला मानता है। संरक्षक, निजी गुण की अनुभूति होती है।', mr: 'कर्क यहाँ पोषणकारी, पारिवारिक छवि देता है — विश्व इस क्षेत्र को भावनात्मक, गृह-केन्द्रित और गहरे देखभाल करने वाला मानता है। संरक्षक, निजी गुण की अनुभूति होती है।', ta: 'Cancer here gives a nurturing, familial image — the world sees this area as emotionally rooted, home-centred, and deeply caring. There is a private, protective quality to the perception — like a house with strong walls.', te: 'Cancer here gives a nurturing, familial image — the world sees this area as emotionally rooted, home-centred, and deeply caring. There is a private, protective quality to the perception — like a house with strong walls.', bn: 'Cancer here gives a nurturing, familial image — the world sees this area as emotionally rooted, home-centred, and deeply caring. There is a private, protective quality to the perception — like a house with strong walls.', kn: 'Cancer here gives a nurturing, familial image — the world sees this area as emotionally rooted, home-centred, and deeply caring. There is a private, protective quality to the perception — like a house with strong walls.', gu: 'Cancer here gives a nurturing, familial image — the world sees this area as emotionally rooted, home-centred, and deeply caring. There is a private, protective quality to the perception — like a house with strong walls.' },
  5:  { en: 'Leo here gives a radiant, authoritative image — this area projects confidence, creativity, and leadership. The world expects something grand and authentic from you here. The spotlight follows naturally — use it wisely.', hi: 'सिंह यहाँ तेजस्वी, अधिकारपूर्ण छवि देता है — यह क्षेत्र आत्मविश्वास, रचनात्मकता और नेतृत्व प्रक्षेपित करता है। विश्व यहाँ कुछ भव्य और प्रामाणिक की अपेक्षा रखता है।', sa: 'सिंह यहाँ तेजस्वी, अधिकारपूर्ण छवि देता है — यह क्षेत्र आत्मविश्वास, रचनात्मकता और नेतृत्व प्रक्षेपित करता है। विश्व यहाँ कुछ भव्य और प्रामाणिक की अपेक्षा रखता है।', mai: 'सिंह यहाँ तेजस्वी, अधिकारपूर्ण छवि देता है — यह क्षेत्र आत्मविश्वास, रचनात्मकता और नेतृत्व प्रक्षेपित करता है। विश्व यहाँ कुछ भव्य और प्रामाणिक की अपेक्षा रखता है।', mr: 'सिंह यहाँ तेजस्वी, अधिकारपूर्ण छवि देता है — यह क्षेत्र आत्मविश्वास, रचनात्मकता और नेतृत्व प्रक्षेपित करता है। विश्व यहाँ कुछ भव्य और प्रामाणिक की अपेक्षा रखता है।', ta: 'Leo here gives a radiant, authoritative image — this area projects confidence, creativity, and leadership. The world expects something grand and authentic from you here. The spotlight follows naturally — use it wisely.', te: 'Leo here gives a radiant, authoritative image — this area projects confidence, creativity, and leadership. The world expects something grand and authentic from you here. The spotlight follows naturally — use it wisely.', bn: 'Leo here gives a radiant, authoritative image — this area projects confidence, creativity, and leadership. The world expects something grand and authentic from you here. The spotlight follows naturally — use it wisely.', kn: 'Leo here gives a radiant, authoritative image — this area projects confidence, creativity, and leadership. The world expects something grand and authentic from you here. The spotlight follows naturally — use it wisely.', gu: 'Leo here gives a radiant, authoritative image — this area projects confidence, creativity, and leadership. The world expects something grand and authentic from you here. The spotlight follows naturally — use it wisely.' },
  6:  { en: 'Virgo here gives a precise, service-oriented image — the world perceives this area as analytical, detail-driven, and practically useful. You project competence and care — but may be seen as critical or overly particular.', hi: 'कन्या यहाँ सटीक, सेवा-उन्मुख छवि देता है — विश्व इस क्षेत्र को विश्लेषणात्मक और व्यावहारिक मानता है। आप सक्षमता प्रक्षेपित करते हैं, पर कभी-कभी अत्यधिक आलोचनात्मक लग सकते हैं।', sa: 'कन्या यहाँ सटीक, सेवा-उन्मुख छवि देता है — विश्व इस क्षेत्र को विश्लेषणात्मक और व्यावहारिक मानता है। आप सक्षमता प्रक्षेपित करते हैं, पर कभी-कभी अत्यधिक आलोचनात्मक लग सकते हैं।', mai: 'कन्या यहाँ सटीक, सेवा-उन्मुख छवि देता है — विश्व इस क्षेत्र को विश्लेषणात्मक और व्यावहारिक मानता है। आप सक्षमता प्रक्षेपित करते हैं, पर कभी-कभी अत्यधिक आलोचनात्मक लग सकते हैं।', mr: 'कन्या यहाँ सटीक, सेवा-उन्मुख छवि देता है — विश्व इस क्षेत्र को विश्लेषणात्मक और व्यावहारिक मानता है। आप सक्षमता प्रक्षेपित करते हैं, पर कभी-कभी अत्यधिक आलोचनात्मक लग सकते हैं।', ta: 'Virgo here gives a precise, service-oriented image — the world perceives this area as analytical, detail-driven, and practically useful. You project competence and care — but may be seen as critical or overly particular.', te: 'Virgo here gives a precise, service-oriented image — the world perceives this area as analytical, detail-driven, and practically useful. You project competence and care — but may be seen as critical or overly particular.', bn: 'Virgo here gives a precise, service-oriented image — the world perceives this area as analytical, detail-driven, and practically useful. You project competence and care — but may be seen as critical or overly particular.', kn: 'Virgo here gives a precise, service-oriented image — the world perceives this area as analytical, detail-driven, and practically useful. You project competence and care — but may be seen as critical or overly particular.', gu: 'Virgo here gives a precise, service-oriented image — the world perceives this area as analytical, detail-driven, and practically useful. You project competence and care — but may be seen as critical or overly particular.' },
  7:  { en: 'Libra here gives a charming, diplomatic image — the world sees this area as graceful, relationship-oriented, and aesthetically refined. Others are drawn in; there is a magnetic fairness to the perception.', hi: 'तुला यहाँ आकर्षक, कूटनीतिक छवि देता है — विश्व इस क्षेत्र को सुरुचिपूर्ण, सम्बन्ध-उन्मुख और सौन्दर्यपूर्ण मानता है। एक चुम्बकीय निष्पक्षता की अनुभूति होती है।', sa: 'तुला यहाँ आकर्षक, कूटनीतिक छवि देता है — विश्व इस क्षेत्र को सुरुचिपूर्ण, सम्बन्ध-उन्मुख और सौन्दर्यपूर्ण मानता है। एक चुम्बकीय निष्पक्षता की अनुभूति होती है।', mai: 'तुला यहाँ आकर्षक, कूटनीतिक छवि देता है — विश्व इस क्षेत्र को सुरुचिपूर्ण, सम्बन्ध-उन्मुख और सौन्दर्यपूर्ण मानता है। एक चुम्बकीय निष्पक्षता की अनुभूति होती है।', mr: 'तुला यहाँ आकर्षक, कूटनीतिक छवि देता है — विश्व इस क्षेत्र को सुरुचिपूर्ण, सम्बन्ध-उन्मुख और सौन्दर्यपूर्ण मानता है। एक चुम्बकीय निष्पक्षता की अनुभूति होती है।', ta: 'Libra here gives a charming, diplomatic image — the world sees this area as graceful, relationship-oriented, and aesthetically refined. Others are drawn in; there is a magnetic fairness to the perception.', te: 'Libra here gives a charming, diplomatic image — the world sees this area as graceful, relationship-oriented, and aesthetically refined. Others are drawn in; there is a magnetic fairness to the perception.', bn: 'Libra here gives a charming, diplomatic image — the world sees this area as graceful, relationship-oriented, and aesthetically refined. Others are drawn in; there is a magnetic fairness to the perception.', kn: 'Libra here gives a charming, diplomatic image — the world sees this area as graceful, relationship-oriented, and aesthetically refined. Others are drawn in; there is a magnetic fairness to the perception.', gu: 'Libra here gives a charming, diplomatic image — the world sees this area as graceful, relationship-oriented, and aesthetically refined. Others are drawn in; there is a magnetic fairness to the perception.' },
  8:  { en: 'Scorpio here gives an intense, mysterious image — the world perceives this area as deep, transformative, and not fully knowable. Others sense hidden power or hidden struggle here. The perception carries weight and intrigue.', hi: 'वृश्चिक यहाँ तीव्र, रहस्यमय छवि देता है — विश्व इस क्षेत्र को गहरा, रूपान्तरकारी और पूरी तरह अज्ञेय मानता है। छिपी शक्ति या संघर्ष की अनुभूति होती है।', sa: 'वृश्चिक यहाँ तीव्र, रहस्यमय छवि देता है — विश्व इस क्षेत्र को गहरा, रूपान्तरकारी और पूरी तरह अज्ञेय मानता है। छिपी शक्ति या संघर्ष की अनुभूति होती है।', mai: 'वृश्चिक यहाँ तीव्र, रहस्यमय छवि देता है — विश्व इस क्षेत्र को गहरा, रूपान्तरकारी और पूरी तरह अज्ञेय मानता है। छिपी शक्ति या संघर्ष की अनुभूति होती है।', mr: 'वृश्चिक यहाँ तीव्र, रहस्यमय छवि देता है — विश्व इस क्षेत्र को गहरा, रूपान्तरकारी और पूरी तरह अज्ञेय मानता है। छिपी शक्ति या संघर्ष की अनुभूति होती है।', ta: 'Scorpio here gives an intense, mysterious image — the world perceives this area as deep, transformative, and not fully knowable. Others sense hidden power or hidden struggle here. The perception carries weight and intrigue.', te: 'Scorpio here gives an intense, mysterious image — the world perceives this area as deep, transformative, and not fully knowable. Others sense hidden power or hidden struggle here. The perception carries weight and intrigue.', bn: 'Scorpio here gives an intense, mysterious image — the world perceives this area as deep, transformative, and not fully knowable. Others sense hidden power or hidden struggle here. The perception carries weight and intrigue.', kn: 'Scorpio here gives an intense, mysterious image — the world perceives this area as deep, transformative, and not fully knowable. Others sense hidden power or hidden struggle here. The perception carries weight and intrigue.', gu: 'Scorpio here gives an intense, mysterious image — the world perceives this area as deep, transformative, and not fully knowable. Others sense hidden power or hidden struggle here. The perception carries weight and intrigue.' },
  9:  { en: 'Sagittarius here gives an expansive, philosophical image — the world sees this area as optimistic, principled, and wisdom-seeking. You project a teacher or traveller quality — someone whose horizons are always expanding.', hi: 'धनु यहाँ विस्तृत, दार्शनिक छवि देता है — विश्व इस क्षेत्र को आशावादी, सिद्धान्तनिष्ठ और ज्ञान-खोजी मानता है। एक शिक्षक या यात्री का भाव प्रक्षेपित होता है।', sa: 'धनु यहाँ विस्तृत, दार्शनिक छवि देता है — विश्व इस क्षेत्र को आशावादी, सिद्धान्तनिष्ठ और ज्ञान-खोजी मानता है। एक शिक्षक या यात्री का भाव प्रक्षेपित होता है।', mai: 'धनु यहाँ विस्तृत, दार्शनिक छवि देता है — विश्व इस क्षेत्र को आशावादी, सिद्धान्तनिष्ठ और ज्ञान-खोजी मानता है। एक शिक्षक या यात्री का भाव प्रक्षेपित होता है।', mr: 'धनु यहाँ विस्तृत, दार्शनिक छवि देता है — विश्व इस क्षेत्र को आशावादी, सिद्धान्तनिष्ठ और ज्ञान-खोजी मानता है। एक शिक्षक या यात्री का भाव प्रक्षेपित होता है।', ta: 'Sagittarius here gives an expansive, philosophical image — the world sees this area as optimistic, principled, and wisdom-seeking. You project a teacher or traveller quality — someone whose horizons are always expanding.', te: 'Sagittarius here gives an expansive, philosophical image — the world sees this area as optimistic, principled, and wisdom-seeking. You project a teacher or traveller quality — someone whose horizons are always expanding.', bn: 'Sagittarius here gives an expansive, philosophical image — the world sees this area as optimistic, principled, and wisdom-seeking. You project a teacher or traveller quality — someone whose horizons are always expanding.', kn: 'Sagittarius here gives an expansive, philosophical image — the world sees this area as optimistic, principled, and wisdom-seeking. You project a teacher or traveller quality — someone whose horizons are always expanding.', gu: 'Sagittarius here gives an expansive, philosophical image — the world sees this area as optimistic, principled, and wisdom-seeking. You project a teacher or traveller quality — someone whose horizons are always expanding.' },
  10: { en: 'Capricorn here gives a disciplined, ambitious image — the world perceives this area as structured, achievement-driven, and enduring. You project authority through results, not words. Long-term credibility is your hallmark.', hi: 'मकर यहाँ अनुशासित, महत्वाकांक्षी छवि देता है — विश्व इस क्षेत्र को संरचित और परिणाम-उन्मुख मानता है। आप परिणामों से अधिकार प्रक्षेपित करते हैं, शब्दों से नहीं।', sa: 'मकर यहाँ अनुशासित, महत्वाकांक्षी छवि देता है — विश्व इस क्षेत्र को संरचित और परिणाम-उन्मुख मानता है। आप परिणामों से अधिकार प्रक्षेपित करते हैं, शब्दों से नहीं।', mai: 'मकर यहाँ अनुशासित, महत्वाकांक्षी छवि देता है — विश्व इस क्षेत्र को संरचित और परिणाम-उन्मुख मानता है। आप परिणामों से अधिकार प्रक्षेपित करते हैं, शब्दों से नहीं।', mr: 'मकर यहाँ अनुशासित, महत्वाकांक्षी छवि देता है — विश्व इस क्षेत्र को संरचित और परिणाम-उन्मुख मानता है। आप परिणामों से अधिकार प्रक्षेपित करते हैं, शब्दों से नहीं।', ta: 'Capricorn here gives a disciplined, ambitious image — the world perceives this area as structured, achievement-driven, and enduring. You project authority through results, not words. Long-term credibility is your hallmark.', te: 'Capricorn here gives a disciplined, ambitious image — the world perceives this area as structured, achievement-driven, and enduring. You project authority through results, not words. Long-term credibility is your hallmark.', bn: 'Capricorn here gives a disciplined, ambitious image — the world perceives this area as structured, achievement-driven, and enduring. You project authority through results, not words. Long-term credibility is your hallmark.', kn: 'Capricorn here gives a disciplined, ambitious image — the world perceives this area as structured, achievement-driven, and enduring. You project authority through results, not words. Long-term credibility is your hallmark.', gu: 'Capricorn here gives a disciplined, ambitious image — the world perceives this area as structured, achievement-driven, and enduring. You project authority through results, not words. Long-term credibility is your hallmark.' },
  11: { en: 'Aquarius here gives a progressive, collective image — the world sees this area as unconventional, socially conscious, and future-oriented. You project idealism and independent thinking — sometimes ahead of your time.', hi: 'कुम्भ यहाँ प्रगतिशील, सामूहिक छवि देता है — विश्व इस क्षेत्र को अपरम्परागत और सामाजिक रूप से जागरूक मानता है। आदर्शवाद और स्वतन्त्र विचार प्रक्षेपित होते हैं।', sa: 'कुम्भ यहाँ प्रगतिशील, सामूहिक छवि देता है — विश्व इस क्षेत्र को अपरम्परागत और सामाजिक रूप से जागरूक मानता है। आदर्शवाद और स्वतन्त्र विचार प्रक्षेपित होते हैं।', mai: 'कुम्भ यहाँ प्रगतिशील, सामूहिक छवि देता है — विश्व इस क्षेत्र को अपरम्परागत और सामाजिक रूप से जागरूक मानता है। आदर्शवाद और स्वतन्त्र विचार प्रक्षेपित होते हैं।', mr: 'कुम्भ यहाँ प्रगतिशील, सामूहिक छवि देता है — विश्व इस क्षेत्र को अपरम्परागत और सामाजिक रूप से जागरूक मानता है। आदर्शवाद और स्वतन्त्र विचार प्रक्षेपित होते हैं।', ta: 'Aquarius here gives a progressive, collective image — the world sees this area as unconventional, socially conscious, and future-oriented. You project idealism and independent thinking — sometimes ahead of your time.', te: 'Aquarius here gives a progressive, collective image — the world sees this area as unconventional, socially conscious, and future-oriented. You project idealism and independent thinking — sometimes ahead of your time.', bn: 'Aquarius here gives a progressive, collective image — the world sees this area as unconventional, socially conscious, and future-oriented. You project idealism and independent thinking — sometimes ahead of your time.', kn: 'Aquarius here gives a progressive, collective image — the world sees this area as unconventional, socially conscious, and future-oriented. You project idealism and independent thinking — sometimes ahead of your time.', gu: 'Aquarius here gives a progressive, collective image — the world sees this area as unconventional, socially conscious, and future-oriented. You project idealism and independent thinking — sometimes ahead of your time.' },
  12: { en: 'Pisces here gives a spiritual, elusive image — the world perceives this area as mysterious, compassionate, and otherworldly. There is a sense of sacrifice or transcendence around it. Perception may be idealised or difficult to pin down.', hi: 'मीन यहाँ आध्यात्मिक, अस्पष्ट छवि देता है — विश्व इस क्षेत्र को रहस्यमय, करुणामय और अलौकिक मानता है। त्याग या अतिक्रमण का भाव होता है।', sa: 'मीन यहाँ आध्यात्मिक, अस्पष्ट छवि देता है — विश्व इस क्षेत्र को रहस्यमय, करुणामय और अलौकिक मानता है। त्याग या अतिक्रमण का भाव होता है।', mai: 'मीन यहाँ आध्यात्मिक, अस्पष्ट छवि देता है — विश्व इस क्षेत्र को रहस्यमय, करुणामय और अलौकिक मानता है। त्याग या अतिक्रमण का भाव होता है।', mr: 'मीन यहाँ आध्यात्मिक, अस्पष्ट छवि देता है — विश्व इस क्षेत्र को रहस्यमय, करुणामय और अलौकिक मानता है। त्याग या अतिक्रमण का भाव होता है।', ta: 'Pisces here gives a spiritual, elusive image — the world perceives this area as mysterious, compassionate, and otherworldly. There is a sense of sacrifice or transcendence around it. Perception may be idealised or difficult to pin down.', te: 'Pisces here gives a spiritual, elusive image — the world perceives this area as mysterious, compassionate, and otherworldly. There is a sense of sacrifice or transcendence around it. Perception may be idealised or difficult to pin down.', bn: 'Pisces here gives a spiritual, elusive image — the world perceives this area as mysterious, compassionate, and otherworldly. There is a sense of sacrifice or transcendence around it. Perception may be idealised or difficult to pin down.', kn: 'Pisces here gives a spiritual, elusive image — the world perceives this area as mysterious, compassionate, and otherworldly. There is a sense of sacrifice or transcendence around it. Perception may be idealised or difficult to pin down.', gu: 'Pisces here gives a spiritual, elusive image — the world perceives this area as mysterious, compassionate, and otherworldly. There is a sense of sacrifice or transcendence around it. Perception may be idealised or difficult to pin down.' },
};

interface SwamshaCombo { ids: number[]; en: string; hi: string; tag?: 'career' | 'spiritual' | 'health' | 'wealth' | 'relationship' }

const SWAMSHA_COMBOS: SwamshaCombo[] = [
  // --- Single planets ---
  { ids: [0],    en: 'Sun in Swamsha — Government, authority, politics, fame, royal connections. Natural leader with a strong dharmic drive.', hi: 'सूर्य स्वांश में — शासन, सत्ता, राजनीति, यश। स्वाभाविक नेता।', tag: 'career' },
  { ids: [1],    en: 'Moon in Swamsha — Healing, psychology, nursing, catering, import-export, public life. Emotional intelligence is the soul\'s gift.', hi: 'चन्द्र स्वांश में — उपचार, मनोविज्ञान, जनसेवा, भोजन व्यापार। भावनात्मक बुद्धि।', tag: 'career' },
  { ids: [2],    en: 'Mars in Swamsha — Military, engineering, surgery, fire, land dealings, martial arts. Courage and decisive action define the soul.', hi: 'मंगल स्वांश में — सेना, इंजीनियरिंग, शल्य चिकित्सा, भूमि। साहस और निर्णायकता।', tag: 'career' },
  { ids: [3],    en: 'Mercury in Swamsha — Writing, trade, communication, mathematics, accounting, publishing. The soul speaks and thinks in words and numbers.', hi: 'बुध स्वांश में — लेखन, व्यापार, संवाद, गणित। आत्मा शब्दों और अंकों में सोचती है।', tag: 'career' },
  { ids: [4],    en: 'Jupiter in Swamsha — Teaching, law, religion, philosophy, medicine, finance. Wisdom and counsel are the soul\'s calling.', hi: 'बृहस्पति स्वांश में — शिक्षण, कानून, धर्म, दर्शन, चिकित्सा। ज्ञान और परामर्श।', tag: 'career' },
  { ids: [5],    en: 'Venus in Swamsha — Arts, music, luxury goods, beauty, hospitality, film, romance. Aesthetic refinement and pleasure define the soul.', hi: 'शुक्र स्वांश में — कला, संगीत, विलासिता, सौन्दर्य, आतिथ्य। सौन्दर्यबोध।', tag: 'career' },
  { ids: [6],    en: 'Saturn in Swamsha — Labour, agriculture, oil, iron, real estate, service industries. Patience and perseverance are karmic tools.', hi: 'शनि स्वांश में — श्रम, कृषि, तेल, लोहा, सेवा उद्योग। धैर्य और अध्यवसाय।', tag: 'career' },
  { ids: [7],    en: 'Rahu in Swamsha — Foreign connections, unconventional paths, technology, research, mass influence. Soul is pulled toward the unknown.', hi: 'राहु स्वांश में — विदेश, अपरम्परागत मार्ग, प्रौद्योगिकी, शोध। अज्ञात की ओर खिंचाव।', tag: 'career' },
  { ids: [8],    en: 'Ketu in Swamsha — Moksha orientation, occult, past-life gifts, detachment, spiritual research. Soul seeks liberation over worldly achievement.', hi: 'केतु स्वांश में — मोक्ष उन्मुखता, गुप्त विद्या, वैराग्य, अध्यात्म। भौतिक से अधिक आत्मिक।', tag: 'spiritual' },
  // --- Two-planet combinations ---
  { ids: [0, 1],  en: 'Sun + Moon in Swamsha — Integration of authority and emotion; public-facing leaders with deep intuition. Likely to excel in politics, public service, or healing with a regal touch.', hi: 'सूर्य + चन्द्र स्वांश में — सत्ता और भावना का एकीकरण; गहरे अन्तर्ज्ञान वाले सार्वजनिक नेता। राजनीति, सार्वजनिक सेवा।', tag: 'career' },
  { ids: [0, 2],  en: 'Sun + Mars in Swamsha — Military commander, police, fire service, competitive sports. The soul is a warrior and protector.', hi: 'सूर्य + मंगल स्वांश में — सैन्य कमांडर, पुलिस, अग्निशमन, खेल। आत्मा एक योद्धा है।', tag: 'career' },
  { ids: [0, 3],  en: 'Sun + Mercury in Swamsha — Leadership through communication; statesman, royal spokesperson, diplomat, media authority, or administrator with oratory gifts.', hi: 'सूर्य + बुध स्वांश में — संचार द्वारा नेतृत्व; राजनयिक, मीडिया प्राधिकरण, वक्ता-प्रशासक।', tag: 'career' },
  { ids: [0, 4],  en: 'Sun + Jupiter in Swamsha — Royal sage, judge, high government official, spiritual authority. Dharma and power united.', hi: 'सूर्य + बृहस्पति स्वांश में — राजसी ऋषि, न्यायाधीश, उच्च पदाधिकारी। धर्म और शक्ति एकीकृत।', tag: 'career' },
  { ids: [0, 5],  en: 'Sun + Venus in Swamsha — Royal aesthete; authority expressed through art, film, culture. Leaders in fashion, hospitality luxury, or creative industries at high levels.', hi: 'सूर्य + शुक्र स्वांश में — राजसी सौंदर्यशास्त्री; कला, फिल्म, संस्कृति में अधिकार। फैशन, आतिथ्य नेतृत्व।', tag: 'career' },
  { ids: [0, 6],  en: 'Sun + Saturn in Swamsha — Iron authority built through sustained effort; ambition tempered by karma. Success comes late but lasts; government service with discipline.', hi: 'सूर्य + शनि स्वांश में — निरंतर प्रयास से निर्मित लौह-अधिकार; कर्म से तंपित महत्वाकांक्षा। देर से किन्तु स्थायी सफलता।', tag: 'career' },
  { ids: [0, 7],  en: 'Sun + Rahu in Swamsha — Unconventional authority; magnetic, politically ambitious, foreign connections to power. Fame can be sudden and dramatic.', hi: 'सूर्य + राहु स्वांश में — अपरम्परागत अधिकार; चुंबकीय, राजनीतिक महत्वाकांक्षा, सत्ता से विदेशी संबंध।', tag: 'career' },
  { ids: [0, 8],  en: 'Sun + Ketu in Swamsha — Detached authority; past-life royalty, spiritual leadership, renunciant with natural dignity. Temple governance or religious institution head.', hi: 'सूर्य + केतु स्वांश में — वैरागी अधिकार; पूर्वजन्म की रॉयल्टी, आध्यात्मिक नेतृत्व। मंदिर प्रशासन।', tag: 'spiritual' },
  { ids: [1, 2],  en: 'Moon + Mars in Swamsha — Emotional courage; passionate protectors, nurses in crisis, emergency responders, activists. Drive and caring combine powerfully.', hi: 'चन्द्र + मंगल स्वांश में — भावनात्मक साहस; संकट में देखभाल, आपातकालीन सेवा, कार्यकर्ता।', tag: 'career' },
  { ids: [1, 4],  en: 'Moon + Jupiter in Swamsha — Wisdom with nurturing compassion; counsellors, spiritual teachers, child psychologists. Deep devotional nature and teaching gifts.', hi: 'चन्द्र + बृहस्पति स्वांश में — पोषण करुणा के साथ ज्ञान; परामर्शदाता, आध्यात्मिक शिक्षक, बाल मनोवैज्ञानिक।', tag: 'career' },
  { ids: [1, 5],  en: 'Moon + Venus in Swamsha — Artistic sensitivity, fashion, hospitality, beauty industry, music. The soul lives through sensory pleasure and elegance.', hi: 'चन्द्र + शुक्र स्वांश में — कलात्मक संवेदनशीलता, फैशन, आतिथ्य, सौन्दर्य उद्योग।', tag: 'career' },
  { ids: [1, 6],  en: 'Moon + Saturn in Swamsha — Emotional discipline; karmic responsibilities in family or community. Service with restraint, maternal authority, administration with empathy.', hi: 'चन्द्र + शनि स्वांश में — भावनात्मक अनुशासन; परिवार में कार्मिक जिम्मेदारियां। संयम के साथ सेवा।', tag: 'career' },
  { ids: [1, 7],  en: 'Moon + Rahu in Swamsha — Psychic sensitivity, unusual emotional life, drawn to foreign cultures or unconventional lifestyles. Powerful imagination and mass influence.', hi: 'चन्द्र + राहु स्वांश में — मानसिक संवेदनशीलता, असामान्य भावनात्मक जीवन, विदेशी संस्कृति की ओर आकर्षण।', tag: 'spiritual' },
  { ids: [1, 8],  en: 'Moon + Ketu in Swamsha — Psychic ability, healing past wounds, spiritual nursing, renunciation. Intuition is unusually deep.', hi: 'चन्द्र + केतु स्वांश में — अतींद्रिय क्षमता, आध्यात्मिक उपचार, वैराग्य। अन्तर्ज्ञान असाधारण रूप से गहरा।', tag: 'spiritual' },
  { ids: [2, 3],  en: 'Mars + Mercury in Swamsha — Technical genius; engineering writing, software, debate champion, surgical precision combined with analytical intelligence.', hi: 'मंगल + बुध स्वांश में — तकनीकी प्रतिभा; इंजीनियरिंग लेखन, सॉफ्टवेयर, शल्य-विश्लेषणात्मक बुद्धि।', tag: 'career' },
  { ids: [2, 4],  en: 'Mars + Jupiter in Swamsha — Righteous warrior, dharma defender; military with ethics, sports with sportsmanship. Command that serves a noble cause.', hi: 'मंगल + बृहस्पति स्वांश में — धर्मी योद्धा; नैतिकता सहित सैन्य, खेल कौशल। महान उद्देश्य की सेवा।', tag: 'career' },
  { ids: [2, 6],  en: 'Mars + Saturn in Swamsha — Iron discipline and relentless endurance; Jaimini indicates mechanical/engineering mastery, construction, or mining. Builds the indestructible.', hi: 'मंगल + शनि स्वांश में — लौह-अनुशासन; यांत्रिक/इंजीनियरिंग निपुणता, निर्माण, खनन। अविनाशी निर्माण।', tag: 'career' },
  { ids: [2, 7],  en: 'Mars + Rahu in Swamsha — Surgeon, weapons technician, military engineer, aggressive profession involving cutting or fire. Fearless in high-stakes environments.', hi: 'मंगल + राहु स्वांश में — शल्य चिकित्सक, शस्त्र तकनीशियन, सैन्य इंजीनियर। कर्तन या अग्नि से जुड़ा कार्य।', tag: 'career' },
  { ids: [2, 8],  en: 'Mars + Ketu in Swamsha — Occult researcher, forensic analyst, military strategist with hidden knowledge, past-life warrior.', hi: 'मंगल + केतु स्वांश में — गुप्त शोधकर्ता, फोरेंसिक विश्लेषक, रणनीतिकार।', tag: 'spiritual' },
  { ids: [3, 4],  en: 'Mercury + Jupiter in Swamsha — Scholarly wisdom; gifted teacher, author of scripture or law, financial advisor, academic of highest distinction. Combines intellect with wisdom.', hi: 'बुध + बृहस्पति स्वांश में — पांडित्यपूर्ण ज्ञान; प्रतिभाशाली शिक्षक, शास्त्रकार, वित्तीय सलाहकार।', tag: 'career' },
  { ids: [3, 5],  en: 'Mercury + Venus in Swamsha — Eloquent writer, poet, orator, performer. The soul communicates beauty. Literary or performing arts distinction.', hi: 'बुध + शुक्र स्वांश में — वाग्मी लेखक, कवि, वक्ता, कलाकार। साहित्य या प्रदर्शन कला।', tag: 'career' },
  { ids: [3, 6],  en: 'Mercury + Saturn in Swamsha — Methodical intellect; auditor, actuary, legal drafter, precise analyst. Slow but deeply thorough — the soul builds knowledge brick by brick.', hi: 'बुध + शनि स्वांश में — क्रमबद्ध बुद्धि; लेखा परीक्षक, कानूनी मसौदाकार, सटीक विश्लेषक।', tag: 'career' },
  { ids: [4, 5],  en: 'Jupiter + Venus in Swamsha — Aesthetic philosopher; spiritual beauty, sacred arts, luxury with wisdom. Teacher of art or beauty, or philosopher of love and aesthetics.', hi: 'बृहस्पति + शुक्र स्वांश में — सौंदर्यात्मक दार्शनिक; आध्यात्मिक सौंदर्य, पवित्र कला। प्रेम और सौंदर्य का दार्शनिक।', tag: 'career' },
  { ids: [4, 6],  en: 'Jupiter + Saturn in Swamsha — Disciplined philosopher; structural wisdom, institutional religion, administrative guru. Builds lasting spiritual or educational institutions.', hi: 'बृहस्पति + शनि स्वांश में — अनुशासित दार्शनिक; संरचनात्मक ज्ञान, संस्थागत धर्म। स्थायी संस्थाएं।', tag: 'career' },
  { ids: [4, 7],  en: 'Jupiter + Rahu in Swamsha — Foreign teacher, international law, religious innovation, unconventional philosophy. Guru to the masses across cultural boundaries.', hi: 'बृहस्पति + राहु स्वांश में — विदेशी शिक्षक, अन्तर्राष्ट्रीय कानून, धार्मिक नवाचार।', tag: 'career' },
  { ids: [4, 8],  en: 'Jupiter + Ketu in Swamsha — Mystical teacher, astrologer, past-life wisdom bearer, moksha-oriented philosophy. Rare spiritual authority — the guru of gurus.', hi: 'बृहस्पति + केतु स्वांश में — रहस्यवादी शिक्षक, ज्योतिषी, पूर्वजन्म ज्ञानी। दुर्लभ आध्यात्मिक अधिकार।', tag: 'spiritual' },
  { ids: [5, 6],  en: 'Venus + Saturn in Swamsha — Luxury with discipline; high-end craftsmanship, jewellery, architecture, refined taste with structure. Success in luxury goods or heritage arts.', hi: 'शुक्र + शनि स्वांश में — अनुशासन सहित विलासिता; उच्च शिल्पकारी, आभूषण, वास्तुकला।', tag: 'wealth' },
  { ids: [5, 7],  en: 'Venus + Rahu in Swamsha — Glamour with an edge; film, media, unconventional relationships, foreign arts. The soul magnetises through charisma and breaks norms in beauty.', hi: 'शुक्र + राहु स्वांश में — तीखी चमक; फिल्म, मीडिया, अपरम्परागत संबंध, विदेशी कला।', tag: 'career' },
  { ids: [5, 8],  en: 'Venus + Ketu in Swamsha — Renunciation of pleasure for spirit; sacred artist, monastic with aesthetic sensibility, or one who finds beauty in the divine formless.', hi: 'शुक्र + केतु स्वांश में — आत्मा के लिए सुख का त्याग; पवित्र कलाकार, सौंदर्यबोध वाला वैरागी।', tag: 'spiritual' },
  { ids: [6, 7],  en: 'Saturn + Rahu in Swamsha — Oil & gas, iron & steel, mining, mass labour, unconventional service. Karmic work in industrial or foreign settings.', hi: 'शनि + राहु स्वांश में — तेल और गैस, लौह और इस्पात, खनन, औद्योगिक कार्य।', tag: 'career' },
  { ids: [6, 8],  en: 'Saturn + Ketu in Swamsha — Austere renunciant, hermit, ascetic scholar; deep karmic purification. Past-life patterns of service and sacrifice — spiritual liberation through hardship.', hi: 'शनि + केतु स्वांश में — कठोर वैरागी, तपस्वी विद्वान; गहरी कार्मिक शुद्धि। कठिनाई से मुक्ति।', tag: 'spiritual' },
  // --- Three-planet combinations ---
  { ids: [0, 1, 4], en: 'Sun + Moon + Jupiter in Swamsha — King with dharma and emotional wisdom; great statesman, spiritual monarch, or head of a sacred lineage. Rare triple blessing.', hi: 'सूर्य + चन्द्र + बृहस्पति स्वांश में — धर्म और भावनात्मक ज्ञान वाला राजा; महान राजनेता, आध्यात्मिक राजा।', tag: 'career' },
  { ids: [0, 2, 4], en: 'Sun + Mars + Jupiter in Swamsha — Military-spiritual authority; warrior who fights for dharma. Combines royal command, courage, and wisdom — generals, warrior-saints.', hi: 'सूर्य + मंगल + बृहस्पति स्वांश में — सैन्य-आध्यात्मिक अधिकार; धर्म के लिए लड़ने वाला योद्धा।', tag: 'career' },
  { ids: [0, 4, 8], en: 'Sun + Jupiter + Ketu in Swamsha — Spiritual-royal authority; temple leadership, detached sovereign, or teacher of kings. The rarest of spiritual authority patterns.', hi: 'सूर्य + बृहस्पति + केतु स्वांश में — आध्यात्मिक-राजसी अधिकार; मंदिर नेतृत्व, राजाओं के शिक्षक।', tag: 'spiritual' },
  { ids: [1, 2, 4], en: 'Moon + Mars + Jupiter in Swamsha — Emotional warrior with wisdom; combines courage, nurturing, and ethical judgment. Excellent doctors, counsellors in the military, or dharmic leaders.', hi: 'चन्द्र + मंगल + बृहस्पति स्वांश में — ज्ञान के साथ भावनात्मक योद्धा; साहस, पोषण और नैतिक निर्णय।', tag: 'career' },
  { ids: [1, 4, 8], en: 'Moon + Jupiter + Ketu in Swamsha — Spiritual nurturer; past-life healer, devoted monastic, or psychic teacher. Compassionate wisdom directed toward liberation.', hi: 'चन्द्र + बृहस्पति + केतु स्वांश में — आध्यात्मिक पोषक; पूर्वजन्म उपचारक, भक्त संन्यासी, मानसिक शिक्षक।', tag: 'spiritual' },
  { ids: [1, 5, 4], en: 'Moon + Venus + Jupiter in Swamsha — Artistic devotee; spiritual artist, composer of sacred music, aesthetic philosopher. Beauty in service of the divine.', hi: 'चन्द्र + शुक्र + बृहस्पति स्वांश में — कलात्मक भक्त; आध्यात्मिक कलाकार, पवित्र संगीत रचयिता।', tag: 'spiritual' },
  { ids: [2, 4, 6], en: 'Mars + Jupiter + Saturn in Swamsha — Warrior-philosopher-builder; combines courageous action, wisdom, and patient endurance. Engineers great and lasting achievements.', hi: 'मंगल + बृहस्पति + शनि स्वांश में — योद्धा-दार्शनिक-निर्माता; साहसी कार्य, ज्ञान और धैर्य।', tag: 'career' },
  { ids: [2, 3, 4], en: 'Mars + Mercury + Jupiter in Swamsha — Technical scholar; combines engineering precision with intellectual depth and wisdom. Expert in strategic planning, defence research, or law.', hi: 'मंगल + बुध + बृहस्पति स्वांश में — तकनीकी विद्वान; इंजीनियरिंग सटीकता, बौद्धिक गहराई और ज्ञान।', tag: 'career' },
  { ids: [3, 4, 5], en: 'Mercury + Jupiter + Venus in Swamsha — Learned aesthete; combines eloquence, wisdom, and beauty — poet-philosopher, Sanskrit scholar, or master of sacred aesthetics.', hi: 'बुध + बृहस्पति + शुक्र स्वांश में — विद्वान सौंदर्यशास्त्री; वाग्मिता, ज्ञान और सौंदर्य — कवि-दार्शनिक।', tag: 'career' },
  { ids: [3, 4, 7], en: 'Mercury + Jupiter + Rahu in Swamsha — Foreign educator or researcher; international scholarship, interdisciplinary innovation, teaching across cultural boundaries.', hi: 'बुध + बृहस्पति + राहु स्वांश में — विदेशी शिक्षक/शोधकर्ता; अन्तर्राष्ट्रीय छात्रवृत्ति, सांस्कृतिक सीमाओं को पार।', tag: 'career' },
  { ids: [4, 6, 7], en: 'Jupiter + Saturn + Rahu in Swamsha — Unconventional institution builder; systems thinking that disrupts and rebuilds. Creates new paradigms for education, law, or religion.', hi: 'बृहस्पति + शनि + राहु स्वांश में — अपरम्परागत संस्था-निर्माता; प्रणाली सोच जो बाधित और पुनर्निर्माण करती है।', tag: 'career' },
  { ids: [1, 6, 7], en: 'Moon + Saturn + Rahu in Swamsha — Psychic with karmic burdens; deep karmic work in public healing, social work, or large-scale service — the soul carries collective suffering.', hi: 'चन्द्र + शनि + राहु स्वांश में — कार्मिक बोझ वाला मानसिक; सार्वजनिक उपचार, सामाजिक कार्य में गहरा कार्मिक।', tag: 'spiritual' },
];

const TAG_COLORS: Record<string, string> = {
  career: 'bg-blue-500/15 text-blue-300',
  spiritual: 'bg-purple-500/15 text-purple-300',
  health: 'bg-emerald-500/15 text-emerald-300',
  wealth: 'bg-gold-primary/15 text-gold-light',
  relationship: 'bg-rose-500/15 text-rose-300',
};

const HOUSE_LABELS: Record<number, LocaleText> = {
  1: { en: 'Lagna', hi: 'लग्न', sa: 'लग्न', mai: 'लग्न', mr: 'लग्न', ta: 'லக்னம்', te: 'లగ్నం', bn: 'লগ্ন', kn: 'ಲಗ್ನ', gu: 'લગ્ન' }, 2: { en: 'Dhana', hi: 'धन', sa: 'धन', mai: 'धन', mr: 'धन', ta: 'தனம்', te: 'ధనం', bn: 'ধন', kn: 'ಧನ', gu: 'ધન' }, 3: { en: 'Sahaja', hi: 'सहज', sa: 'सहज', mai: 'सहज', mr: 'सहज', ta: 'சகஜம்', te: 'సహజం', bn: 'সহজ', kn: 'ಸಹಜ', gu: 'સહજ' },
  4: { en: 'Sukha', hi: 'सुख', sa: 'सुख', mai: 'सुख', mr: 'सुख', ta: 'சுகம்', te: 'సుఖం', bn: 'সুখ', kn: 'ಸುಖ', gu: 'સુખ' }, 5: { en: 'Putra', hi: 'पुत्र', sa: 'पुत्र', mai: 'पुत्र', mr: 'पुत्र', ta: 'புத்திரம்', te: 'పుత్రం', bn: 'পুত্র', kn: 'ಪುತ್ರ', gu: 'પુત્ર' }, 6: { en: 'Ari', hi: 'अरि', sa: 'अरि', mai: 'अरि', mr: 'अरि', ta: 'அரி', te: 'అరి', bn: 'অরি', kn: 'ಅರಿ', gu: 'અરિ' },
  7: { en: 'Kalatra', hi: 'कलत्र', sa: 'कलत्र', mai: 'कलत्र', mr: 'कलत्र', ta: 'களத்திரம்', te: 'కళత్రం', bn: 'কলত্র', kn: 'ಕಳತ್ರ', gu: 'કલત્ર' }, 8: { en: 'Randhra', hi: 'रन्ध्र', sa: 'रन्ध्र', mai: 'रन्ध्र', mr: 'रन्ध्र', ta: 'ரந்திரம்', te: 'రంధ్రం', bn: 'রন্ধ্র', kn: 'ರಂಧ್ರ', gu: 'રંધ્ર' }, 9: { en: 'Dharma', hi: 'धर्म', sa: 'धर्म', mai: 'धर्म', mr: 'धर्म', ta: 'தர்மம்', te: 'ధర్మం', bn: 'ধর্ম', kn: 'ಧರ್ಮ', gu: 'ધર્મ' },
  10: { en: 'Karma', hi: 'कर्म', sa: 'कर्म', mai: 'कर्म', mr: 'कर्म', ta: 'கர்மம்', te: 'కర్మం', bn: 'কর্ম', kn: 'ಕರ್ಮ', gu: 'કર્મ' }, 11: { en: 'Labha', hi: 'लाभ', sa: 'लाभ', mai: 'लाभ', mr: 'लाभ', ta: 'லாபம்', te: 'లాభం', bn: 'লাভ', kn: 'ಲಾಭ', gu: 'લાભ' }, 12: { en: 'Vyaya', hi: 'व्यय', sa: 'व्यय', mai: 'व्यय', mr: 'व्यय', ta: 'வியயம்', te: 'వ్యయం', bn: 'ব্যয়', kn: 'ವ್ಯಯ', gu: 'વ્યય' },
};

const SIGN_NAMES_EN = ['Ar','Ta','Ge','Ca','Le','Vi','Li','Sc','Sa','Cp','Aq','Pi'];
const SIGN_NAMES_HI = ['मेष','वृष','मिथुन','कर्क','सिंह','कन्या','तुला','वृश्चिक','धनु','मकर','कुम्भ','मीन'];

const SIGN_NAMES_3: Record<number, string> = { 1:'Aries',2:'Taurus',3:'Gemini',4:'Cancer',5:'Leo',6:'Virgo',7:'Libra',8:'Scorpio',9:'Sagittarius',10:'Capricorn',11:'Aquarius',12:'Pisces' };

// ─── Component ───────────────────────────────────────────────────────────────

interface JaiminiTabProps {
  kundali: KundaliData;
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}

export default function JaiminiTab({ kundali, locale, isDevanagari, headingFont }: JaiminiTabProps) {
  const jaimini = kundali.jaimini!;

  return (
    <div className="space-y-8">
      {/* System intro */}
      <div className="text-center">
        <h3 className="text-gold-gradient text-2xl font-bold mb-3" style={headingFont}>
          {!isDevanagariLocale(locale) ? 'Jaimini Astrology' : 'जैमिनी ज्योतिष'}
        </h3>
      </div>
      <InfoBlock
        id="kundali-jaimini"
        title={!isDevanagariLocale(locale) ? 'What is Jaimini Astrology and how is it different?' : 'जैमिनी ज्योतिष क्या है और यह कैसे भिन्न है?'}
        defaultOpen={false}
      >
        {!isDevanagariLocale(locale) ? (
          <div className="space-y-3">
            <p>Most Vedic astrology uses the <strong>Parashara</strong> system where each planet has fixed significations (Sun always = father, Moon always = mother). <strong>Jaimini</strong> is a complementary system that assigns roles based on <em>your unique chart</em> — the planet with the highest degree becomes your <strong>Atmakaraka</strong> (soul significator), the next becomes <strong>Amatyakaraka</strong> (career), and so on.</p>
            <p><strong>Why this matters for you:</strong></p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-gold-light">Soul Purpose (Atmakaraka)</strong> — reveals your soul&apos;s deepest desire and the lesson you&apos;re here to learn. This is the king of your chart.</li>
              <li><strong className="text-gold-light">Career Direction (Amatyakaraka)</strong> — the planet guiding your professional path and how you serve society.</li>
              <li><strong className="text-gold-light">Karakamsha</strong> — the navamsha sign of your Atmakaraka, revealing your soul&apos;s ultimate destination and deepest calling.</li>
              <li><strong className="text-gold-light">Arudha Padas</strong> — how the world <em>perceives</em> each area of your life (your image vs your reality). This is uniquely Jaimini.</li>
            </ul>
            <p>Think of Parashara as showing <em>what you have</em>, and Jaimini as showing <em>who you are and how the world sees you</em>.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p>अधिकांश वैदिक ज्योतिष <strong>पाराशर</strong> पद्धति का उपयोग करता है जहाँ प्रत्येक ग्रह की निश्चित भूमिकाएँ हैं। <strong>जैमिनी</strong> एक पूरक पद्धति है जो <em>आपकी अद्वितीय कुण्डली</em> के आधार पर भूमिकाएँ देती है — सबसे ऊँचे अंश वाला ग्रह <strong>आत्मकारक</strong> (आत्मा का कारक) बनता है।</p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-gold-light">आत्मकारक</strong> — आत्मा की गहनतम इच्छा और जीवन उद्देश्य।</li>
              <li><strong className="text-gold-light">अमात्यकारक</strong> — कैरियर दिशा और पेशेवर मार्ग।</li>
              <li><strong className="text-gold-light">कारकांश</strong> — आत्मकारक की नवांश राशि, आत्मा का अन्तिम गन्तव्य।</li>
              <li><strong className="text-gold-light">आरूढ़ पद</strong> — विश्व आपके जीवन के प्रत्येक क्षेत्र को कैसे देखता है।</li>
            </ul>
            <p>पाराशर दर्शाता है <em>आपके पास क्या है</em>, जैमिनी दर्शाता है <em>आप कौन हैं और विश्व आपको कैसे देखता है</em>।</p>
          </div>
        )}
      </InfoBlock>

      {/* Chara Karakas */}
      <div>
        <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
          {!isDevanagariLocale(locale) ? 'Chara Karakas (Variable Significators)' : 'चर कारक (परिवर्तनशील कारक)'}
        </h3>
        <p className="text-text-secondary/85 text-xs text-center mb-4">
          {!isDevanagariLocale(locale) ? 'Planets ranked by degree — highest to lowest — each assigned a life role' : 'ग्रह अंश के अनुसार क्रमबद्ध — उच्चतम से निम्नतम — प्रत्येक को जीवन भूमिका'}
        </p>
        <div className="space-y-3">
          {jaimini.charaKarakas.map((ck, i) => {
            const info = KARAKA_INFO[ck.karaka];
            return (
            <div key={i} className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/18 p-4 border ${i === 0 ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/15'}`}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-14 text-center pt-1">
                  <div className="text-gold-light font-bold text-lg" style={headingFont}>{tl(ck.planetName, locale)}</div>
                  <div className="text-gold-primary/65 font-mono text-xs">{ck.karaka} &middot; {ck.degree.toFixed(1)}°</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                    <span className="text-gold-primary font-bold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {info?.full?.[!isDevanagariLocale(locale) ? 'en' : 'hi'] || tl(ck.karakaName, locale)}
                    </span>
                    <span className="text-text-secondary/85 text-xs">
                      ({info?.meaning?.[!isDevanagariLocale(locale) ? 'en' : 'hi'] || tl(ck.karakaName, locale)})
                    </span>
                  </div>
                  {info?.governs && (
                    <p className="text-text-secondary/85 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {info.governs[!isDevanagariLocale(locale) ? 'en' : 'hi']}
                    </p>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Karakamsha */}
      <div>
        <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
          {!isDevanagariLocale(locale) ? 'Karakamsha' : 'कारकांश'}
        </h3>
        <p className="text-text-secondary/85 text-xs text-center mb-4">
          {!isDevanagariLocale(locale) ? 'The Navamsha sign of your Atmakaraka — reveals your soul\'s ultimate destination' : 'आत्मकारक की नवांश राशि — आत्मा का अन्तिम गन्तव्य'}
        </p>
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/18 p-6">
          <div className="text-center mb-3">
            <RashiIconById id={jaimini.karakamsha.sign} size={48} />
            <div className="text-gold-light font-bold text-2xl mt-2" style={headingFont}>{tl(jaimini.karakamsha.signName, locale)}</div>
          </div>
          {KARAKAMSHA_MEANING[jaimini.karakamsha.sign] && (
            <p className="text-text-secondary text-sm text-center leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {KARAKAMSHA_MEANING[jaimini.karakamsha.sign][!isDevanagariLocale(locale) ? 'en' : 'hi']}
            </p>
          )}
        </div>
      </div>

      {/* Swamsha Profile */}
      <SwamshaProfile kundali={kundali} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />

      {/* Arudha Padas */}
      <div>
        <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
          {!isDevanagariLocale(locale) ? 'Arudha Padas (Image Points)' : 'आरूढ़ पद (छवि बिन्दु)'}
        </h3>
        <p className="text-text-secondary/85 text-xs text-center mb-4">
          {!isDevanagariLocale(locale) ? 'How the world perceives each area of your life — the "maya" or illusion projected outward' : 'विश्व आपके जीवन के प्रत्येक क्षेत्र को कैसे देखता है — बाहर प्रक्षेपित "माया"'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {jaimini.arudhaPadas.map((ap, i) => {
            const meaning = ARUDHA_MEANING[ap.house];
            const rashiDesc = RASHI_ARUDHA_DESC[ap.sign];
            const isKey = i === 0 || ap.house === 7 || ap.house === 10 || ap.house === 12;
            return (
              <div key={i} className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-3 ${isKey ? 'border border-gold-primary/20 bg-gold-primary/[0.03]' : 'border border-gold-primary/15'}`}>
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-bg-secondary/70 flex items-center justify-center mt-0.5">
                    <span className="text-gold-primary font-bold text-sm">A{ap.house}</span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gold-light font-semibold text-sm" style={headingFont}>{tl(ap.signName, locale)}</span>
                      <span className="text-text-secondary/80 text-xs">{tl(ap.label, locale)}</span>
                    </div>
                    {meaning && (
                      <p className="text-text-secondary/85 text-xs leading-relaxed font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {meaning[!isDevanagariLocale(locale) ? 'en' : 'hi']}
                      </p>
                    )}
                    {rashiDesc && (
                      <p className="text-text-secondary/80 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {rashiDesc[!isDevanagariLocale(locale) ? 'en' : 'hi']}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Graha Arudhas */}
      {jaimini.grahaArudhas && jaimini.grahaArudhas.length > 0 && (
        <div>
          <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
            {!isDevanagariLocale(locale) ? 'Graha Arudhas (Planet Projections)' : 'ग्रह आरूढ़ (ग्रह प्रक्षेपण)'}
          </h3>
          <p className="text-text-secondary/85 text-xs text-center mb-4">
            {!isDevanagariLocale(locale) ? 'The Arudha of each planet — where its energy projects outward into the world' : 'प्रत्येक ग्रह का आरूढ़ — जहाँ इसकी ऊर्जा बाहर की ओर प्रक्षेपित होती है'}
          </p>
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/18 overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 divide-x divide-y divide-gold-primary/10">
              {jaimini.grahaArudhas.map((ga, i) => (
                <div key={i} className="p-3 text-center">
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{ga.planetName[locale as Locale] || ga.planetName.en}</div>
                  <div className="text-gold-light font-bold text-sm mt-1" style={headingFont}>{ga.arudhaSignName[locale as Locale] || ga.arudhaSignName.en}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rashi Drishti (Sign Aspects) */}
      <RashiDrishtiSection kundali={kundali} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />

      {/* Argala (Planetary Interventions) */}
      {kundali.argala && kundali.argala.length > 0 && (
        <ArgalaSection kundali={kundali} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
      )}

      {/* Chara Dasha */}
      <div>
        <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
          {!isDevanagariLocale(locale) ? 'Chara Dasha (Sign-Based Periods)' : 'चर दशा (राशि आधारित)'}
        </h3>
        <div className="space-y-2">
          {jaimini.charaDasha.map((cd, i) => {
            const now = new Date();
            const start = new Date(cd.startDate);
            const end = new Date(cd.endDate);
            const isCurrent = now >= start && now <= end;
            const isPast = now > end;
            return (
              <div key={i} className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/18 p-4 flex items-center justify-between ${isCurrent ? 'border border-gold-primary/40 bg-gold-primary/5' : ''} ${isPast ? 'opacity-40' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-gold-primary animate-pulse' : isPast ? 'bg-text-secondary/30' : 'bg-gold-dark/50'}`} />
                  <span className="text-gold-light font-bold" style={headingFont}>{tl(cd.signName, locale)}</span>
                  <span className="text-text-tertiary text-xs">{cd.years} {!isDevanagariLocale(locale) ? 'years' : 'वर्ष'}</span>
                </div>
                <span className="text-text-secondary text-xs font-mono">{cd.startDate} → {cd.endDate}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Jaimini Rajayogas */}
      {jaimini.rajayogas && jaimini.rajayogas.length > 0 && (
        <div>
          <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
            {!isDevanagariLocale(locale) ? 'Jaimini Rajayogas (from Karakamsha)' : 'जैमिनी राजयोग (कारकांश से)'}
          </h3>
          <p className="text-text-secondary/85 text-xs text-center mb-4 max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Planetary combinations assessed from the Karakamsha — the Navamsha sign of your soul-significator'
              : 'कारकांश से आकलित ग्रह संयोग — आपके आत्मकारक की नवांश राशि से'}
          </p>
          <div className="space-y-3">
            {jaimini.rajayogas.map((yoga, i) => (
              <div key={i} className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border p-4 ${
                yoga.strength === 'strong' ? 'border-gold-primary/30 shadow-sm shadow-gold-primary/10' :
                yoga.strength === 'moderate' ? 'border-gold-primary/15' : 'border-gold-primary/15'
              }`}>
                <div className="flex items-start gap-3">
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
                    yoga.strength === 'strong'   ? 'bg-gold-primary/25 text-gold-light' :
                    yoga.strength === 'moderate' ? 'bg-purple-500/20 text-purple-300' :
                                                   'bg-bg-secondary text-text-secondary/85'
                  }`}>
                    {yoga.strength === 'strong' ? (!isDevanagariLocale(locale) ? 'Strong' : 'प्रबल') :
                     yoga.strength === 'moderate' ? (!isDevanagariLocale(locale) ? 'Moderate' : 'मध्यम') :
                     (!isDevanagariLocale(locale) ? 'Mild' : 'मृदु')}
                  </span>
                  <div className="flex-1">
                    <div className="text-gold-primary font-bold text-sm mb-1" style={headingFont}>
                      {yoga.name[!isDevanagariLocale(locale) ? 'en' : 'hi']}
                    </div>
                    <p className="text-text-secondary/85 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {yoga.description[!isDevanagariLocale(locale) ? 'en' : 'hi']}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <JaiminiInterpretation jaimini={jaimini} locale={locale} />

      {/* Brahma / Rudra / Maheshwara */}
      <BrahmaRudraMaheshwara kundali={kundali} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SwamshaProfile({ kundali, locale, isDevanagari, headingFont }: JaiminiTabProps) {
  const kmSign = kundali.jaimini!.karakamsha.sign;
  const planetsInKM: number[] = kundali.navamshaChart?.houses?.[kmSign - 1] ?? [];

  const matchedCombos = SWAMSHA_COMBOS.filter(combo =>
    combo.ids.every(id => planetsInKM.includes(id))
  );

  if (planetsInKM.length === 0 && matchedCombos.length === 0) return null;

  return (
    <div>
      <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
        {!isDevanagariLocale(locale) ? 'Swamsha Profile (Karakamsha Combinations)' : 'स्वांश प्रोफाइल (कारकांश संयोग)'}
      </h3>
      <p className="text-text-secondary/85 text-xs text-center mb-4">
        {!isDevanagariLocale(locale) ? 'Classical planetary combinations in your Karakamsha sign — Jaimini Sutras interpretation' : 'आपकी कारकांश राशि में ग्रह संयोग — जैमिनी सूत्र व्याख्या'}
      </p>
      {planetsInKM.length === 0 ? (
        <p className="text-text-secondary/80 text-sm text-center">
          {!isDevanagariLocale(locale) ? 'No planets occupy the Karakamsha sign in D9 — soul\'s path is shaped purely by the Karakamsha sign\'s qualities above.' : 'D9 में कारकांश राशि में कोई ग्रह नहीं — आत्मा का पथ शुद्ध रूप से ऊपर की कारकांश राशि के गुणों द्वारा आकार पाता है।'}
        </p>
      ) : matchedCombos.length === 0 ? (
        <p className="text-text-secondary/80 text-sm text-center">
          {!isDevanagariLocale(locale) ? 'Planets present but no specific classical combination applies — see individual planet meanings above.' : 'ग्रह उपस्थित हैं किन्तु कोई विशिष्ट संयोग नहीं — ऊपर ग्रह अर्थ देखें।'}
        </p>
      ) : (
        <div className="space-y-3 max-w-2xl mx-auto">
          {matchedCombos.map((combo, idx) => (
            <div key={idx} className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 p-4">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="text-gold-light font-semibold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                  {combo.ids.map(id => kundali.planets.find(p => p.planet.id === id)?.planet.name[locale] || '').filter(Boolean).join(' + ')}
                  <span className="text-text-secondary/80 font-normal"> {!isDevanagariLocale(locale) ? 'in Swamsha' : 'स्वांश में'}</span>
                </div>
                {combo.tag && (
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[combo.tag]}`}>
                    {combo.tag}
                  </span>
                )}
              </div>
              <p className="text-text-secondary/85 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {!isDevanagariLocale(locale) ? combo.en : combo.hi}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RashiDrishtiSection({ kundali, locale, isDevanagari, headingFont }: JaiminiTabProps) {
  const ascSign = kundali.ascendant.sign;
  const moonSign = kundali.planets.find(p => p.planet.id === 1)?.sign ?? 0;
  const karakamsha = kundali.jaimini?.karakamsha.sign ?? 0;

  const keySignIds = new Set([ascSign, moonSign, karakamsha].filter(s => s > 0));

  const mutualAspects = getMutualRashiDrishti();
  const mutualSet = new Set(mutualAspects.map(m => `${m.sign1}-${m.sign2}`));

  return (
    <div>
      <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
        {!isDevanagariLocale(locale) ? 'Rashi Drishti (Sign Aspects)' : 'राशि दृष्टि (राशि पहलू)'}
      </h3>
      <p className="text-text-secondary/85 text-xs text-center mb-1 max-w-2xl mx-auto" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
        {locale === 'en'
          ? 'Jaimini sign aspects: Movable signs aspect all Fixed signs (except adjacent), Fixed aspect Movable (except adjacent), Dual aspect Dual (except adjacent).'
          : 'जैमिनी राशि दृष्टि: चर राशियाँ सभी स्थिर राशियों को देखती हैं (आसन्न को छोड़कर), स्थिर राशियाँ चर को, द्विस्वभाव राशियाँ द्विस्वभाव को।'}
      </p>
      <p className="text-text-secondary/80 text-[11px] text-center mb-4">
        {locale === 'en'
          ? 'Gold border = your Lagna / Moon / Karakamsha. Mutual aspects shown in bold.'
          : 'सुनहरी सीमा = आपकी लग्न / चन्द्र / कारकांश। परस्पर दृष्टि बोल्ड में।'}
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(fromSign => {
          const aspectedSigns: number[] = [];
          for (let to = 1; to <= 12; to++) {
            if (hasRashiDrishti(fromSign, to)) aspectedSigns.push(to);
          }
          const isKey = keySignIds.has(fromSign);
          const hasMutual = aspectedSigns.some(to => mutualSet.has(`${Math.min(fromSign,to)}-${Math.max(fromSign,to)}`));

          return (
            <div
              key={fromSign}
              className={`rounded-xl p-3 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border ${isKey ? 'border-gold-primary/40 shadow-sm shadow-gold-primary/10' : 'border-gold-primary/15'}`}
            >
              {/* Sign header */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`text-xs font-bold ${isKey ? 'text-gold-light' : 'text-gold-primary/85'}`} style={headingFont}>
                  {!isDevanagariLocale(locale) ? SIGN_NAMES_EN[fromSign - 1] : SIGN_NAMES_HI[fromSign - 1]}
                </span>
                <span className="text-text-secondary/85 text-[10px] font-mono">{fromSign}</span>
                {isKey && (
                  <span className="ml-auto text-[9px] px-1 py-0.5 rounded-full bg-gold-primary/15 text-gold-primary font-bold">
                    {fromSign === ascSign ? (!isDevanagariLocale(locale) ? 'L' : 'ल') : fromSign === moonSign ? (!isDevanagariLocale(locale) ? 'M' : 'च') : (!isDevanagariLocale(locale) ? 'K' : 'क')}
                  </span>
                )}
              </div>

              {/* Aspected signs */}
              <div className="flex flex-wrap gap-1">
                {aspectedSigns.length === 0 ? (
                  <span className="text-text-secondary/85 text-[10px]">—</span>
                ) : aspectedSigns.map(to => {
                  const isMut = mutualSet.has(`${Math.min(fromSign,to)}-${Math.max(fromSign,to)}`);
                  const isToKey = keySignIds.has(to);
                  return (
                    <span
                      key={to}
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isMut && isToKey ? 'bg-gold-primary/25 text-gold-light font-bold' :
                        isMut ? 'bg-purple-500/15 text-purple-300/80 font-semibold' :
                        isToKey ? 'bg-gold-primary/12 text-gold-primary/90' :
                        'bg-bg-secondary/70 text-text-secondary/85'
                      }`}
                    >
                      {!isDevanagariLocale(locale) ? SIGN_NAMES_EN[to - 1] : SIGN_NAMES_HI[to - 1]}
                      {isMut && <span className="ml-0.5 opacity-60">↔</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mutual aspects summary */}
      {mutualAspects.length > 0 && (
        <div className="mt-4 rounded-xl bg-purple-500/5 border border-purple-500/15 p-3">
          <div className="text-purple-300/70 text-xs font-bold mb-2">
            {!isDevanagariLocale(locale) ? 'Mutual Sign Aspects (↔ Both aspects each other)' : 'परस्पर राशि दृष्टि (↔ दोनों परस्पर देखती हैं)'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mutualAspects.map(m => {
              const s1Key = keySignIds.has(m.sign1);
              const s2Key = keySignIds.has(m.sign2);
              const isHighlighted = s1Key || s2Key;
              return (
                <span
                  key={`${m.sign1}-${m.sign2}`}
                  className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${isHighlighted ? 'bg-gold-primary/20 text-gold-light font-bold' : 'bg-purple-500/10 text-purple-200/60'}`}
                >
                  {!isDevanagariLocale(locale) ? SIGN_NAMES_EN[m.sign1-1] : SIGN_NAMES_HI[m.sign1-1]}
                  {' ↔ '}
                  {!isDevanagariLocale(locale) ? SIGN_NAMES_EN[m.sign2-1] : SIGN_NAMES_HI[m.sign2-1]}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ArgalaSection({ kundali, locale, isDevanagari, headingFont }: JaiminiTabProps) {
  return (
    <div>
      <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
        {!isDevanagariLocale(locale) ? 'Argala (Planetary Interventions)' : 'अर्गल (ग्रह हस्तक्षेप)'}
      </h3>
      <p className="text-text-secondary/85 text-xs text-center mb-4 max-w-2xl mx-auto" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
        {locale === 'en'
          ? 'Planets in 2nd, 4th, and 11th from each house create Argala (intervention) — those in 12th, 10th, 3rd counter it (Virodha). Net effect shows whether planetary forces support or obstruct each house.'
          : 'प्रत्येक भाव से 2रे, 4थे, 11वें ग्रह अर्गल बनाते हैं — 12वें, 10वें, 3रे से ग्रह विरोधार्गल। शुद्ध प्रभाव दर्शाता है कि ग्रह शक्तियाँ प्रत्येक भाव को सहयोग देती हैं या बाधित करती हैं।'}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {kundali.argala!.map((ar) => {
          const rashiName = RASHIS[ar.sign - 1]?.name;
          const signLabel = rashiName ? (!isDevanagariLocale(locale) ? rashiName.en : rashiName.hi) : `S${ar.sign}`;
          const houseLabel = HOUSE_LABELS[ar.house];
          const strongArgalas = ar.argalas.filter(a => a.strength === 'strong');
          const strongVirodha = ar.virodha.filter(v => v.strength === 'strong');
          return (
            <div key={ar.house} className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border p-3 ${
              ar.netEffect === 'supported' ? 'border-emerald-500/25' :
              ar.netEffect === 'obstructed' ? 'border-red-500/20' : 'border-gold-primary/15'
            }`}>
              {/* House header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-bg-secondary/80 flex items-center justify-center text-gold-primary font-bold text-xs">{ar.house}</span>
                  <div>
                    <div className="text-gold-light font-semibold text-xs" style={headingFont}>{signLabel}</div>
                    <div className="text-text-secondary/80 text-[10px]">{houseLabel?.[!isDevanagariLocale(locale) ? 'en' : 'hi']}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  ar.netEffect === 'supported' ? 'bg-emerald-500/15 text-emerald-400' :
                  ar.netEffect === 'obstructed' ? 'bg-red-500/12 text-red-400' : 'bg-bg-secondary/75 text-text-secondary/85'
                }`}>
                  {ar.netEffect === 'supported' ? (!isDevanagariLocale(locale) ? '✦ Active' : '✦ सक्रिय') :
                   ar.netEffect === 'obstructed' ? (!isDevanagariLocale(locale) ? '↓ Blocked' : '↓ अवरुद्ध') :
                   (!isDevanagariLocale(locale) ? '— Neutral' : '— तटस्थ')}
                </span>
              </div>

              {/* Argala planets */}
              {strongArgalas.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {strongArgalas.map((a, i) => (
                    <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded-full ${a.nature === 'benefic' ? 'bg-emerald-500/12 text-emerald-300/80' : 'bg-amber-500/12 text-amber-300/70'}`}>
                      {a.planetName[locale as 'en' | 'hi' | 'sa'] || a.planetName.en}
                      <span className="text-text-secondary/85 ml-0.5">+{a.fromHouse}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Virodha planets */}
              {strongVirodha.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {strongVirodha.map((v, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-300/60">
                      {v.planetName[locale as 'en' | 'hi' | 'sa'] || v.planetName.en}
                      <span className="text-text-secondary/85 ml-0.5">−{v.fromHouse}</span>
                    </span>
                  ))}
                </div>
              )}

              {strongArgalas.length === 0 && strongVirodha.length === 0 && (
                <p className="text-text-secondary/85 text-[10px]">{!isDevanagariLocale(locale) ? 'No strong interventions' : 'कोई प्रबल हस्तक्षेप नहीं'}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BrahmaRudraMaheshwara({ kundali, locale, isDevanagari, headingFont }: JaiminiTabProps) {
  const shoolaLords = calculateShoolaLords(kundali.ascendant.sign, kundali.planets);
  const brahmaP  = kundali.planets.find(p => p.planet.id === shoolaLords.brahma.planetId);
  const rudraP   = kundali.planets.find(p => p.planet.id === shoolaLords.rudra.planetId);
  const maheshP  = kundali.planets.find(p => p.planet.id === shoolaLords.maheshwara.planetId);

  const ascSign = kundali.ascendant.sign;
  const isOddLagna = ascSign % 2 === 1;
  const brahmaHousesEn = isOddLagna ? '3rd, 6th, or 11th' : '1st, 8th, or 9th';
  const brahmaHousesHi = isOddLagna ? '3, 6, 11वें' : '1, 8, 9वें';
  const brahmaSignEn = brahmaP ? SIGN_NAMES_3[brahmaP.sign] ?? '' : '';
  const maheshSignEn = maheshP ? SIGN_NAMES_3[maheshP.sign] ?? '' : '';

  const triplet = [
    {
      titleEn: 'Brahma', titleHi: 'ब्रह्मा',
      planet: brahmaP,
      descEn: `Strongest planet in ${brahmaHousesEn} from Lagna (Jaimini Sutras). The Creator — its strength indicates vitality, dharmic protection, and capacity for recovery. Brahma's dasha periods bring new beginnings and life-affirming events.`,
      descHi: `लग्न से ${brahmaHousesHi} भाव में बलवान ग्रह (जैमिनी सूत्र)। सृष्टिकर्ता — इसकी शक्ति जीवनी, धर्म-संरक्षण और रोग से उबरने की क्षमता बताती है। ब्रह्मा की दशा में नव आरंभ होते हैं।`,
      color: 'border-amber-500/20 bg-amber-500/5',
    },
    {
      titleEn: 'Rudra', titleHi: 'रुद्र',
      planet: rudraP,
      descEn: `Stronger of 2nd lord (maraka) and 8th lord from Lagna. The Destroyer — controls the timing of health crises, major transformations, and near-death transitions. Shoola Dasha periods of ${shoolaLords.rudra.name.en} require careful health monitoring.`,
      descHi: `लग्न से 2वें और 8वें भाव के स्वामी में बलवान। संहारक — स्वास्थ्य संकट, परिवर्तन और महत्वपूर्ण घटनाओं का समय। ${shoolaLords.rudra.name.hi} की शूल दशा में स्वास्थ्य पर ध्यान।`,
      color: 'border-red-500/20 bg-red-500/5',
    },
    {
      titleEn: 'Maheshwara', titleHi: 'महेश्वर',
      planet: maheshP,
      descEn: `Lord of the 8th from Brahma's sign (${brahmaSignEn} → 8th = ${maheshSignEn}). The Sustainer — presides over great karmic events, spiritual transformation, and liberation. Governs the bridge between life and moksha.`,
      descHi: `ब्रह्मा की राशि से 8वें भाव का स्वामी (${brahmaSignEn} → ${maheshSignEn})। पालनकर्ता — महान कार्मिक घटनाओं, आध्यात्मिक परिवर्तन और मोक्ष की ओर सेतु।`,
      color: 'border-purple-500/20 bg-purple-500/5',
    },
  ];

  return (
    <div>
      <h3 className="text-gold-gradient text-xl font-bold mb-2 text-center" style={headingFont}>
        {!isDevanagariLocale(locale) ? 'Brahma · Rudra · Maheshvara' : 'ब्रह्मा · रुद्र · महेश्वर'}
      </h3>
      <p className="text-text-secondary/85 text-xs text-center mb-4 max-w-2xl mx-auto">
        {!isDevanagariLocale(locale) ? 'Jaimini longevity significators — these three planets govern the arc of life, health transformation, and karmic release' : 'जैमिनी आयुकारक — ये तीन ग्रह जीवन, स्वास्थ्य परिवर्तन और कार्मिक मुक्ति के चाप को नियंत्रित करते हैं'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {triplet.map(({ titleEn, titleHi, planet, descEn, descHi, color }) => (
          <div key={titleEn} className={`rounded-xl p-4 border ${color}`}>
            <div className="text-center mb-3">
              {planet && <GrahaIconById id={planet.planet.id} size={36} />}
              <div className="text-gold-light font-bold text-base mt-1" style={headingFont}>
                {!isDevanagariLocale(locale) ? titleEn : titleHi}
              </div>
              {planet && (
                <div className="text-text-secondary/85 text-xs mt-0.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(planet.planet.name, locale)} · H{planet.house} · {tl(planet.signName, locale)}
                </div>
              )}
            </div>
            <p className="text-text-secondary/85 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {!isDevanagariLocale(locale) ? descEn : descHi}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

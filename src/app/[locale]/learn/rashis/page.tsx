'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { ZodiacBeltDiagram } from '@/components/learn/InteractiveDiagram';
import { RASHIS } from '@/lib/constants/rashis';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/rashis.json';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';

const t_ = LJ as unknown as Record<string, LocaleText>;



/* ---------- element data ---------- */
const ELEMENTS = [
  {
    name: { en: 'Fire (Agni)', hi: 'अग्नि तत्व', sa: 'अग्नितत्त्वम्' },
    signs: 'Aries, Leo, Sagittarius',
    signsSa: 'मेष, सिंह, धनु',
    color: 'text-red-400',
    bgColor: 'border-red-400/20 bg-red-400/5',
    desc: {
      en: 'Fire signs are dynamic, assertive, and action-oriented. They embody initiative, leadership, and transformative energy. Planets in fire signs act quickly, boldly, and with enthusiasm. Fire gives courage but can also lead to impulsiveness and aggression.',
      hi: 'अग्नि राशियाँ गतिशील, दृढ़ और कर्मोन्मुख होती हैं। ये पहल, नेतृत्व और परिवर्तनकारी ऊर्जा का प्रतीक हैं। अग्नि राशियों के ग्रह शीघ्र, साहसपूर्वक और उत्साह से कार्य करते हैं।',
      sa: 'अग्निराशयः गतिशीलाः, दृढाः, कर्मोन्मुखाश्च। तासु ग्रहाः शीघ्रं साहसेन उत्साहेन च कार्यं कुर्वन्ति।'
    },
  },
  {
    name: { en: 'Earth (Prithvi)', hi: 'पृथ्वी तत्व', sa: 'पृथिवीतत्त्वम्' },
    signs: 'Taurus, Virgo, Capricorn',
    signsSa: 'वृषभ, कन्या, मकर',
    color: 'text-emerald-400',
    bgColor: 'border-emerald-400/20 bg-emerald-400/5',
    desc: {
      en: 'Earth signs are practical, grounded, and materially focused. They represent stability, perseverance, and tangible results. Planets in earth signs produce slow but enduring outcomes. Earth gives reliability but can lead to rigidity and excessive attachment to material security.',
      hi: 'पृथ्वी राशियाँ व्यावहारिक, भूमिगत और भौतिक रूप से केन्द्रित होती हैं। ये स्थिरता, दृढ़ता और ठोस परिणामों का प्रतिनिधित्व करती हैं। पृथ्वी राशियों के ग्रह धीमे लेकिन स्थायी परिणाम देते हैं।',
      sa: 'पृथिवीराशयः व्यावहारिकाः, स्थिताः, भौतिकरूपेण केन्द्रिताश्च। तासु ग्रहाः मन्दं किन्तु स्थायिफलं ददति।'
    },
  },
  {
    name: { en: 'Air (Vayu)', hi: 'वायु तत्व', sa: 'वायुतत्त्वम्' },
    signs: 'Gemini, Libra, Aquarius',
    signsSa: 'मिथुन, तुला, कुम्भ',
    color: 'text-sky-400',
    bgColor: 'border-sky-400/20 bg-sky-400/5',
    desc: {
      en: 'Air signs are intellectual, communicative, and socially oriented. They govern thought, relationships, and abstract ideas. Planets in air signs express through communication, analysis, and social interaction. Air gives versatility but can lead to indecisiveness and detachment from emotions.',
      hi: 'वायु राशियाँ बौद्धिक, संवादात्मक और सामाजिक रूप से उन्मुख होती हैं। ये विचार, सम्बन्ध और अमूर्त विचारों को नियन्त्रित करती हैं। वायु राशियों के ग्रह संवाद और सामाजिक अन्तर्क्रिया से अभिव्यक्त होते हैं।',
      sa: 'वायुराशयः बौद्धिकाः, संवादात्मिकाः, सामाजिकोन्मुखाश्च। तासु ग्रहाः संवादेन विश्लेषणेन च अभिव्यज्यन्ते।'
    },
  },
  {
    name: { en: 'Water (Jala)', hi: 'जल तत्व', sa: 'जलतत्त्वम्' },
    signs: 'Cancer, Scorpio, Pisces',
    signsSa: 'कर्क, वृश्चिक, मीन',
    color: 'text-blue-400',
    bgColor: 'border-blue-400/20 bg-blue-400/5',
    desc: {
      en: 'Water signs are emotional, intuitive, and receptive. They represent feelings, psychic sensitivity, and deep inner processes. Planets in water signs operate through emotion, empathy, and intuition. Water gives depth and compassion but can lead to moodiness and emotional vulnerability.',
      hi: 'जल राशियाँ भावनात्मक, अन्तर्ज्ञानी और ग्रहणशील होती हैं। ये भावनाओं, मानसिक संवेदनशीलता और गहरी आन्तरिक प्रक्रियाओं का प्रतिनिधित्व करती हैं। जल राशियों के ग्रह भावना और सहानुभूति से कार्य करते हैं।',
      sa: 'जलराशयः भावनात्मिकाः, अन्तर्ज्ञानिन्यः, ग्राहिण्यश्च। तासु ग्रहाः भावनया सहानुभूत्या च कार्यं कुर्वन्ति।'
    },
  },
];

/* ---------- quality data ---------- */
const QUALITIES = [
  {
    name: { en: 'Chara (Cardinal / Movable)', hi: 'चर (गतिशील)', sa: 'चरम् (गतिशीलम्)' },
    signs: { en: 'Aries, Cancer, Libra, Capricorn', hi: 'मेष, कर्क, तुला, मकर', sa: 'मेषः, कर्कटः, तुला, मकरः' },
    color: 'text-amber-400',
    border: 'border-amber-400/20 bg-amber-400/5',
    desc: {
      en: 'Chara signs initiate action and bring change. They mark the beginning of each season (equinoxes and solstices). Planets here drive new beginnings, restlessness, and forward movement. People with strong Chara influence are pioneers, initiators, and change-makers. However, they may lack staying power and abandon projects once the novelty fades.',
      hi: 'चर राशियाँ कर्म प्रारम्भ करती हैं और परिवर्तन लाती हैं। ये प्रत्येक ऋतु का आरम्भ चिह्नित करती हैं। यहाँ ग्रह नई शुरुआत, बेचैनी और आगे बढ़ने की प्रेरणा देते हैं।',
      sa: 'चरराशयः कर्म प्रारभन्ते परिवर्तनं च आनयन्ति। प्रत्येकर्तोः आरम्भं चिह्नयन्ति।'
    },
  },
  {
    name: { en: 'Sthira (Fixed / Stable)', hi: 'स्थिर (स्थायी)', sa: 'स्थिरम् (स्थायि)' },
    signs: { en: 'Taurus, Leo, Scorpio, Aquarius', hi: 'वृषभ, सिंह, वृश्चिक, कुम्भ', sa: 'वृषभः, सिंहः, वृश्चिकः, कुम्भः' },
    color: 'text-emerald-400',
    border: 'border-emerald-400/20 bg-emerald-400/5',
    desc: {
      en: 'Sthira signs consolidate and sustain. They occupy the middle of each season, representing peak energy that is stable and enduring. Planets here give persistence, determination, and depth. People with strong Sthira influence are loyal, focused, and unwavering. The downside is stubbornness, resistance to change, and possessiveness.',
      hi: 'स्थिर राशियाँ समेकित और स्थायी करती हैं। ये प्रत्येक ऋतु के मध्य में होती हैं, स्थायी शिखर ऊर्जा का प्रतिनिधित्व करती हैं। यहाँ ग्रह दृढ़ता, संकल्प और गहराई देते हैं।',
      sa: 'स्थिरराशयः समेकयन्ति स्थापयन्ति च। प्रत्येकर्तोः मध्ये स्थिताः स्थायिशिखरोर्जां प्रतिनिधयन्ति।'
    },
  },
  {
    name: { en: 'Dwiswabhava (Mutable / Dual)', hi: 'द्विस्वभाव (परिवर्तनशील)', sa: 'द्विस्वभावम् (परिवर्तनशीलम्)' },
    signs: { en: 'Gemini, Virgo, Sagittarius, Pisces', hi: 'मिथुन, कन्या, धनु, मीन', sa: 'मिथुनं, कन्या, धनुः, मीनः' },
    color: 'text-violet-400',
    border: 'border-violet-400/20 bg-violet-400/5',
    desc: {
      en: 'Dwiswabhava (dual-natured) signs are adaptable and transitional. They close out each season, bridging one phase into the next. Planets here give flexibility, intellectual breadth, and versatility. People with strong Dwiswabhava influence are adaptable communicators and multi-taskers. The challenge is inconsistency, scattered focus, and difficulty committing.',
      hi: 'द्विस्वभाव (दोहरी प्रकृति) राशियाँ अनुकूलनीय और संक्रमणशील होती हैं। ये प्रत्येक ऋतु को समाप्त करती हैं, एक चरण से अगले में सेतु बनाती हैं। यहाँ ग्रह लचीलापन, बौद्धिक विस्तार और बहुमुखी प्रतिभा देते हैं।',
      sa: 'द्विस्वभावराशयः अनुकूलनीयाः संक्रमणशीलाश्च। प्रत्येकर्तुं समापयन्ति एकचरणात् अपरं प्रति सेतुं रचयन्ति।'
    },
  },
];

/* ---------- exaltation/debilitation data ---------- */
const DIGNITY_DATA = [
  { planet: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' }, exaltSign: { en: 'Aries 10°', hi: 'मेष 10°', sa: 'मेष 10°', mai: 'मेष 10°', mr: 'मेष 10°', ta: 'மேஷம் 10°', te: 'మేషం 10°', bn: 'মেষ 10°', kn: 'ಮೇಷ 10°', gu: 'મેષ 10°' }, debSign: { en: 'Libra 10°', hi: 'तुला 10°', sa: 'तुला 10°', mai: 'तुला 10°', mr: 'तुला 10°', ta: 'துலாம் 10°', te: 'తులా 10°', bn: 'তুলা 10°', kn: 'ತುಲಾ 10°', gu: 'તુલા 10°' }, moolaSign: { en: 'Leo', hi: 'सिंह', sa: 'सिंह', mai: 'सिंह', mr: 'सिंह', ta: 'சிம்மம்', te: 'సింహం', bn: 'সিংহ', kn: 'ಸಿಂಹ', gu: 'સિંહ' } },
  { planet: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' }, exaltSign: { en: 'Taurus 3°', hi: 'वृषभ 3°', sa: 'वृषभ 3°', mai: 'वृषभ 3°', mr: 'वृषभ 3°', ta: 'ரிஷபம் 3°', te: 'వృషభం 3°', bn: 'বৃষ 3°', kn: 'ವೃಷಭ 3°', gu: 'વૃષભ 3°' }, debSign: { en: 'Scorpio 3°', hi: 'वृश्चिक 3°', sa: 'वृश्चिक 3°', mai: 'वृश्चिक 3°', mr: 'वृश्चिक 3°', ta: 'விருச்சிகம் 3°', te: 'వృశ్చికం 3°', bn: 'বৃশ্চিক 3°', kn: 'ವೃಶ್ಚಿಕ 3°', gu: 'વૃશ્ચિક 3°' }, moolaSign: { en: 'Cancer', hi: 'कर्क', sa: 'कर्क', mai: 'कर्क', mr: 'कर्क', ta: 'கடகம்', te: 'కర్కాటకం', bn: 'কর্কট', kn: 'ಕರ್ಕಾಟಕ', gu: 'કર્ક' } },
  { planet: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಕುಜ', gu: 'મંગળ' }, exaltSign: { en: 'Capricorn 28°', hi: 'मकर 28°', sa: 'मकर 28°', mai: 'मकर 28°', mr: 'मकर 28°', ta: 'மகரம் 28°', te: 'మకరం 28°', bn: 'মকর 28°', kn: 'ಮಕರ 28°', gu: 'મકર 28°' }, debSign: { en: 'Cancer 28°', hi: 'कर्क 28°', sa: 'कर्क 28°', mai: 'कर्क 28°', mr: 'कर्क 28°', ta: 'கடகம் 28°', te: 'కర్కాటకం 28°', bn: 'কর্কট 28°', kn: 'ಕರ್ಕಾಟಕ 28°', gu: 'કર્ક 28°' }, moolaSign: { en: 'Aries, Scorpio', hi: 'मेष, वृश्चिक', sa: 'मेष, वृश्चिक', mai: 'मेष, वृश्चिक', mr: 'मेष, वृश्चिक', ta: 'மேஷம், விருச்சிகம்', te: 'మేషం, వృశ్చికం', bn: 'মেষ, বৃশ্চিক', kn: 'ಮೇಷ, ವೃಶ್ಚಿಕ', gu: 'મેષ, વૃશ્ચિક' } },
  { planet: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' }, exaltSign: { en: 'Virgo 15°', hi: 'कन्या 15°', sa: 'कन्या 15°', mai: 'कन्या 15°', mr: 'कन्या 15°', ta: 'கன்னி 15°', te: 'కన్య 15°', bn: 'কন্যা 15°', kn: 'ಕನ್ಯಾ 15°', gu: 'કન્યા 15°' }, debSign: { en: 'Pisces 15°', hi: 'मीन 15°', sa: 'मीन 15°', mai: 'मीन 15°', mr: 'मीन 15°', ta: 'மீனம் 15°', te: 'మీనం 15°', bn: 'মীন 15°', kn: 'ಮೀನ 15°', gu: 'મીન 15°' }, moolaSign: { en: 'Gemini, Virgo', hi: 'मिथुन, कन्या', sa: 'मिथुन, कन्या', mai: 'मिथुन, कन्या', mr: 'मिथुन, कन्या', ta: 'மிதுனம், கன்னி', te: 'మిథునం, కన్య', bn: 'মিথুন, কন্যা', kn: 'ಮಿಥುನ, ಕನ್ಯಾ', gu: 'મિથુન, કન્યા' } },
  { planet: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पति', mai: 'बृहस्पति', mr: 'बृहस्पति', ta: 'குரு', te: 'గురువు', bn: 'বৃহস্পতি', kn: 'ಗುರು', gu: 'ગુરુ' }, exaltSign: { en: 'Cancer 5°', hi: 'कर्क 5°', sa: 'कर्क 5°', mai: 'कर्क 5°', mr: 'कर्क 5°', ta: 'கடகம் 5°', te: 'కర్కాటకం 5°', bn: 'কর্কট 5°', kn: 'ಕರ್ಕಾಟಕ 5°', gu: 'કર્ક 5°' }, debSign: { en: 'Capricorn 5°', hi: 'मकर 5°', sa: 'मकर 5°', mai: 'मकर 5°', mr: 'मकर 5°', ta: 'மகரம் 5°', te: 'మకరం 5°', bn: 'মকর 5°', kn: 'ಮಕರ 5°', gu: 'મકર 5°' }, moolaSign: { en: 'Sagittarius, Pisces', hi: 'धनु, मीन', sa: 'धनु, मीन', mai: 'धनु, मीन', mr: 'धनु, मीन', ta: 'தனுசு, மீனம்', te: 'ధనుస్సు, మీనం', bn: 'ধনু, মীন', kn: 'ಧನು, ಮೀನ', gu: 'ધનુ, મીન' } },
  { planet: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' }, exaltSign: { en: 'Pisces 27°', hi: 'मीन 27°', sa: 'मीन 27°', mai: 'मीन 27°', mr: 'मीन 27°', ta: 'மீனம் 27°', te: 'మీనం 27°', bn: 'মীন 27°', kn: 'ಮೀನ 27°', gu: 'મીன 27°' }, debSign: { en: 'Virgo 27°', hi: 'कन्या 27°', sa: 'कन्या 27°', mai: 'कन्या 27°', mr: 'कन्या 27°', ta: 'கன்னி 27°', te: 'కన్య 27°', bn: 'কন্যা 27°', kn: 'ಕನ್ಯಾ 27°', gu: 'કન્યા 27°' }, moolaSign: { en: 'Taurus, Libra', hi: 'वृषभ, तुला', sa: 'वृषभ, तुला', mai: 'वृषभ, तुला', mr: 'वृषभ, तुला', ta: 'ரிஷபம், துலாம்', te: 'వృషభం, తులా', bn: 'বৃষ, তুলা', kn: 'ವೃಷಭ, ತುಲಾ', gu: 'વૃષભ, તુલા' } },
  { planet: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' }, exaltSign: { en: 'Libra 20°', hi: 'तुला 20°', sa: 'तुला 20°', mai: 'तुला 20°', mr: 'तुला 20°', ta: 'துலாம் 20°', te: 'తులా 20°', bn: 'তুলা 20°', kn: 'ತುಲಾ 20°', gu: 'તુલા 20°' }, debSign: { en: 'Aries 20°', hi: 'मेष 20°', sa: 'मेष 20°', mai: 'मेष 20°', mr: 'मेष 20°', ta: 'மேஷம் 20°', te: 'మేషం 20°', bn: 'মেষ 20°', kn: 'ಮೇಷ 20°', gu: 'મેષ 20°' }, moolaSign: { en: 'Capricorn, Aquarius', hi: 'मकर, कुम्भ', sa: 'मकर, कुम्भ', mai: 'मकर, कुम्भ', mr: 'मकर, कुम्भ', ta: 'மகரம், கும்பம்', te: 'మకరం, కుంభం', bn: 'মকর, কুম্ভ', kn: 'ಮಕರ, ಕುಂಭ', gu: 'મકર, કુંભ' } },
  { planet: { en: 'Rahu', hi: 'राहु', sa: 'राहु', mai: 'राहु', mr: 'राहु', ta: 'ராகு', te: 'రాహువు', bn: 'রাহু', kn: 'ರಾಹು', gu: 'રાહુ' }, exaltSign: { en: 'Taurus/Gemini', hi: 'वृषभ/मिथुन', sa: 'वृषभ/मिथुन', mai: 'वृषभ/मिथुन', mr: 'वृषभ/मिथुन', ta: 'ரிஷபம்/மிதுனம்', te: 'వృషభం/మిథునం', bn: 'বৃষ/মিথুন', kn: 'ವೃಷಭ/ಮಿಥುನ', gu: 'વૃષભ/મિથુન' }, debSign: { en: 'Scorpio/Sagittarius', hi: 'वृश्चिक/धनु', sa: 'वृश्चिक/धनु', mai: 'वृश्चिक/धनु', mr: 'वृश्चिक/धनु', ta: 'விருச்சிகம்/தனுசு', te: 'వృశ్చికం/ధనుస్సు', bn: 'বৃশ্চিক/ধনু', kn: 'ವೃಶ್ಚಿಕ/ಧನು', gu: 'વૃશ્ચિક/ધનુ' }, moolaSign: { en: '—', hi: '—', sa: '—', mai: '—', mr: '—', ta: '—', te: '—', bn: '—', kn: '—', gu: '—' } },
  { planet: { en: 'Ketu', hi: 'केतु', sa: 'केतु', mai: 'केतु', mr: 'केतु', ta: 'கேது', te: 'కేతువు', bn: 'কেতু', kn: 'ಕೇತು', gu: 'કેતુ' }, exaltSign: { en: 'Scorpio/Sagittarius', hi: 'वृश्चिक/धनु', sa: 'वृश्चिक/धनु', mai: 'वृश्चिक/धनु', mr: 'वृश्चिक/धनु', ta: 'விருச்சிகம்/தனுசு', te: 'వృశ్చికం/ధనుస్సు', bn: 'বৃশ্চিক/ধনু', kn: 'ವೃಶ್ಚಿಕ/ಧನು', gu: 'વૃશ્ચિક/ધનુ' }, debSign: { en: 'Taurus/Gemini', hi: 'वृषभ/मिथुन', sa: 'वृषभ/मिथुन', mai: 'वृषभ/मिथुन', mr: 'वृषभ/मिथुन', ta: 'ரிஷபம்/மிதுனம்', te: 'వృషభం/మిథునం', bn: 'বৃষ/মিথুন', kn: 'ವೃಷಭ/ಮಿಥುನ', gu: 'વૃષભ/મિથુન' }, moolaSign: { en: '—', hi: '—', sa: '—', mai: '—', mr: '—', ta: '—', te: '—', bn: '—', kn: '—', gu: '—' } },
];

/* ---------- body part mapping ---------- */
const BODY_PARTS = [
  { id: 1, sign: { en: 'Aries', hi: 'मेष', sa: 'मेष', mai: 'मेष', mr: 'मेष', ta: 'மேஷம்', te: 'మేషం', bn: 'মেষ', kn: 'ಮೇಷ', gu: 'મેષ' }, part: { en: 'Head, brain, face', hi: 'सिर, मस्तिष्क, मुख', sa: 'सिर, मस्तिष्क, मुख', mai: 'सिर, मस्तिष्क, मुख', mr: 'सिर, मस्तिष्क, मुख', ta: 'தலை, மூளை, முகம்', te: 'తల, మెదడు, ముఖం', bn: 'মাথা, মস্তিষ্ক, মুখ', kn: 'ತಲೆ, ಮಿದುಳು, ಮುಖ', gu: 'માથું, મગજ, ચહેરો' } },
  { id: 2, sign: { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभ', mai: 'वृषभ', mr: 'वृषभ', ta: 'ரிஷபம்', te: 'వృషభం', bn: 'বৃষ', kn: 'ವೃಷಭ', gu: 'વૃષભ' }, part: { en: 'Face, neck, throat, right eye', hi: 'मुख, गर्दन, कण्ठ, दायाँ नेत्र', sa: 'मुख, गर्दन, कण्ठ, दायाँ नेत्र', mai: 'मुख, गर्दन, कण्ठ, दायाँ नेत्र', mr: 'मुख, गर्दन, कण्ठ, दायाँ नेत्र', ta: 'முகம், கழுத்து, தொண்டை, வலது கண்', te: 'ముఖం, మెడ, గొంతు, కుడి కన్ను', bn: 'মুখ, ঘাড়, গলা, ডান চোখ', kn: 'ಮುಖ, ಕುತ್ತಿಗೆ, ಗಂಟಲು, ಬಲ ಕಣ್ಣು', gu: 'ચહેરો, ગરદન, ગળું, જમણી આંખ' } },
  { id: 3, sign: { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुन', mai: 'मिथुन', mr: 'मिथुन', ta: 'மிதுனம்', te: 'మిథునం', bn: 'মিথুন', kn: 'ಮಿಥುನ', gu: 'મિથુન' }, part: { en: 'Arms, shoulders, lungs, hands', hi: 'भुजाएँ, कन्धे, फेफड़े, हाथ', sa: 'भुजाएँ, कन्धे, फेफड़े, हाथ', mai: 'भुजाएँ, कन्धे, फेफड़े, हाथ', mr: 'भुजाएँ, कन्धे, फेफड़े, हाथ', ta: 'கைகள், தோள்கள், நுரையீரல்', te: 'భుజాలు, రొమ్ము, ఊపిరితిత్తులు, చేతులు', bn: 'বাহু, কাঁধ, ফুসফুস, হাত', kn: 'ತೋಳುಗಳು, ಭುಜಗಳು, ಶ್ವಾಸಕೋಶ, ಕೈಗಳು', gu: 'હાથ, ખભા, ફેફસાં, હાથ' } },
  { id: 4, sign: { en: 'Cancer', hi: 'कर्क', sa: 'कर्क', mai: 'कर्क', mr: 'कर्क', ta: 'கடகம்', te: 'కర్కాటకం', bn: 'কর্কট', kn: 'ಕರ್ಕಾಟಕ', gu: 'કર્ક' }, part: { en: 'Chest, heart, stomach, breasts', hi: 'छाती, हृदय, उदर, वक्ष', sa: 'छाती, हृदय, उदर, वक्ष', mai: 'छाती, हृदय, उदर, वक्ष', mr: 'छाती, हृदय, उदर, वक्ष', ta: 'மார்பு, இதயம், வயிறு, மார்பகங்கள்', te: 'ఛాతీ, హృదయం, ఉదరం, స్తనాలు', bn: 'বুক, হৃদয়, পাকস্থলী, স্তন', kn: 'ಎದೆ, ಹೃದಯ, ಹೊಟ್ಟೆ, ಸ್ತನಗಳು', gu: 'છાતી, હૃદય, પેટ, સ્તન' } },
  { id: 5, sign: { en: 'Leo', hi: 'सिंह', sa: 'सिंह', mai: 'सिंह', mr: 'सिंह', ta: 'சிம்மம்', te: 'సింహం', bn: 'সিংহ', kn: 'ಸಿಂಹ', gu: 'સિંહ' }, part: { en: 'Upper abdomen, spine, heart', hi: 'ऊपरी उदर, रीढ़, हृदय', sa: 'ऊपरी उदर, रीढ़, हृदय', mai: 'ऊपरी उदर, रीढ़, हृदय', mr: 'ऊपरी उदर, रीढ़, हृदय', ta: 'மேல் வயிறு, முதுகுத்தண்டு, இதயம்', te: 'ఎగువ ఉదరం, వెన్నెముక, హృదయం', bn: 'উপরের পেট, মেরুদণ্ড, হৃদয়', kn: 'ಮೇಲಿನ ಹೊಟ್ಟೆ, ಬೆನ್ನುಮೂಳೆ, ಹೃದಯ', gu: 'ઉપરનું પેટ, કરોડરજ્જુ, હૃદય' } },
  { id: 6, sign: { en: 'Virgo', hi: 'कन्या', sa: 'कन्या', mai: 'कन्या', mr: 'कन्या', ta: 'கன்னி', te: 'కన్య', bn: 'কন্যা', kn: 'ಕನ್ಯಾ', gu: 'કન્યા' }, part: { en: 'Intestines, lower abdomen, waist', hi: 'आँतें, निचला उदर, कमर', sa: 'आँतें, निचला उदर, कमर', mai: 'आँतें, निचला उदर, कमर', mr: 'आँतें, निचला उदर, कमर', ta: 'குடல், கீழ் வயிறு, இடுப்பு', te: 'పేగులు, దిగువ ఉదరం, నడుము', bn: 'অন্ত্র, নিম্ন পেট, কোমর', kn: 'ಕರುಳು, ಕೆಳ ಹೊಟ್ಟೆ, ಸೊಂಟ', gu: 'આંતરડા, નીચેનું પેટ, કમર' } },
  { id: 7, sign: { en: 'Libra', hi: 'तुला', sa: 'तुला', mai: 'तुला', mr: 'तुला', ta: 'துலாம்', te: 'తులా', bn: 'তুলা', kn: 'ತುಲಾ', gu: 'તુલા' }, part: { en: 'Kidneys, lower back, bladder', hi: 'गुर्दे, पीठ का निचला भाग, मूत्राशय', sa: 'गुर्दे, पीठ का निचला भाग, मूत्राशय', mai: 'गुर्दे, पीठ का निचला भाग, मूत्राशय', mr: 'गुर्दे, पीठ का निचला भाग, मूत्राशय', ta: 'சிறுநீரகங்கள், கீழ் முதுகு, சிறுநீர்ப்பை', te: 'మూత్రపిండాలు, నడుము, మూత్రాశయం', bn: 'বৃক্ক, পিঠের নিচের অংশ, মূত্রাশয়', kn: 'ಮೂತ್ರಪಿಂಡಗಳು, ಕೆಳ ಬೆನ್ನು, ಮೂತ್ರಕೋಶ', gu: 'કિડની, નીચેની પીઠ, મૂત્રાશય' } },
  { id: 8, sign: { en: 'Scorpio', hi: 'वृश्चिक', sa: 'वृश्चिक', mai: 'वृश्चिक', mr: 'वृश्चिक', ta: 'விருச்சிகம்', te: 'వృశ్చికం', bn: 'বৃশ্চিক', kn: 'ವೃಶ್ಚಿಕ', gu: 'વૃશ્ચિક' }, part: { en: 'Reproductive organs, pelvis', hi: 'प्रजनन अंग, श्रोणि', sa: 'प्रजनन अंग, श्रोणि', mai: 'प्रजनन अंग, श्रोणि', mr: 'प्रजनन अंग, श्रोणि', ta: 'இனப்பெருக்க உறுப்புகள், இடுப்பெலும்பு', te: 'ప్రత్యుత్పత్తి అవయవాలు, పల్వి', bn: 'প্রজনন অঙ্গ, শ্রোণী', kn: 'ಸಂತಾನೋತ್ಪತ್ತಿ ಅಂಗಗಳು, ಶ್ರೋಣಿ', gu: 'પ્રજનન અંગો, શ્રોણિ' } },
  { id: 9, sign: { en: 'Sagittarius', hi: 'धनु', sa: 'धनु', mai: 'धनु', mr: 'धनु', ta: 'தனுசு', te: 'ధనుస్సు', bn: 'ধনু', kn: 'ಧನು', gu: 'ધનુ' }, part: { en: 'Thighs, hips, liver', hi: 'जाँघें, कूल्हे, यकृत', sa: 'जाँघें, कूल्हे, यकृत', mai: 'जाँघें, कूल्हे, यकृत', mr: 'जाँघें, कूल्हे, यकृत', ta: 'தொடைகள், இடுப்பு, கல்லீரல்', te: 'తొడలు, పిరుదులు, కాలేయం', bn: 'উরু, নিতম্ব, যকৃৎ', kn: 'ತೊಡೆಗಳು, ಸೊಂಟ, ಯಕೃತ್', gu: 'જાંઘ, નિતંબ, યકૃત' } },
  { id: 10, sign: { en: 'Capricorn', hi: 'मकर', sa: 'मकर', mai: 'मकर', mr: 'मकर', ta: 'மகரம்', te: 'మకరం', bn: 'মকর', kn: 'ಮಕರ', gu: 'મકર' }, part: { en: 'Knees, joints, bones, skin', hi: 'घुटने, जोड़, हड्डियाँ, त्वचा', sa: 'घुटने, जोड़, हड्डियाँ, त्वचा', mai: 'घुटने, जोड़, हड्डियाँ, त्वचा', mr: 'घुटने, जोड़, हड्डियाँ, त्वचा', ta: 'முழங்கால்கள், மூட்டுகள், எலும்புகள், தோல்', te: 'మోకాళ్ళు, కీళ్ళు, ఎముకలు, చర్మం', bn: 'হাঁটু, জয়েন্ট, হাড়, ত্বক', kn: 'ಮೊಣಕಾಲುಗಳು, ಕೀಲುಗಳು, ಮೂಳೆಗಳು, ಚರ್ಮ', gu: 'ઘૂંટણ, સાંધા, હાડકાં, ત્વચા' } },
  { id: 11, sign: { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भ', mai: 'कुम्भ', mr: 'कुम्भ', ta: 'கும்பம்', te: 'కుంభం', bn: 'কুম্ভ', kn: 'ಕುಂಭ', gu: 'કુંભ' }, part: { en: 'Calves, ankles, circulation', hi: 'पिण्डली, टखने, रक्त संचार', sa: 'पिण्डली, टखने, रक्त संचार', mai: 'पिण्डली, टखने, रक्त संचार', mr: 'पिण्डली, टखने, रक्त संचार', ta: 'கால் தசைகள், கணுக்கால்கள், இரத்த ஓட்டம்', te: 'పిక్కలు, చీలమండలు, రక్తప్రసరణ', bn: 'পায়ের পেশী, গোড়ালি, রক্তসঞ্চালন', kn: 'ಮೊಣಕಾಲಿನ ಕೆಳಭಾಗ, ಹಿಮ್ಮಡಿ, ರಕ್ತಪರಿಚಲನೆ', gu: 'પિંડી, ઘૂંટી, રક્તપરિભ્રમણ' } },
  { id: 12, sign: { en: 'Pisces', hi: 'मीन', sa: 'मीन', mai: 'मीन', mr: 'मीन', ta: 'மீனம்', te: 'మీనం', bn: 'মীন', kn: 'ಮೀನ', gu: 'મીન' }, part: { en: 'Feet, toes, lymphatic system', hi: 'पैर, अँगुलियाँ, लसीका तन्त्र', sa: 'पैर, अँगुलियाँ, लसीका तन्त्र', mai: 'पैर, अँगुलियाँ, लसीका तन्त्र', mr: 'पैर, अँगुलियाँ, लसीका तन्त्र', ta: 'பாதங்கள், கால்விரல்கள், நிணநீர் மண்டலம்', te: 'పాదాలు, కాలి వేళ్ళు, శోషరస వ్యవస్థ', bn: 'পা, পায়ের আঙুল, লসিকা তন্ত্র', kn: 'ಪಾದಗಳು, ಕಾಲ್ಬೆರಳುಗಳು, ದುಗ್ಧರಸ ವ್ಯವಸ್ಥೆ', gu: 'પગ, અંગૂઠા, લસિકા તંત્ર' } },
];

/* ---------- interpretation rules ---------- */
const INTERP_RULES = [
  {
    category: { en: 'Planets in Fire Signs', hi: 'अग्नि राशि में ग्रह', sa: 'अग्नि राशि में ग्रह', mai: 'अग्नि राशि में ग्रह', mr: 'अग्नि राशि में ग्रह', ta: 'Planets in Fire Signs', te: 'Planets in Fire Signs', bn: 'Planets in Fire Signs', kn: 'Planets in Fire Signs', gu: 'Planets in Fire Signs' },
    color: 'text-red-400',
    border: 'border-red-400/20 bg-red-400/5',
    rules: {
      en: 'Benefics (Jupiter, Venus) become enthusiastic and generous but may overpromise. Malefics (Mars, Saturn) become aggressive and domineering. The Sun is strongest here (especially in Aries). Mars is comfortable as it rules Aries. Saturn struggles in fire signs — discipline clashes with impulsiveness.',
      hi: 'शुभ ग्रह (गुरु, शुक्र) उत्साही और उदार बनते हैं। पाप ग्रह (मंगल, शनि) आक्रामक बनते हैं। सूर्य यहाँ सबसे बलवान है (विशेषकर मेष में)। शनि अग्नि राशियों में कठिनाई अनुभव करता है।',
    },
  },
  {
    category: { en: 'Planets in Earth Signs', hi: 'पृथ्वी राशि में ग्रह', sa: 'पृथ्वी राशि में ग्रह', mai: 'पृथ्वी राशि में ग्रह', mr: 'पृथ्वी राशि में ग्रह', ta: 'Planets in Earth Signs', te: 'Planets in Earth Signs', bn: 'Planets in Earth Signs', kn: 'Planets in Earth Signs', gu: 'Planets in Earth Signs' },
    color: 'text-emerald-400',
    border: 'border-emerald-400/20 bg-emerald-400/5',
    rules: {
      en: 'Benefics produce material wealth and practical wisdom. Malefics bring hard work and delayed rewards. Mercury excels (especially in Virgo, its exaltation sign). Venus is grounded and sensual in Taurus. Saturn thrives — discipline meets practicality. Moon can feel restricted, craving emotional freedom.',
      hi: 'शुभ ग्रह भौतिक सम्पत्ति और व्यावहारिक ज्ञान देते हैं। पाप ग्रह कठिन परिश्रम और विलम्बित फल लाते हैं। बुध उत्कृष्ट रहता है (विशेषकर कन्या में)। शनि फलता-फूलता है — अनुशासन व्यावहारिकता से मिलता है।',
    },
  },
  {
    category: { en: 'Planets in Air Signs', hi: 'वायु राशि में ग्रह', sa: 'वायु राशि में ग्रह', mai: 'वायु राशि में ग्रह', mr: 'वायु राशि में ग्रह', ta: 'Planets in Air Signs', te: 'Planets in Air Signs', bn: 'Planets in Air Signs', kn: 'Planets in Air Signs', gu: 'Planets in Air Signs' },
    color: 'text-sky-400',
    border: 'border-sky-400/20 bg-sky-400/5',
    rules: {
      en: 'Benefics enhance social grace and intellectual charm. Malefics can create mental restlessness and sharp speech. Mercury thrives with enhanced communication. Venus is refined and diplomatic (especially in Libra). Saturn in Libra is exalted — justice meets structure. Mars loses some force, becoming more strategic than physical.',
      hi: 'शुभ ग्रह सामाजिक शिष्टाचार और बौद्धिक आकर्षण बढ़ाते हैं। पाप ग्रह मानसिक बेचैनी पैदा कर सकते हैं। बुध संवाद शक्ति बढ़ाकर फलता है। शनि तुला में उच्च — न्याय संरचना से मिलता है।',
    },
  },
  {
    category: { en: 'Planets in Water Signs', hi: 'जल राशि में ग्रह', sa: 'जल राशि में ग्रह', mai: 'जल राशि में ग्रह', mr: 'जल राशि में ग्रह', ta: 'Planets in Water Signs', te: 'Planets in Water Signs', bn: 'Planets in Water Signs', kn: 'Planets in Water Signs', gu: 'Planets in Water Signs' },
    color: 'text-blue-400',
    border: 'border-blue-400/20 bg-blue-400/5',
    rules: {
      en: 'Benefics become deeply compassionate and spiritually inclined. Jupiter is exalted in Cancer — wisdom meets nurturing. Venus is exalted in Pisces — love reaches its highest expression. Malefics here intensify emotions: Mars in Scorpio is powerful but obsessive; Saturn in water signs creates emotional heaviness and fear. Moon is at home in Cancer.',
      hi: 'शुभ ग्रह गहराई से दयालु और आध्यात्मिक रूप से उन्मुख बनते हैं। गुरु कर्क में उच्च — ज्ञान पालन-पोषण से मिलता है। शुक्र मीन में उच्च। पाप ग्रह यहाँ भावनाओं को तीव्र करते हैं। चन्द्रमा कर्क में स्वगृह में है।',
    },
  },
];

/* ---------- misconceptions ---------- */
const MYTHS = [
  {
    myth: {
      en: '"My Western sign is my real sign"',
      hi: '"मेरी पश्चिमी राशि ही मेरी असली राशि है"',
    },
    fact: {
      en: 'Vedic and Western astrology use different zodiacs. Neither is "wrong" — they measure different things. The Vedic sidereal zodiac is star-based and approximately 24 degrees behind the tropical zodiac. Your Vedic Moon sign (Rashi) is the primary identity, not the Sun sign as in Western astrology.',
      hi: 'वैदिक और पश्चिमी ज्योतिष अलग-अलग राशिचक्रों का उपयोग करते हैं। कोई भी "गलत" नहीं है। वैदिक निरयण राशिचक्र तारा-आधारित है और सायन राशिचक्र से लगभग 24 अंश पीछे है। वैदिक ज्योतिष में चन्द्र राशि प्राथमिक पहचान है, सूर्य राशि नहीं।',
    },
  },
  {
    myth: {
      en: '"Certain signs are inherently bad or good"',
      hi: '"कुछ राशियाँ स्वाभाविक रूप से बुरी या अच्छी होती हैं"',
    },
    fact: {
      en: 'No Rashi is inherently malefic or benefic. Scorpio is often feared, but it also signifies depth, research, and transformation. Each sign has strengths and challenges. What matters is the condition of the sign\'s lord, planets placed there, and aspects received — not the sign itself in isolation.',
      hi: 'कोई भी राशि स्वाभाविक रूप से पाप या शुभ नहीं है। वृश्चिक से अक्सर डर लगता है, लेकिन यह गहराई, शोध और परिवर्तन का भी प्रतीक है। प्रत्येक राशि की ताकत और चुनौतियाँ हैं। महत्वपूर्ण यह है कि राशि के स्वामी, वहाँ स्थित ग्रह और प्राप्त दृष्टि कैसी है।',
    },
  },
  {
    myth: {
      en: '"Vedic signs are the same as constellations"',
      hi: '"वैदिक राशियाँ नक्षत्रों (तारामण्डलों) के समान हैं"',
    },
    fact: {
      en: 'Rashis are equal 30-degree divisions of the ecliptic; constellations are unequal star patterns that merely lend their names. The constellation Virgo spans about 44 degrees, while Rashi Kanya (Virgo) is exactly 30 degrees. Vedic astrology uses Nakshatras (lunar mansions of 13.33 degrees each) for finer stellar divisions, which are separate from Rashis.',
      hi: 'राशियाँ ज्योतिषीय पथ के समान 30-अंश विभाजन हैं; तारामण्डल असमान तारा प्रतिरूप हैं जो केवल अपने नाम देते हैं। तारामण्डल कन्या लगभग 44 अंश में फैली है, जबकि राशि कन्या ठीक 30 अंश है।',
    },
  },
  {
    myth: {
      en: '"Rahu and Ketu own signs like other planets"',
      hi: '"राहु और केतु अन्य ग्रहों की तरह राशियों के स्वामी हैं"',
    },
    fact: {
      en: 'In classical Parashari Jyotish, Rahu and Ketu do not own any Rashi. They are shadow planets (chaya grahas) — mathematical points where the Moon\'s orbit intersects the ecliptic. Some modern schools assign co-rulership (Rahu with Aquarius, Ketu with Scorpio), but this is not universally accepted in traditional texts like BPHS.',
      hi: 'शास्त्रीय पाराशरी ज्योतिष में राहु और केतु किसी राशि के स्वामी नहीं हैं। ये छाया ग्रह हैं — गणितीय बिन्दु जहाँ चन्द्रमा की कक्षा क्रान्तिवृत्त को काटती है। कुछ आधुनिक विद्यालय सह-स्वामित्व देते हैं, लेकिन यह परम्परागत ग्रन्थों में सार्वभौमिक रूप से स्वीकृत नहीं है।',
    },
  },
];

/* ---------- rashi characteristics (en/hi) ---------- */
const RASHI_CHARS: Record<number, { traits: Record<string, string>; keywords: Record<string, string> }> = {
  1: { traits: { en: 'Courageous, pioneering, impatient, independent. Natural leader with fiery temperament. First sign — represents new beginnings, the self, and raw initiative.', hi: 'साहसी, अग्रणी, अधीर, स्वतन्त्र। अग्नि स्वभाव का प्राकृतिक नेता। प्रथम राशि — नई शुरुआत, आत्मा और कच्ची पहल का प्रतिनिधित्व।', sa: 'साहसी, अग्रणी, अधीर, स्वतन्त्र। अग्नि स्वभाव का प्राकृतिक नेता। प्रथम राशि — नई शुरुआत, आत्मा और कच्ची पहल का प्रतिनिधित्व।', mai: 'साहसी, अग्रणी, अधीर, स्वतन्त्र। अग्नि स्वभाव का प्राकृतिक नेता। प्रथम राशि — नई शुरुआत, आत्मा और कच्ची पहल का प्रतिनिधित्व।', mr: 'साहसी, अग्रणी, अधीर, स्वतन्त्र। अग्नि स्वभाव का प्राकृतिक नेता। प्रथम राशि — नई शुरुआत, आत्मा और कच्ची पहल का प्रतिनिधित्व।', ta: 'Courageous, pioneering, impatient, independent. Natural leader with fiery temperament. First sign — represents new beginnings, the self, and raw initiative.', te: 'Courageous, pioneering, impatient, independent. Natural leader with fiery temperament. First sign — represents new beginnings, the self, and raw initiative.', bn: 'Courageous, pioneering, impatient, independent. Natural leader with fiery temperament. First sign — represents new beginnings, the self, and raw initiative.', kn: 'Courageous, pioneering, impatient, independent. Natural leader with fiery temperament. First sign — represents new beginnings, the self, and raw initiative.', gu: 'Courageous, pioneering, impatient, independent. Natural leader with fiery temperament. First sign — represents new beginnings, the self, and raw initiative.' }, keywords: { en: 'Initiative, energy, self', hi: 'पहल, ऊर्जा, स्व', sa: 'पहल, ऊर्जा, स्व', mai: 'पहल, ऊर्जा, स्व', mr: 'पहल, ऊर्जा, स्व', ta: 'முன்னெடுப்பு, ஆற்றல், சுயம்', te: 'చొరవ, శక్తి, ఆత్మ', bn: 'উদ্যম, শক্তি, স্বয়ং', kn: 'ಉಪಕ್ರಮ, ಶಕ್ತಿ, ಸ್ವಯಂ', gu: 'પહેલ, શક્તિ, સ્વયં' } },
  2: { traits: { en: 'Stable, sensual, possessive, artistic. Values material comfort and beauty. Strongest earth sign — represents wealth, family, and sensory pleasure.', hi: 'स्थिर, इन्द्रियप्रिय, अधिकारशील, कलात्मक। भौतिक सुख और सौन्दर्य को महत्व देता है। सबसे मजबूत पृथ्वी राशि — धन, परिवार और संवेदी सुख।', sa: 'स्थिर, इन्द्रियप्रिय, अधिकारशील, कलात्मक। भौतिक सुख और सौन्दर्य को महत्व देता है। सबसे मजबूत पृथ्वी राशि — धन, परिवार और संवेदी सुख।', mai: 'स्थिर, इन्द्रियप्रिय, अधिकारशील, कलात्मक। भौतिक सुख और सौन्दर्य को महत्व देता है। सबसे मजबूत पृथ्वी राशि — धन, परिवार और संवेदी सुख।', mr: 'स्थिर, इन्द्रियप्रिय, अधिकारशील, कलात्मक। भौतिक सुख और सौन्दर्य को महत्व देता है। सबसे मजबूत पृथ्वी राशि — धन, परिवार और संवेदी सुख।', ta: 'Stable, sensual, possessive, artistic. Values material comfort and beauty. Strongest earth sign — represents wealth, family, and sensory pleasure.', te: 'Stable, sensual, possessive, artistic. Values material comfort and beauty. Strongest earth sign — represents wealth, family, and sensory pleasure.', bn: 'Stable, sensual, possessive, artistic. Values material comfort and beauty. Strongest earth sign — represents wealth, family, and sensory pleasure.', kn: 'Stable, sensual, possessive, artistic. Values material comfort and beauty. Strongest earth sign — represents wealth, family, and sensory pleasure.', gu: 'Stable, sensual, possessive, artistic. Values material comfort and beauty. Strongest earth sign — represents wealth, family, and sensory pleasure.' }, keywords: { en: 'Wealth, beauty, stability', hi: 'धन, सौन्दर्य, स्थिरता', sa: 'धन, सौन्दर्य, स्थिरता', mai: 'धन, सौन्दर्य, स्थिरता', mr: 'धन, सौन्दर्य, स्थिरता', ta: 'செல்வம், அழகு, நிலைப்பு', te: 'సంపద, అందం, స్థిరత్వం', bn: 'সম্পদ, সৌন্দর্য, স্থিরতা', kn: 'ಸಂಪತ್ತು, ಸೌಂದರ್ಯ, ಸ್ಥಿರತೆ', gu: 'સંપત્તિ, સૌંદર્ય, સ્થિરતા' } },
  3: { traits: { en: 'Curious, communicative, versatile, restless. Twin-natured sign of intellect and duality. Masters of language, trade, and information exchange.', hi: 'जिज्ञासु, संवादी, बहुमुखी, बेचैन। बुद्धि और द्वैत की जुड़वाँ प्रकृति वाली राशि। भाषा, व्यापार और सूचना विनिमय के स्वामी।', sa: 'जिज्ञासु, संवादी, बहुमुखी, बेचैन। बुद्धि और द्वैत की जुड़वाँ प्रकृति वाली राशि। भाषा, व्यापार और सूचना विनिमय के स्वामी।', mai: 'जिज्ञासु, संवादी, बहुमुखी, बेचैन। बुद्धि और द्वैत की जुड़वाँ प्रकृति वाली राशि। भाषा, व्यापार और सूचना विनिमय के स्वामी।', mr: 'जिज्ञासु, संवादी, बहुमुखी, बेचैन। बुद्धि और द्वैत की जुड़वाँ प्रकृति वाली राशि। भाषा, व्यापार और सूचना विनिमय के स्वामी।', ta: 'Curious, communicative, versatile, restless. Twin-natured sign of intellect and duality. Masters of language, trade, and information exchange.', te: 'Curious, communicative, versatile, restless. Twin-natured sign of intellect and duality. Masters of language, trade, and information exchange.', bn: 'Curious, communicative, versatile, restless. Twin-natured sign of intellect and duality. Masters of language, trade, and information exchange.', kn: 'Curious, communicative, versatile, restless. Twin-natured sign of intellect and duality. Masters of language, trade, and information exchange.', gu: 'Curious, communicative, versatile, restless. Twin-natured sign of intellect and duality. Masters of language, trade, and information exchange.' }, keywords: { en: 'Communication, duality, intellect', hi: 'संवाद, द्वैत, बुद्धि', sa: 'संवाद, द्वैत, बुद्धि', mai: 'संवाद, द्वैत, बुद्धि', mr: 'संवाद, द्वैत, बुद्धि', ta: 'தொடர்பு, இருமை, புத்தி', te: 'సంభాషణ, ద్వైతం, బుద్ధి', bn: 'যোগাযোগ, দ্বৈত, বুদ্ধি', kn: 'ಸಂವಹನ, ದ್ವೈತ, ಬುದ್ಧಿ', gu: 'સંવાદ, દ્વૈત, બુદ્ધિ' } },
  4: { traits: { en: 'Nurturing, emotional, protective, intuitive. The mother of the zodiac — deeply connected to home, family, and emotional security. Moon\'s own sign.', hi: 'पालनकर्ता, भावनात्मक, रक्षात्मक, अन्तर्ज्ञानी। राशिचक्र की माता — घर, परिवार और भावनात्मक सुरक्षा से गहराई से जुड़ी। चन्द्रमा की स्वराशि।' }, keywords: { en: 'Nurturing, home, emotions', hi: 'पालन, गृह, भावनाएँ', sa: 'पालन, गृह, भावनाएँ', mai: 'पालन, गृह, भावनाएँ', mr: 'पालन, गृह, भावनाएँ', ta: 'பாதுகாப்பு, இல்லம், உணர்வுகள்', te: 'పోషణ, గృహం, భావాలు', bn: 'লালন-পালন, গৃহ, আবেগ', kn: 'ಪೋಷಣೆ, ಮನೆ, ಭಾವನೆಗಳು', gu: 'પાલન-પોષણ, ઘર, લાગણીઓ' } },
  5: { traits: { en: 'Regal, creative, proud, generous. The king of the zodiac — natural authority, creative expression, and dramatic flair. Sun\'s own sign — brightest and most confident.', hi: 'राजसी, सृजनशील, गर्वित, उदार। राशिचक्र का राजा — प्राकृतिक अधिकार, सृजनात्मक अभिव्यक्ति। सूर्य की स्वराशि — सबसे उज्ज्वल और आत्मविश्वासी।' }, keywords: { en: 'Authority, creativity, pride', hi: 'अधिकार, सृजनशीलता, गर्व', sa: 'अधिकार, सृजनशीलता, गर्व', mai: 'अधिकार, सृजनशीलता, गर्व', mr: 'अधिकार, सृजनशीलता, गर्व', ta: 'அதிகாரம், படைப்பு, பெருமை', te: 'అధికారం, సృజనాత్మకత, గర్వం', bn: 'কর্তৃত্ব, সৃজনশীলতা, গর্ব', kn: 'ಅಧಿಕಾರ, ಸೃಜನಶೀಲತೆ, ಹೆಮ್ಮೆ', gu: 'સત્તા, સર્જનાત્મકતા, ગર્વ' } },
  6: { traits: { en: 'Analytical, service-oriented, perfectionist, critical. The healer and craftsman — excels in detail work, health, and systematic improvement. Mercury\'s exaltation sign.', hi: 'विश्लेषणात्मक, सेवा-उन्मुख, पूर्णतावादी, आलोचनात्मक। चिकित्सक और शिल्पी — विस्तृत कार्य, स्वास्थ्य में उत्कृष्ट। बुध की उच्च राशि।' }, keywords: { en: 'Analysis, service, perfection', hi: 'विश्लेषण, सेवा, पूर्णता', sa: 'विश्लेषण, सेवा, पूर्णता', mai: 'विश्लेषण, सेवा, पूर्णता', mr: 'विश्लेषण, सेवा, पूर्णता', ta: 'பகுப்பாய்வு, சேவை, நிறைவு', te: 'విశ్లేషణ, సేవ, పరిపూర్ణత', bn: 'বিশ্লেষণ, সেবা, পূর্ণতা', kn: 'ವಿಶ್ಲೇಷಣೆ, ಸೇವೆ, ಪರಿಪೂರ್ಣತೆ', gu: 'વિશ્લેષણ, સેવા, પૂર્ણતા' } },
  7: { traits: { en: 'Diplomatic, balanced, relationship-focused, aesthetic. The sign of partnerships and justice. Venus\'s own sign — beauty, harmony, and fair dealing. Saturn\'s exaltation sign.', hi: 'कूटनीतिक, सन्तुलित, सम्बन्ध-केन्द्रित, सौन्दर्यपरक। साझेदारी और न्याय की राशि। शुक्र की स्वराशि — सौन्दर्य, सामंजस्य। शनि की उच्च राशि।' }, keywords: { en: 'Balance, partnership, justice', hi: 'सन्तुलन, साझेदारी, न्याय', sa: 'सन्तुलन, साझेदारी, न्याय', mai: 'सन्तुलन, साझेदारी, न्याय', mr: 'सन्तुलन, साझेदारी, न्याय', ta: 'சமநிலை, கூட்டு, நீதி', te: 'సమతుల్యత, భాగస్వామ్యం, న్యాయం', bn: 'ভারসাম্য, অংশীদারিত্ব, ন্যায়', kn: 'ಸಮತೋಲನ, ಪಾಲುದಾರಿಕೆ, ನ್ಯಾಯ', gu: 'સંતુલન, ભાગીદારી, ન્યાય' } },
  8: { traits: { en: 'Intense, secretive, transformative, powerful. The sign of hidden depths — death, rebirth, occult knowledge, and research. Mars\'s second sign — controlled power.', hi: 'तीव्र, गूढ़, परिवर्तनकारी, शक्तिशाली। छिपी गहराइयों की राशि — मृत्यु, पुनर्जन्म, गूढ़ ज्ञान, और शोध। मंगल की दूसरी राशि — नियन्त्रित शक्ति।' }, keywords: { en: 'Transformation, depth, secrets', hi: 'परिवर्तन, गहराई, रहस्य', sa: 'परिवर्तन, गहराई, रहस्य', mai: 'परिवर्तन, गहराई, रहस्य', mr: 'परिवर्तन, गहराई, रहस्य', ta: 'மாற்றம், ஆழம், ரகசியங்கள்', te: 'పరివర్తన, లోతు, రహస్యాలు', bn: 'রূপান্তর, গভীরতা, রহস্য', kn: 'ಪರಿವರ್ತನೆ, ಆಳ, ರಹಸ್ಯಗಳು', gu: 'પરિવર્તન, ઊંડાણ, રહસ્યો' } },
  9: { traits: { en: 'Philosophical, optimistic, adventurous, righteous. The sign of dharma, higher learning, and long journeys. Jupiter\'s own sign — expansion of wisdom and fortune.', hi: 'दार्शनिक, आशावादी, साहसी, धर्मपरायण। धर्म, उच्च शिक्षा और लम्बी यात्राओं की राशि। बृहस्पति की स्वराशि — ज्ञान और भाग्य का विस्तार।' }, keywords: { en: 'Dharma, wisdom, expansion', hi: 'धर्म, ज्ञान, विस्तार', sa: 'धर्म, ज्ञान, विस्तार', mai: 'धर्म, ज्ञान, विस्तार', mr: 'धर्म, ज्ञान, विस्तार', ta: 'தர்மம், ஞானம், விரிவு', te: 'ధర్మం, జ్ఞానం, విస్తరణ', bn: 'ধর্ম, জ্ঞান, বিস্তার', kn: 'ಧರ್ಮ, ಜ್ಞಾನ, ವಿಸ್ತರಣೆ', gu: 'ધર્મ, જ્ઞાન, વિસ્તાર' } },
  10: { traits: { en: 'Ambitious, disciplined, pragmatic, structured. The sign of karma, career, and worldly achievement. Saturn\'s own sign — slow but sure rise to authority. Mars\'s exaltation sign.', hi: 'महत्वाकांक्षी, अनुशासित, व्यावहारिक, संरचित। कर्म, व्यवसाय और सांसारिक उपलब्धि की राशि। शनि की स्वराशि — धीमा लेकिन निश्चित उत्थान। मंगल की उच्च राशि।' }, keywords: { en: 'Career, discipline, authority', hi: 'कर्म, अनुशासन, अधिकार', sa: 'कर्म, अनुशासन, अधिकार', mai: 'कर्म, अनुशासन, अधिकार', mr: 'कर्म, अनुशासन, अधिकार', ta: 'தொழில், ஒழுக்கம், அதிகாரம்', te: 'వృత్తి, క్రమశిక్షణ, అధికారం', bn: 'কর্মজীবন, শৃঙ্খলা, কর্তৃত্ব', kn: 'ವೃತ್ತಿ, ಶಿಸ್ತು, ಅಧಿಕಾರ', gu: 'કારકિર્દી, અનુશાસન, સત્તા' } },
  11: { traits: { en: 'Unconventional, humanitarian, intellectual, detached. The sign of networks, aspirations, and collective welfare. Saturn\'s second sign — structure applied to social ideals.', hi: 'अपारम्परिक, मानवतावादी, बौद्धिक, अनासक्त। सम्पर्कों, आकांक्षाओं और सामूहिक कल्याण की राशि। शनि की दूसरी राशि — सामाजिक आदर्शों में संरचना।' }, keywords: { en: 'Networks, ideals, innovation', hi: 'सम्पर्क, आदर्श, नवाचार', sa: 'सम्पर्क, आदर्श, नवाचार', mai: 'सम्पर्क, आदर्श, नवाचार', mr: 'सम्पर्क, आदर्श, नवाचार', ta: 'நெட்வொர்க், இலட்சியங்கள், புதுமை', te: 'నెట్‌వర్క్‌లు, ఆదర్శాలు, ఆవిష్కరణ', bn: 'নেটওয়ার্ক, আদর্শ, উদ্ভাবন', kn: 'ನೆಟ್‌ವರ್ಕ್‌ಗಳು, ಆದರ್ಶಗಳು, ನಾವೀನ್ಯ', gu: 'નેટવર્ક, આદર્શો, નવીનતા' } },
  12: { traits: { en: 'Spiritual, imaginative, compassionate, dissolving. The final sign — represents liberation (moksha), foreign lands, and surrender. Jupiter\'s second sign — wisdom turned inward. Venus\'s exaltation sign.', hi: 'आध्यात्मिक, कल्पनाशील, दयालु, विलीन। अन्तिम राशि — मोक्ष, विदेश और समर्पण का प्रतिनिधित्व। बृहस्पति की दूसरी राशि — अन्तर्मुखी ज्ञान। शुक्र की उच्च राशि।' }, keywords: { en: 'Moksha, imagination, surrender', hi: 'मोक्ष, कल्पना, समर्पण', sa: 'मोक्ष, कल्पना, समर्पण', mai: 'मोक्ष, कल्पना, समर्पण', mr: 'मोक्ष, कल्पना, समर्पण', ta: 'மோக்ஷம், கற்பனை, சரணாகதி', te: 'మోక్షం, ఊహ, శరణాగతి', bn: 'মোক্ষ, কল্পনা, আত্মসমর্পণ', kn: 'ಮೋಕ್ಷ, ಕಲ್ಪನೆ, ಶರಣಾಗತಿ', gu: 'મોક્ષ, કલ્પના, સમર્પણ' } },
};

/* ---------- element color for badges ---------- */
const elementColor: Record<string, string> = {
  Fire: 'text-red-400',
  Earth: 'text-emerald-400',
  Air: 'text-sky-400',
  Water: 'text-blue-400',
};
const elementBg: Record<string, string> = {
  Fire: 'bg-red-400/10 border-red-400/20',
  Earth: 'bg-emerald-400/10 border-emerald-400/20',
  Air: 'bg-sky-400/10 border-sky-400/20',
  Water: 'bg-blue-400/10 border-blue-400/20',
};

/* ---------- Cross-reference links ---------- */
const CROSS_REFS = [
  { href: '/learn/grahas' as const, label: { en: 'Grahas — The Nine Planets', hi: 'ग्रह — नौ ग्रह', sa: 'ग्रह — नौ ग्रह', mai: 'ग्रह — नौ ग्रह', mr: 'ग्रह — नौ ग्रह', ta: 'கிரகங்கள் — நவக்கிரகம்', te: 'గ్రహాలు — నవగ్రహం', bn: 'গ্রহসমূহ — নবগ্রহ', kn: 'ಗ್ರಹಗಳು — ನವಗ್ರಹ', gu: 'ગ્રહો — નવગ્રહ' }, desc: { en: 'How planets interact with signs', hi: 'ग्रह राशियों से कैसे अन्तर्क्रिया करते हैं', sa: 'ग्रह राशियों से कैसे अन्तर्क्रिया करते हैं', mai: 'ग्रह राशियों से कैसे अन्तर्क्रिया करते हैं', mr: 'ग्रह राशियों से कैसे अन्तर्क्रिया करते हैं', ta: 'How planets interact with signs', te: 'How planets interact with signs', bn: 'How planets interact with signs', kn: 'How planets interact with signs', gu: 'How planets interact with signs' } },
  { href: '/learn/bhavas' as const, label: { en: 'Bhavas — The 12 Houses', hi: 'भाव — 12 भाव', sa: 'भाव — 12 भाव', mai: 'भाव — 12 भाव', mr: 'भाव — 12 भाव', ta: 'பாவங்கள் — 12 பாவங்கள்', te: 'భావాలు — 12 భావాలు', bn: 'ভাব — ১২টি ভাব', kn: 'ಭಾವಗಳು — 12 ಭಾವಗಳು', gu: 'ભાવો — 12 ભાવો' }, desc: { en: 'How signs become houses in a chart', hi: 'कुण्डली में राशियाँ कैसे भाव बनती हैं', sa: 'कुण्डली में राशियाँ कैसे भाव बनती हैं', mai: 'कुण्डली में राशियाँ कैसे भाव बनती हैं', mr: 'कुण्डली में राशियाँ कैसे भाव बनती हैं', ta: 'How signs become houses in a chart', te: 'How signs become houses in a chart', bn: 'How signs become houses in a chart', kn: 'How signs become houses in a chart', gu: 'How signs become houses in a chart' } },
  { href: '/learn/nakshatras' as const, label: { en: 'Nakshatras — Lunar Mansions', hi: 'नक्षत्र — चन्द्र गृह', sa: 'नक्षत्र — चन्द्र गृह', mai: 'नक्षत्र — चन्द्र गृह', mr: 'नक्षत्र — चन्द्र गृह', ta: 'நட்சத்திரங்கள் — சந்திர மாளிகைகள்', te: 'నక్షత్రాలు — చంద్ర భవనాలు', bn: 'নক্ষত্র — চন্দ্র ভবন', kn: 'ನಕ್ಷತ್ರಗಳು — ಚಂದ್ರ ಭವನಗಳು', gu: 'નક્ષત્રો — ચંદ્ર ભવનો' }, desc: { en: 'Finer stellar divisions within signs', hi: 'राशियों के भीतर सूक्ष्म तारा विभाजन', sa: 'राशियों के भीतर सूक्ष्म तारा विभाजन', mai: 'राशियों के भीतर सूक्ष्म तारा विभाजन', mr: 'राशियों के भीतर सूक्ष्म तारा विभाजन', ta: 'Finer stellar divisions within signs', te: 'Finer stellar divisions within signs', bn: 'Finer stellar divisions within signs', kn: 'Finer stellar divisions within signs', gu: 'Finer stellar divisions within signs' } },
  { href: '/learn/kundali' as const, label: { en: 'Kundali — Birth Chart', hi: 'कुण्डली — जन्म पत्रिका', sa: 'कुण्डली — जन्म पत्रिका', mai: 'कुण्डली — जन्म पत्रिका', mr: 'कुण्डली — जन्म पत्रिका', ta: 'குண்டலி — ஜாதகம்', te: 'కుండలి — జాతకం', bn: 'কুণ্ডলী — জন্ম কুণ্ডলী', kn: 'ಕುಂಡಲಿ — ಜಾತಕ', gu: 'કુંડળી — જન્મ કુંડળી' }, desc: { en: 'How signs, houses, and planets combine', hi: 'राशियाँ, भाव और ग्रह कैसे जुड़ते हैं', sa: 'राशियाँ, भाव और ग्रह कैसे जुड़ते हैं', mai: 'राशियाँ, भाव और ग्रह कैसे जुड़ते हैं', mr: 'राशियाँ, भाव और ग्रह कैसे जुड़ते हैं', ta: 'How signs, houses, and planets combine', te: 'How signs, houses, and planets combine', bn: 'How signs, houses, and planets combine', kn: 'How signs, houses, and planets combine', gu: 'How signs, houses, and planets combine' } },
];

/* ========== Component ========== */

export default function LearnRashisPage() {
  const t = (key: string) => lt(t_[key], locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tObj = (obj: any) => (obj as Record<string, string>)[locale] || obj?.en || '';
  const locale = useLocale();
  const loc = isIndicLocale(locale) ? 'hi' as const : 'en' as const; // fallback sa -> hi for longer content

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      {/* Sanskrit Key Terms */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Rashi" devanagari="राशि" transliteration="Rashi" meaning="Zodiac sign (heap/cluster)" />
        <SanskritTermCard term="Tattva" devanagari="तत्त्व" transliteration="Tattva" meaning="Element (fundamental nature)" />
        <SanskritTermCard term="Swami" devanagari="स्वामी" transliteration="Swami" meaning="Lord / Owner of a sign" />
        <SanskritTermCard term="Uccha" devanagari="उच्च" transliteration="Uccha" meaning="Exaltation (highest dignity)" />
      </div>

      {/* Section 1: What is a Rashi */}
      <LessonSection number={1} title={t('whatTitle')} illustration={<ZodiacBeltDiagram />}>
        <p>{t('whatContent')}</p>
        <p>{t('whatContent2')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Rashi = floor(sidereal_longitude / 30) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Sidereal longitude = Tropical longitude - Ayanamsha (~24.2 in 2026)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Example: Moon at tropical 151.3 - 24.2 = 127.1 sidereal; floor(127.1/30)+1 = 5 = Leo (Simha)</p>
        </div>
      </LessonSection>

      {/* Section 2: Astronomy */}
      <LessonSection number={2} title={t('astroTitle')}>
        <p>{t('astroContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">360 / 12 = 30 per Rashi</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Aries (Mesha): 0-30 | Taurus (Vrishabha): 30-60 | ... | Pisces (Meena): 330-360</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Each Rashi contains 2.25 Nakshatras (30 / 13.333 = 2.25)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Each Rashi contains 9 Navamsha padas (30 / 3.333 = 9)</p>
        </div>
      </LessonSection>

      {/* Section 3: Sign Qualities */}
      <LessonSection number={3} title={t('qualityTitle')}>
        <p>{t('qualityIntro')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {QUALITIES.map((q) => (
            <motion.div
              key={q.name.en}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl p-5 border ${q.border}`}
            >
              <h4 className={`font-bold text-lg ${q.color} mb-2`}>{q.name[loc]}</h4>
              <p className="text-gold-light/60 text-xs mb-3" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
                {q.signs[loc]}
              </p>
              <p className="text-text-secondary text-sm">{q.desc[loc]}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 4: Elements */}
      <LessonSection number={4} title={t('elementTitle')}>
        <p>{t('elementIntro')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {ELEMENTS.map((el) => (
            <motion.div
              key={el.name.en}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`rounded-xl p-5 border ${el.bgColor}`}
            >
              <h4 className={`font-bold text-lg ${el.color} mb-1`}>{el.name[loc]}</h4>
              <p className="text-gold-light/50 text-xs mb-3">{loc === 'hi' ? el.signsSa : el.signs}</p>
              <p className="text-text-secondary text-sm">{el.desc[loc]}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">{loc === 'en' ? 'Element Cycle Pattern:' : 'तत्व चक्र क्रम:'}</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            <span className="text-red-400">Fire</span> → <span className="text-emerald-400">Earth</span> → <span className="text-sky-400">Air</span> → <span className="text-blue-400">Water</span> → <span className="text-red-400">Fire</span> → ...
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {loc === 'en' ? 'Repeats 3 times across the 12 signs' : '12 राशियों में 3 बार दोहराता है'}
          </p>
        </div>
      </LessonSection>

      {/* Section 5: Lordship */}
      <LessonSection number={5} title={t('lordTitle')}>
        <p>{t('lordContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10 text-xs">
          <div className="grid grid-cols-3 gap-2 text-gold-light/80 font-mono">
            <div className="font-semibold text-gold-primary">{loc === 'en' ? 'Planet' : 'ग्रह'}</div>
            <div className="font-semibold text-gold-primary">{loc === 'en' ? 'Own Signs' : 'स्वराशि'}</div>
            <div className="font-semibold text-gold-primary">{loc === 'en' ? 'Moolatrikona' : 'मूलत्रिकोण'}</div>
            <div>Sun / {loc === 'hi' ? 'सूर्य' : 'Sun'}</div><div>Leo</div><div>Leo 0-20</div>
            <div>Moon / {loc === 'hi' ? 'चन्द्र' : 'Moon'}</div><div>Cancer</div><div>Taurus 4-30</div>
            <div>Mars / {loc === 'hi' ? 'मंगल' : 'Mars'}</div><div>Aries, Scorpio</div><div>Aries 0-12</div>
            <div>Mercury / {loc === 'hi' ? 'बुध' : 'Mercury'}</div><div>Gemini, Virgo</div><div>Virgo 16-20</div>
            <div>Jupiter / {loc === 'hi' ? 'बृहस्पति' : 'Jupiter'}</div><div>Sagittarius, Pisces</div><div>Sagittarius 0-10</div>
            <div>Venus / {loc === 'hi' ? 'शुक्र' : 'Venus'}</div><div>Taurus, Libra</div><div>Libra 0-15</div>
            <div>Saturn / {loc === 'hi' ? 'शनि' : 'Saturn'}</div><div>Capricorn, Aquarius</div><div>Aquarius 0-20</div>
          </div>
        </div>
      </LessonSection>

      {/* Section 6: Exaltation & Debilitation */}
      <LessonSection number={6} title={t('dignityTitle')}>
        <p>{t('dignityIntro')}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-primary border-b border-gold-primary/20">
                <th className="text-left py-2 px-3">{loc === 'en' ? 'Planet' : 'ग्रह'}</th>
                <th className="text-left py-2 px-3 text-emerald-400">{loc === 'en' ? 'Exaltation (Uccha)' : 'उच्च'}</th>
                <th className="text-left py-2 px-3 text-red-400">{loc === 'en' ? 'Debilitation (Neecha)' : 'नीच'}</th>
                <th className="text-left py-2 px-3 text-amber-400">{loc === 'en' ? 'Own Sign (Swakshetra)' : 'स्वक्षेत्र'}</th>
              </tr>
            </thead>
            <tbody>
              {DIGNITY_DATA.map((d) => (
                <tr key={d.planet.en} className="border-b border-gold-primary/5 text-text-secondary">
                  <td className="py-2 px-3 text-gold-light font-medium">{d.planet[loc]}</td>
                  <td className="py-2 px-3">{d.exaltSign[loc]}</td>
                  <td className="py-2 px-3">{d.debSign[loc]}</td>
                  <td className="py-2 px-3">{d.moolaSign[loc]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">{loc === 'en' ? 'Key Rule:' : 'मुख्य नियम:'}</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {loc === 'en'
              ? 'Exaltation and debilitation are always exactly 180 apart (7th sign from each other)'
              : 'उच्च और नीच सदैव ठीक 180° (एक-दूसरे से 7वीं राशि) दूर होते हैं'}
          </p>
        </div>
      </LessonSection>

      {/* Section 7: Body Parts */}
      <LessonSection number={7} title={t('bodyTitle')}>
        <p>{t('bodyContent')}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {BODY_PARTS.map((bp) => (
            <motion.div
              key={bp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: bp.id * 0.03 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 text-center"
            >
              <div className="text-gold-primary text-xs font-mono mb-1">{bp.id}</div>
              <div className="text-gold-light font-semibold text-sm">{bp.sign[loc]}</div>
              <div className="text-text-secondary text-xs mt-1">{bp.part[loc]}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">{loc === 'en' ? 'Kalapurusha Mapping:' : 'कालपुरुष मानचित्रण:'}</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {loc === 'en' ? 'Head (Aries/1) → Feet (Pisces/12) — top to bottom through the zodiac' : 'सिर (मेष/1) → पैर (मीन/12) — राशिचक्र में ऊपर से नीचे'}
          </p>
        </div>
      </LessonSection>

      {/* Section 8: Interpreting planets by sign category */}
      <LessonSection number={8} title={t('interpTitle')}>
        <p>{t('interpContent')}</p>
        <div className="space-y-4 mt-4">
          {INTERP_RULES.map((rule) => (
            <motion.div
              key={rule.category.en}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className={`rounded-xl p-5 border ${rule.border}`}
            >
              <h4 className={`font-bold ${rule.color} mb-2`}>{rule.category[loc]}</h4>
              <p className="text-text-secondary text-sm">{rule.rules[loc]}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 9: Common Misconceptions */}
      <LessonSection number={9} title={t('mythTitle')} variant="highlight">
        <div className="space-y-4">
          {MYTHS.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-lg p-4 border border-red-400/10 bg-red-400/5"
            >
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-sm flex-shrink-0 mt-0.5">{loc === 'en' ? 'MYTH' : 'भ्रान्ति'}</span>
                <div>
                  <p className="text-red-300 font-medium text-sm">{m.myth[loc]}</p>
                  <div className="mt-2 pl-3 border-l-2 border-emerald-400/30">
                    <span className="text-emerald-400 font-bold text-xs">{loc === 'en' ? 'FACT' : 'तथ्य'}</span>
                    <p className="text-text-secondary text-sm mt-1">{m.fact[loc]}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 10: All 12 Rashis — Detailed */}
      <LessonSection number={10} title={t('listTitle')}>
        <div className="space-y-4">
          {RASHIS.map((r, i) => {
            const chars = RASHI_CHARS[r.id];
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: i * 0.03 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5"
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl">{r.symbol}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gold-light font-bold text-lg">{tObj(r.name)}</span>
                      {locale !== 'en' && <span className="text-text-secondary/70 text-sm">({r.name.en})</span>}
                      <span className="text-text-secondary/65 text-xs font-mono">{r.startDeg}-{r.endDeg}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${elementBg[r.element.en] || ''} ${elementColor[r.element.en] || ''}`}>
                        {tObj(r.element)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full border border-gold-primary/20 bg-gold-primary/5 text-gold-primary">
                        {tObj(r.quality)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full border border-violet-400/20 bg-violet-400/5 text-violet-400">
                        {loc === 'en' ? 'Lord:' : 'स्वामी:'} {tObj(r.rulerName)}
                      </span>
                    </div>
                  </div>
                </div>
                {chars && (
                  <>
                    <p className="text-text-secondary text-sm mb-2">{chars.traits[loc]}</p>
                    <div className="text-xs text-gold-primary/60">
                      {loc === 'en' ? 'Keywords:' : 'मुख्य शब्द:'}{' '}
                      <span className="text-gold-light/70">{chars.keywords[loc]}</span>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* Cross-references */}
      <LessonSection title={t('crossTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CROSS_REFS.map((ref) => (
            <Link
              key={ref.href}
              href={ref.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 hover:border-gold-primary/30 transition-colors block"
            >
              <div className="text-gold-light font-semibold text-sm">{ref.label[loc]}</div>
              <div className="text-text-secondary text-xs mt-1">{ref.desc[loc]}</div>
            </Link>
          ))}
        </div>
      </LessonSection>

      {/* CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}

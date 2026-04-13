import type { LocaleText } from '@/types/panchang';
/* ════════════════════════════════════════════════════════════════
   Web Stories — 5 Google-optimized swipeable stories
   ════════════════════════════════════════════════════════════════ */

export interface StorySlide {
  type: 'title' | 'fact' | 'comparison' | 'quote' | 'cta';
  heading: LocaleText;
  body?: LocaleText;
  stat?: string;
  bgColor?: string;
  sourceText?: LocaleText;
}

export interface WebStory {
  slug: string;
  title: LocaleText;
  description: LocaleText;
  slides: StorySlide[];
  ctaUrl: string;
}

export const WEB_STORIES: WebStory[] = [
  /* ── Story 1: Sine is Sanskrit ── */
  {
    slug: 'sine-is-sanskrit',
    title: {
      en: 'Did You Know "Sine" Is Sanskrit?',
      hi: 'क्या आप जानते हैं "Sine" संस्कृत है?',
    },
    description: {
      en: 'The word "sine" comes from the Sanskrit word Jya meaning bowstring. Aryabhata created the first sine table in 499 CE.',
      hi: '"Sine" शब्द संस्कृत "ज्या" से आया है जिसका अर्थ है धनुष की प्रत्यंचा।',
    },
    ctaUrl: '/learn/contributions/sine',
    slides: [
      {
        type: 'title',
        heading: { en: 'DID YOU KNOW\n"SINE" IS SANSKRIT?', hi: 'क्या आप जानते हैं\n"SINE" संस्कृत है?', sa: 'क्या आप जानते हैं\n"SINE" संस्कृत है?', mai: 'क्या आप जानते हैं\n"SINE" संस्कृत है?', mr: 'क्या आप जानते हैं\n"SINE" संस्कृत है?', ta: 'DID YOU KNOW\n"SINE" IS SANSKRIT?', te: 'DID YOU KNOW\n"SINE" IS SANSKRIT?', bn: 'DID YOU KNOW\n"SINE" IS SANSKRIT?', kn: 'DID YOU KNOW\n"SINE" IS SANSKRIT?', gu: 'DID YOU KNOW\n"SINE" IS SANSKRIT?' },
        bgColor: '#1a0a30',
      },
      {
        type: 'fact',
        heading: { en: 'The word comes from "Jya" (ज्या)', hi: 'यह शब्द "ज्या" से आया है', sa: 'यह शब्द "ज्या" से आया है', mai: 'यह शब्द "ज्या" से आया है', mr: 'यह शब्द "ज्या" से आया है', ta: 'The word comes from "Jya" (ज्या)', te: 'The word comes from "Jya" (ज्या)', bn: 'The word comes from "Jya" (ज्या)', kn: 'The word comes from "Jya" (ज्या)', gu: 'The word comes from "Jya" (ज्या)' },
        body: { en: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.', hi: 'ज्या का अर्थ है धनुष की प्रत्यंचा। प्राचीन भारतीय गणितज्ञों ने वृत्त में धनुष देखा — अर्धज्या बनी sine फ़ंक्शन।', sa: 'ज्या का अर्थ है धनुष की प्रत्यंचा। प्राचीन भारतीय गणितज्ञों ने वृत्त में धनुष देखा — अर्धज्या बनी sine फ़ंक्शन।', mai: 'ज्या का अर्थ है धनुष की प्रत्यंचा। प्राचीन भारतीय गणितज्ञों ने वृत्त में धनुष देखा — अर्धज्या बनी sine फ़ंक्शन।', mr: 'ज्या का अर्थ है धनुष की प्रत्यंचा। प्राचीन भारतीय गणितज्ञों ने वृत्त में धनुष देखा — अर्धज्या बनी sine फ़ंक्शन।', ta: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.', te: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.', bn: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.', kn: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.', gu: 'Jya means BOWSTRING in Sanskrit. Ancient Indian mathematicians saw a bow in a circle — the half-chord became the sine function.' },
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Aryabhata created the first sine table', hi: 'आर्यभट ने बनाई पहली ज्या तालिका', sa: 'आर्यभट ने बनाई पहली ज्या तालिका', mai: 'आर्यभट ने बनाई पहली ज्या तालिका', mr: 'आर्यभट ने बनाई पहली ज्या तालिका', ta: 'Aryabhata created the first sine table', te: 'Aryabhata created the first sine table', bn: 'Aryabhata created the first sine table', kn: 'Aryabhata created the first sine table', gu: 'Aryabhata created the first sine table' },
        body: { en: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.', hi: '499 ई. में आर्यभट ने 3.75 अंश के अंतराल पर 24 ज्या मान संकलित किए — सम्पूर्ण आधुनिक त्रिकोणमिति की नींव।', sa: '499 ई. में आर्यभट ने 3.75 अंश के अंतराल पर 24 ज्या मान संकलित किए — सम्पूर्ण आधुनिक त्रिकोणमिति की नींव।', mai: '499 ई. में आर्यभट ने 3.75 अंश के अंतराल पर 24 ज्या मान संकलित किए — सम्पूर्ण आधुनिक त्रिकोणमिति की नींव।', mr: '499 ई. में आर्यभट ने 3.75 अंश के अंतराल पर 24 ज्या मान संकलित किए — सम्पूर्ण आधुनिक त्रिकोणमिति की नींव।', ta: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.', te: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.', bn: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.', kn: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.', gu: 'In 499 CE, Aryabhata compiled 24 sine values at 3.75-degree intervals — the foundation of all modern trigonometry.' },
        stat: '499 CE',
        bgColor: '#1a1040',
      },
      {
        type: 'comparison',
        heading: { en: 'The Great Mistranslation', hi: 'महान भ्रांत अनुवाद', sa: 'महान भ्रांत अनुवाद', mai: 'महान भ्रांत अनुवाद', mr: 'महान भ्रांत अनुवाद', ta: 'The Great Mistranslation', te: 'The Great Mistranslation', bn: 'The Great Mistranslation', kn: 'The Great Mistranslation', gu: 'The Great Mistranslation' },
        body: { en: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.', hi: 'ज्या → जीब (अरबी में "य" नहीं) → जैब (अरबी में "जेब") → Sinus (लैटिन में "जेब") → Sine। चार चरण, तीन भाषाएँ, एक भूल।', sa: 'ज्या → जीब (अरबी में "य" नहीं) → जैब (अरबी में "जेब") → Sinus (लैटिन में "जेब") → Sine। चार चरण, तीन भाषाएँ, एक भूल।', mai: 'ज्या → जीब (अरबी में "य" नहीं) → जैब (अरबी में "जेब") → Sinus (लैटिन में "जेब") → Sine। चार चरण, तीन भाषाएँ, एक भूल।', mr: 'ज्या → जीब (अरबी में "य" नहीं) → जैब (अरबी में "जेब") → Sinus (लैटिन में "जेब") → Sine। चार चरण, तीन भाषाएँ, एक भूल।', ta: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.', te: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.', bn: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.', kn: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.', gu: 'Jya → Jiba (Arabic had no "y") → Jaib ("pocket" in Arabic) → Sinus (Latin for "pocket") → Sine. Four steps, three languages, one mistake.' },
        bgColor: '#2a1a0a',
      },
      {
        type: 'fact',
        heading: { en: 'Accurate to 4 decimal places', hi: '4 दशमलव स्थानों तक सटीक', sa: '4 दशमलव स्थानों तक सटीक', mai: '4 दशमलव स्थानों तक सटीक', mr: '4 दशमलव स्थानों तक सटीक', ta: 'Accurate to 4 decimal places', te: 'Accurate to 4 decimal places', bn: 'Accurate to 4 decimal places', kn: 'Accurate to 4 decimal places', gu: 'Accurate to 4 decimal places' },
        body: { en: 'Aryabhata\'s 24 values achieved 99.97% accuracy — computed entirely by hand, 1,500 years ago.', hi: 'आर्यभट के 24 मान 99.97% सटीक थे — पूर्णतः हस्तगणना द्वारा, 1,500 वर्ष पहले।' },
        stat: '99.97%',
        bgColor: '#0a2a1a',
      },
      {
        type: 'fact',
        heading: { en: 'Greeks used full chords. Indians invented the HALF-chord.', hi: 'यूनानियों ने पूर्ण जीवा प्रयोग की। भारतीयों ने अर्धज्या का आविष्कार किया।', sa: 'यूनानियों ने पूर्ण जीवा प्रयोग की। भारतीयों ने अर्धज्या का आविष्कार किया।', mai: 'यूनानियों ने पूर्ण जीवा प्रयोग की। भारतीयों ने अर्धज्या का आविष्कार किया।', mr: 'यूनानियों ने पूर्ण जीवा प्रयोग की। भारतीयों ने अर्धज्या का आविष्कार किया।', ta: 'Greeks used full chords. Indians invented the HALF-chord.', te: 'Greeks used full chords. Indians invented the HALF-chord.', bn: 'Greeks used full chords. Indians invented the HALF-chord.', kn: 'Greeks used full chords. Indians invented the HALF-chord.', gu: 'Greeks used full chords. Indians invented the HALF-chord.' },
        body: { en: 'Ptolemy\'s chord tables required dividing by 2 every time. The Indian insight of using the half-chord directly was the breakthrough that made trigonometry practical.', hi: 'टॉलेमी की जीवा तालिकाओं में हर बार 2 से भाग देना पड़ता था। अर्धज्या का सीधा प्रयोग वह सफलता थी जिसने त्रिकोणमिति को व्यावहारिक बनाया।' },
        bgColor: '#1a0a30',
      },
      {
        type: 'quote',
        heading: { en: 'Every GPS satellite uses Aryabhata\'s invention', hi: 'हर GPS उपग्रह आर्यभट के आविष्कार का उपयोग करता है' },
        body: { en: 'Navigation, 3D graphics, signal processing, music compression — the sine function is everywhere. And it started with a bowstring.', hi: 'नौवहन, 3D ग्राफ़िक्स, सिग्नल प्रोसेसिंग, संगीत संपीड़न — ज्या फ़ंक्शन सर्वत्र है। और यह एक धनुष की प्रत्यंचा से शुरू हुआ।' },
        sourceText: { en: 'Modern application', hi: 'आधुनिक उपयोग', sa: 'आधुनिक उपयोग', mai: 'आधुनिक उपयोग', mr: 'आधुनिक उपयोग', ta: 'Modern application', te: 'Modern application', bn: 'Modern application', kn: 'Modern application', gu: 'Modern application' },
        bgColor: '#0a1a2a',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें', sa: 'पूरी कहानी पढ़ें', mai: 'पूरी कहानी पढ़ें', mr: 'पूरी कहानी पढ़ें', ta: 'Read the Full Story', te: 'Read the Full Story', bn: 'Read the Full Story', kn: 'Read the Full Story', gu: 'Read the Full Story' },
        body: { en: 'Discover how a Sanskrit bowstring became the world\'s most important mathematical function.', hi: 'जानें कैसे एक संस्कृत धनुष-प्रत्यंचा बनी विश्व का सबसे महत्वपूर्ण गणितीय फ़ंक्शन।' },
        bgColor: '#1a1040',
      },
    ],
  },

  /* ── Story 2: Zero Was Indian ── */
  {
    slug: 'zero-was-indian',
    title: {
      en: 'Zero — The Most Dangerous Idea in History',
      hi: 'शून्य — इतिहास का सबसे खतरनाक विचार',
    },
    description: {
      en: 'Brahmagupta defined zero as a number in 628 CE. Europe banned Arabic numerals in 1299. The most important invention in mathematics.',
      hi: 'ब्रह्मगुप्त ने 628 ई. में शून्य को एक संख्या के रूप में परिभाषित किया।',
    },
    ctaUrl: '/learn/contributions/zero',
    slides: [
      {
        type: 'title',
        heading: { en: 'ZERO\nTHE MOST DANGEROUS\nIDEA IN HISTORY', hi: 'शून्य\nइतिहास का सबसे\nखतरनाक विचार', sa: 'शून्य\nइतिहास का सबसे\nखतरनाक विचार', mai: 'शून्य\nइतिहास का सबसे\nखतरनाक विचार', mr: 'शून्य\nइतिहास का सबसे\nखतरनाक विचार', ta: 'ZERO\nTHE MOST DANGEROUS\nIDEA IN HISTORY', te: 'ZERO\nTHE MOST DANGEROUS\nIDEA IN HISTORY', bn: 'ZERO\nTHE MOST DANGEROUS\nIDEA IN HISTORY', kn: 'ZERO\nTHE MOST DANGEROUS\nIDEA IN HISTORY', gu: 'ZERO\nTHE MOST DANGEROUS\nIDEA IN HISTORY' },
        bgColor: '#0a0a20',
      },
      {
        type: 'fact',
        heading: { en: 'Brahmagupta defined zero as a NUMBER', hi: 'ब्रह्मगुप्त ने शून्य को संख्या के रूप में परिभाषित किया', sa: 'ब्रह्मगुप्त ने शून्य को संख्या के रूप में परिभाषित किया', mai: 'ब्रह्मगुप्त ने शून्य को संख्या के रूप में परिभाषित किया', mr: 'ब्रह्मगुप्त ने शून्य को संख्या के रूप में परिभाषित किया', ta: 'Brahmagupta defined zero as a NUMBER', te: 'Brahmagupta defined zero as a NUMBER', bn: 'Brahmagupta defined zero as a NUMBER', kn: 'Brahmagupta defined zero as a NUMBER', gu: 'Brahmagupta defined zero as a NUMBER' },
        body: { en: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.', hi: '628 ई. में, अपने ब्राह्मस्फुटसिद्धांत में, ब्रह्मगुप्त ने शून्य के साथ अंकगणित के पहले नियम लिखे।', sa: '628 ई. में, अपने ब्राह्मस्फुटसिद्धांत में, ब्रह्मगुप्त ने शून्य के साथ अंकगणित के पहले नियम लिखे।', mai: '628 ई. में, अपने ब्राह्मस्फुटसिद्धांत में, ब्रह्मगुप्त ने शून्य के साथ अंकगणित के पहले नियम लिखे।', mr: '628 ई. में, अपने ब्राह्मस्फुटसिद्धांत में, ब्रह्मगुप्त ने शून्य के साथ अंकगणित के पहले नियम लिखे।', ta: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.', te: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.', bn: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.', kn: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.', gu: 'In 628 CE, in his Brahmasphutasiddhanta, Brahmagupta wrote the first rules for arithmetic with zero — addition, subtraction, and multiplication.' },
        stat: '628 CE',
        bgColor: '#1a1040',
      },
      {
        type: 'quote',
        heading: { en: 'शून्यं शून्येन संयुक्तं शून्यम्', hi: 'शून्यं शून्येन संयुक्तं शून्यम्', sa: 'शून्यं शून्येन संयुक्तं शून्यम्', mai: 'शून्यं शून्येन संयुक्तं शून्यम्', mr: 'शून्यं शून्येन संयुक्तं शून्यम्', ta: 'शून्यं शून्येन संयुक्तं शून्यम्', te: 'शून्यं शून्येन संयुक्तं शून्यम्', bn: 'शून्यं शून्येन संयुक्तं शून्यम्', kn: 'शून्यं शून्येन संयुक्तं शून्यम्', gu: 'शून्यं शून्येन संयुक्तं शून्यम्' },
        body: { en: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.', hi: '"शून्य में शून्य जोड़ने पर शून्य।" — ब्रह्मगुप्त ने शून्यता के नियम लिखे।', sa: '"शून्य में शून्य जोड़ने पर शून्य।" — ब्रह्मगुप्त ने शून्यता के नियम लिखे।', mai: '"शून्य में शून्य जोड़ने पर शून्य।" — ब्रह्मगुप्त ने शून्यता के नियम लिखे।', mr: '"शून्य में शून्य जोड़ने पर शून्य।" — ब्रह्मगुप्त ने शून्यता के नियम लिखे।', ta: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.', te: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.', bn: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.', kn: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.', gu: '"Zero added to zero is zero." — Brahmagupta wrote the rules of nothingness itself.' },
        sourceText: { en: 'Brahmasphutasiddhanta, 628 CE', hi: 'ब्राह्मस्फुटसिद्धांत, 628 ई.', sa: 'ब्राह्मस्फुटसिद्धांत, 628 ई.', mai: 'ब्राह्मस्फुटसिद्धांत, 628 ई.', mr: 'ब्राह्मस्फुटसिद्धांत, 628 ई.', ta: 'Brahmasphutasiddhanta, 628 CE', te: 'Brahmasphutasiddhanta, 628 CE', bn: 'Brahmasphutasiddhanta, 628 CE', kn: 'Brahmasphutasiddhanta, 628 CE', gu: 'Brahmasphutasiddhanta, 628 CE' },
        bgColor: '#2a1a0a',
      },
      {
        type: 'fact',
        heading: { en: 'Florence BANNED Arabic numerals in 1299', hi: 'फ्लोरेंस ने 1299 में अरबी अंक प्रतिबंधित किए', sa: 'फ्लोरेंस ने 1299 में अरबी अंक प्रतिबंधित किए', mai: 'फ्लोरेंस ने 1299 में अरबी अंक प्रतिबंधित किए', mr: 'फ्लोरेंस ने 1299 में अरबी अंक प्रतिबंधित किए', ta: 'Florence BANNED Arabic numerals in 1299', te: 'Florence BANNED Arabic numerals in 1299', bn: 'Florence BANNED Arabic numerals in 1299', kn: 'Florence BANNED Arabic numerals in 1299', gu: 'Florence BANNED Arabic numerals in 1299' },
        body: { en: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.', hi: 'यूरोपीय व्यापारियों को डर था कि नई संख्याओं में जालसाजी आसान होगी। फ्लोरेंस ने इन्हें प्रतिबंधित किया।', sa: 'यूरोपीय व्यापारियों को डर था कि नई संख्याओं में जालसाजी आसान होगी। फ्लोरेंस ने इन्हें प्रतिबंधित किया।', mai: 'यूरोपीय व्यापारियों को डर था कि नई संख्याओं में जालसाजी आसान होगी। फ्लोरेंस ने इन्हें प्रतिबंधित किया।', mr: 'यूरोपीय व्यापारियों को डर था कि नई संख्याओं में जालसाजी आसान होगी। फ्लोरेंस ने इन्हें प्रतिबंधित किया।', ta: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.', te: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.', bn: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.', kn: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.', gu: 'European merchants feared the new numbers could be easily forged. The city of Florence banned them — preferring Roman numerals for official documents.' },
        stat: 'BANNED',
        bgColor: '#2a0a0a',
      },
      {
        type: 'comparison',
        heading: { en: 'The Journey of Zero', hi: 'शून्य की यात्रा', sa: 'शून्य की यात्रा', mai: 'शून्य की यात्रा', mr: 'शून्य की यात्रा', ta: 'The Journey of Zero', te: 'The Journey of Zero', bn: 'The Journey of Zero', kn: 'The Journey of Zero', gu: 'The Journey of Zero' },
        body: { en: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.', hi: 'भारत (628 ई.) → बगदाद (825 ई.) → यूरोप (1202 ई.)। शून्य को भारत से यूरोप पहुँचने में लगभग 600 वर्ष लगे।', sa: 'भारत (628 ई.) → बगदाद (825 ई.) → यूरोप (1202 ई.)। शून्य को भारत से यूरोप पहुँचने में लगभग 600 वर्ष लगे।', mai: 'भारत (628 ई.) → बगदाद (825 ई.) → यूरोप (1202 ई.)। शून्य को भारत से यूरोप पहुँचने में लगभग 600 वर्ष लगे।', mr: 'भारत (628 ई.) → बगदाद (825 ई.) → यूरोप (1202 ई.)। शून्य को भारत से यूरोप पहुँचने में लगभग 600 वर्ष लगे।', ta: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.', te: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.', bn: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.', kn: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.', gu: 'India (628 CE) → Baghdad (825 CE) → Europe (1202 CE). It took nearly 600 years for zero to travel from India to Europe.' },
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Without zero: no binary, no computers, no internet', hi: 'शून्य के बिना: न बाइनरी, न कंप्यूटर, न इंटरनेट', sa: 'शून्य के बिना: न बाइनरी, न कंप्यूटर, न इंटरनेट', mai: 'शून्य के बिना: न बाइनरी, न कंप्यूटर, न इंटरनेट', mr: 'शून्य के बिना: न बाइनरी, न कंप्यूटर, न इंटरनेट', ta: 'Without zero: no binary, no computers, no internet', te: 'Without zero: no binary, no computers, no internet', bn: 'Without zero: no binary, no computers, no internet', kn: 'Without zero: no binary, no computers, no internet', gu: 'Without zero: no binary, no computers, no internet' },
        body: { en: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.', hi: 'हर डिजिटल उपकरण 0 और 1 पर चलता है। बाइनरी कोड, बूलियन तर्क, डिजिटल सर्किट — सब शून्य के बिना असंभव।', sa: 'हर डिजिटल उपकरण 0 और 1 पर चलता है। बाइनरी कोड, बूलियन तर्क, डिजिटल सर्किट — सब शून्य के बिना असंभव।', mai: 'हर डिजिटल उपकरण 0 और 1 पर चलता है। बाइनरी कोड, बूलियन तर्क, डिजिटल सर्किट — सब शून्य के बिना असंभव।', mr: 'हर डिजिटल उपकरण 0 और 1 पर चलता है। बाइनरी कोड, बूलियन तर्क, डिजिटल सर्किट — सब शून्य के बिना असंभव।', ta: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.', te: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.', bn: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.', kn: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.', gu: 'Every digital device runs on 0s and 1s. Binary code, Boolean logic, digital circuits — all impossible without the concept of zero as a number.' },
        bgColor: '#0a2020',
      },
      {
        type: 'quote',
        heading: { en: 'The most important invention in mathematics. Period.', hi: 'गणित का सबसे महत्वपूर्ण आविष्कार। बस।', sa: 'गणित का सबसे महत्वपूर्ण आविष्कार। बस।', mai: 'गणित का सबसे महत्वपूर्ण आविष्कार। बस।', mr: 'गणित का सबसे महत्वपूर्ण आविष्कार। बस।', ta: 'The most important invention in mathematics. Period.', te: 'The most important invention in mathematics. Period.', bn: 'The most important invention in mathematics. Period.', kn: 'The most important invention in mathematics. Period.', gu: 'The most important invention in mathematics. Period.' },
        body: { en: 'Without zero, there is no place-value system. Without place-value, there are no large calculations. Without large calculations, there is no modern science.', hi: 'शून्य के बिना स्थानीय मान प्रणाली नहीं। स्थानीय मान के बिना बड़ी गणनाएँ नहीं। बड़ी गणनाओं के बिना आधुनिक विज्ञान नहीं।', sa: 'शून्य के बिना स्थानीय मान प्रणाली नहीं। स्थानीय मान के बिना बड़ी गणनाएँ नहीं। बड़ी गणनाओं के बिना आधुनिक विज्ञान नहीं।', mai: 'शून्य के बिना स्थानीय मान प्रणाली नहीं। स्थानीय मान के बिना बड़ी गणनाएँ नहीं। बड़ी गणनाओं के बिना आधुनिक विज्ञान नहीं।', mr: 'शून्य के बिना स्थानीय मान प्रणाली नहीं। स्थानीय मान के बिना बड़ी गणनाएँ नहीं। बड़ी गणनाओं के बिना आधुनिक विज्ञान नहीं।', ta: 'Without zero, there is no place-value system. Without place-value, there are no large calculations. Without large calculations, there is no modern science.', te: 'Without zero, there is no place-value system. Without place-value, there are no large calculations. Without large calculations, there is no modern science.', bn: 'Without zero, there is no place-value system. Without place-value, there are no large calculations. Without large calculations, there is no modern science.', kn: 'Without zero, there is no place-value system. Without place-value, there are no large calculations. Without large calculations, there is no modern science.', gu: 'Without zero, there is no place-value system. Without place-value, there are no large calculations. Without large calculations, there is no modern science.' },
        bgColor: '#1a0a30',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें', sa: 'पूरी कहानी पढ़ें', mai: 'पूरी कहानी पढ़ें', mr: 'पूरी कहानी पढ़ें', ta: 'Read the Full Story', te: 'Read the Full Story', bn: 'Read the Full Story', kn: 'Read the Full Story', gu: 'Read the Full Story' },
        body: { en: 'How a concept that terrified Europe became the foundation of all modern technology.', hi: 'कैसे एक अवधारणा जिसने यूरोप को भयभीत किया, सारी आधुनिक प्रौद्योगिकी की नींव बनी।', sa: 'कैसे एक अवधारणा जिसने यूरोप को भयभीत किया, सारी आधुनिक प्रौद्योगिकी की नींव बनी।', mai: 'कैसे एक अवधारणा जिसने यूरोप को भयभीत किया, सारी आधुनिक प्रौद्योगिकी की नींव बनी।', mr: 'कैसे एक अवधारणा जिसने यूरोप को भयभीत किया, सारी आधुनिक प्रौद्योगिकी की नींव बनी।', ta: 'How a concept that terrified Europe became the foundation of all modern technology.', te: 'How a concept that terrified Europe became the foundation of all modern technology.', bn: 'How a concept that terrified Europe became the foundation of all modern technology.', kn: 'How a concept that terrified Europe became the foundation of all modern technology.', gu: 'How a concept that terrified Europe became the foundation of all modern technology.' },
        bgColor: '#0a0a20',
      },
    ],
  },

  /* ── Story 3: Calculus Before Newton ── */
  {
    slug: 'calculus-before-newton',
    title: {
      en: 'Calculus Was Invented in Kerala',
      hi: 'कलन का आविष्कार केरल में हुआ',
    },
    description: {
      en: 'Madhava of Sangamagrama discovered infinite series around 1350 CE — 316 years before Newton and Leibniz.',
      hi: 'संगमग्राम के माधव ने 1350 ई. के आसपास अनंत श्रेणी की खोज की — न्यूटन और लाइबनिट्ज़ से 316 वर्ष पहले।',
    },
    ctaUrl: '/learn/contributions/kerala-school',
    slides: [
      {
        type: 'title',
        heading: { en: 'CALCULUS WAS\nINVENTED IN KERALA', hi: 'कलन का आविष्कार\nकेरल में हुआ', sa: 'कलन का आविष्कार\nकेरल में हुआ', mai: 'कलन का आविष्कार\nकेरल में हुआ', mr: 'कलन का आविष्कार\nकेरल में हुआ', ta: 'CALCULUS WAS\nINVENTED IN KERALA', te: 'CALCULUS WAS\nINVENTED IN KERALA', bn: 'CALCULUS WAS\nINVENTED IN KERALA', kn: 'CALCULUS WAS\nINVENTED IN KERALA', gu: 'CALCULUS WAS\nINVENTED IN KERALA' },
        bgColor: '#0a2a1a',
      },
      {
        type: 'fact',
        heading: { en: 'Madhava discovered infinite series', hi: 'माधव ने अनंत श्रेणी की खोज की', sa: 'माधव ने अनंत श्रेणी की खोज की', mai: 'माधव ने अनंत श्रेणी की खोज की', mr: 'माधव ने अनंत श्रेणी की खोज की', ta: 'Madhava discovered infinite series', te: 'Madhava discovered infinite series', bn: 'Madhava discovered infinite series', kn: 'Madhava discovered infinite series', gu: 'Madhava discovered infinite series' },
        body: { en: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.', hi: '1350 ई. के आसपास, केरल के संगमग्राम के माधव ने sine, cosine और arctangent की अनंत श्रेणी विस्तार विकसित किए — कलन के मूल उपकरण।', sa: '1350 ई. के आसपास, केरल के संगमग्राम के माधव ने sine, cosine और arctangent की अनंत श्रेणी विस्तार विकसित किए — कलन के मूल उपकरण।', mai: '1350 ई. के आसपास, केरल के संगमग्राम के माधव ने sine, cosine और arctangent की अनंत श्रेणी विस्तार विकसित किए — कलन के मूल उपकरण।', mr: '1350 ई. के आसपास, केरल के संगमग्राम के माधव ने sine, cosine और arctangent की अनंत श्रेणी विस्तार विकसित किए — कलन के मूल उपकरण।', ta: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.', te: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.', bn: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.', kn: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.', gu: 'Around 1350 CE, Madhava of Sangamagrama in Kerala developed infinite series expansions for sine, cosine, and arctangent — the core tools of calculus.' },
        stat: '1350',
        bgColor: '#1a1040',
      },
      {
        type: 'fact',
        heading: { en: 'The Madhava-Leibniz Series', hi: 'माधव-लाइबनिट्ज़ श्रेणी', sa: 'माधव-लाइबनिट्ज़ श्रेणी', mai: 'माधव-लाइबनिट्ज़ श्रेणी', mr: 'माधव-लाइबनिट्ज़ श्रेणी', ta: 'The Madhava-Leibniz Series', te: 'The Madhava-Leibniz Series', bn: 'The Madhava-Leibniz Series', kn: 'The Madhava-Leibniz Series', gu: 'The Madhava-Leibniz Series' },
        body: { en: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.', hi: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... माधव ने यह सूत्र लाइबनिट्ज़ द्वारा यूरोप में प्रकाशित करने से तीन शताब्दी पहले खोजा।', sa: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... माधव ने यह सूत्र लाइबनिट्ज़ द्वारा यूरोप में प्रकाशित करने से तीन शताब्दी पहले खोजा।', mai: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... माधव ने यह सूत्र लाइबनिट्ज़ द्वारा यूरोप में प्रकाशित करने से तीन शताब्दी पहले खोजा।', mr: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... माधव ने यह सूत्र लाइबनिट्ज़ द्वारा यूरोप में प्रकाशित करने से तीन शताब्दी पहले खोजा।', ta: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.', te: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.', bn: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.', kn: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.', gu: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava discovered this formula three centuries before Leibniz published it in Europe.' },
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'He computed π to 11 decimal places', hi: 'उन्होंने π को 11 दशमलव स्थानों तक गणना किया', sa: 'उन्होंने π को 11 दशमलव स्थानों तक गणना किया', mai: 'उन्होंने π को 11 दशमलव स्थानों तक गणना किया', mr: 'उन्होंने π को 11 दशमलव स्थानों तक गणना किया', ta: 'He computed π to 11 decimal places', te: 'He computed π to 11 decimal places', bn: 'He computed π to 11 decimal places', kn: 'He computed π to 11 decimal places', gu: 'He computed π to 11 decimal places' },
        body: { en: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.', hi: 'अपनी अनंत श्रेणी और सुधार पदों का उपयोग करते हुए, माधव ने π = 3.14159265359 प्राप्त किया — शताब्दियों तक अटूट रिकॉर्ड।', sa: 'अपनी अनंत श्रेणी और सुधार पदों का उपयोग करते हुए, माधव ने π = 3.14159265359 प्राप्त किया — शताब्दियों तक अटूट रिकॉर्ड।', mai: 'अपनी अनंत श्रेणी और सुधार पदों का उपयोग करते हुए, माधव ने π = 3.14159265359 प्राप्त किया — शताब्दियों तक अटूट रिकॉर्ड।', mr: 'अपनी अनंत श्रेणी और सुधार पदों का उपयोग करते हुए, माधव ने π = 3.14159265359 प्राप्त किया — शताब्दियों तक अटूट रिकॉर्ड।', ta: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.', te: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.', bn: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.', kn: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.', gu: 'Using his infinite series with correction terms, Madhava achieved π = 3.14159265359 — a record that stood for centuries.' },
        stat: '11 decimals',
        bgColor: '#2a1a0a',
      },
      {
        type: 'comparison',
        heading: { en: '316 Years Earlier', hi: '316 वर्ष पहले', sa: '316 वर्ष पहले', mai: '316 वर्ष पहले', mr: '316 वर्ष पहले', ta: '316 Years Earlier', te: '316 Years Earlier', bn: '316 Years Earlier', kn: '316 Years Earlier', gu: '316 Years Earlier' },
        body: { en: 'Madhava (~1350 CE) vs Newton/Leibniz (~1666 CE). The Kerala School of Mathematics had calculus-like tools three centuries before Europe.', hi: 'माधव (~1350 ई.) बनाम न्यूटन/लाइबनिट्ज़ (~1666 ई.)। केरल गणित विद्यालय के पास यूरोप से तीन शताब्दी पहले कलन-सदृश उपकरण थे।', sa: 'माधव (~1350 ई.) बनाम न्यूटन/लाइबनिट्ज़ (~1666 ई.)। केरल गणित विद्यालय के पास यूरोप से तीन शताब्दी पहले कलन-सदृश उपकरण थे।', mai: 'माधव (~1350 ई.) बनाम न्यूटन/लाइबनिट्ज़ (~1666 ई.)। केरल गणित विद्यालय के पास यूरोप से तीन शताब्दी पहले कलन-सदृश उपकरण थे।', mr: 'माधव (~1350 ई.) बनाम न्यूटन/लाइबनिट्ज़ (~1666 ई.)। केरल गणित विद्यालय के पास यूरोप से तीन शताब्दी पहले कलन-सदृश उपकरण थे।', ta: 'Madhava (~1350 CE) vs Newton/Leibniz (~1666 CE). The Kerala School of Mathematics had calculus-like tools three centuries before Europe.', te: 'Madhava (~1350 CE) vs Newton/Leibniz (~1666 CE). The Kerala School of Mathematics had calculus-like tools three centuries before Europe.', bn: 'Madhava (~1350 CE) vs Newton/Leibniz (~1666 CE). The Kerala School of Mathematics had calculus-like tools three centuries before Europe.', kn: 'Madhava (~1350 CE) vs Newton/Leibniz (~1666 CE). The Kerala School of Mathematics had calculus-like tools three centuries before Europe.', gu: 'Madhava (~1350 CE) vs Newton/Leibniz (~1666 CE). The Kerala School of Mathematics had calculus-like tools three centuries before Europe.' },
        bgColor: '#1a0a30',
      },
      {
        type: 'fact',
        heading: { en: 'The first calculus TEXTBOOK', hi: 'पहली कलन पाठ्यपुस्तक', sa: 'पहली कलन पाठ्यपुस्तक', mai: 'पहली कलन पाठ्यपुस्तक', mr: 'पहली कलन पाठ्यपुस्तक', ta: 'The first calculus TEXTBOOK', te: 'The first calculus TEXTBOOK', bn: 'The first calculus TEXTBOOK', kn: 'The first calculus TEXTBOOK', gu: 'The first calculus TEXTBOOK' },
        body: { en: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.', hi: 'ज्येष्ठदेव ने 1530 में युक्तिभाषा लिखी — गणितीय प्रमाणों की विस्तृत पाठ्यपुस्तक, जिसमें अनंत श्रेणी की व्युत्पत्तियाँ शामिल हैं।', sa: 'ज्येष्ठदेव ने 1530 में युक्तिभाषा लिखी — गणितीय प्रमाणों की विस्तृत पाठ्यपुस्तक, जिसमें अनंत श्रेणी की व्युत्पत्तियाँ शामिल हैं।', mai: 'ज्येष्ठदेव ने 1530 में युक्तिभाषा लिखी — गणितीय प्रमाणों की विस्तृत पाठ्यपुस्तक, जिसमें अनंत श्रेणी की व्युत्पत्तियाँ शामिल हैं।', mr: 'ज्येष्ठदेव ने 1530 में युक्तिभाषा लिखी — गणितीय प्रमाणों की विस्तृत पाठ्यपुस्तक, जिसमें अनंत श्रेणी की व्युत्पत्तियाँ शामिल हैं।', ta: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.', te: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.', bn: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.', kn: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.', gu: 'Jyeshthadeva wrote the Yuktibhasha in 1530 — a detailed, rigorous textbook of mathematical proofs, including derivations of infinite series.' },
        bgColor: '#0a2020',
      },
      {
        type: 'quote',
        heading: { en: '"The Leibniz series should be called the Madhava series"', hi: '"लाइबनिट्ज़ श्रेणी को माधव श्रेणी कहा जाना चाहिए"', sa: '"लाइबनिट्ज़ श्रेणी को माधव श्रेणी कहा जाना चाहिए"', mai: '"लाइबनिट्ज़ श्रेणी को माधव श्रेणी कहा जाना चाहिए"', mr: '"लाइबनिट्ज़ श्रेणी को माधव श्रेणी कहा जाना चाहिए"', ta: '"The Leibniz series should be called the Madhava series"', te: '"The Leibniz series should be called the Madhava series"', bn: '"The Leibniz series should be called the Madhava series"', kn: '"The Leibniz series should be called the Madhava series"', gu: '"The Leibniz series should be called the Madhava series"' },
        body: { en: 'Modern historians of mathematics increasingly acknowledge that these infinite series were discovered in Kerala long before their European "discovery."', hi: 'गणित के आधुनिक इतिहासकार बढ़ते क्रम में स्वीकार करते हैं कि ये अनंत श्रेणियाँ यूरोपीय "खोज" से बहुत पहले केरल में खोजी गई थीं।', sa: 'गणित के आधुनिक इतिहासकार बढ़ते क्रम में स्वीकार करते हैं कि ये अनंत श्रेणियाँ यूरोपीय "खोज" से बहुत पहले केरल में खोजी गई थीं।', mai: 'गणित के आधुनिक इतिहासकार बढ़ते क्रम में स्वीकार करते हैं कि ये अनंत श्रेणियाँ यूरोपीय "खोज" से बहुत पहले केरल में खोजी गई थीं।', mr: 'गणित के आधुनिक इतिहासकार बढ़ते क्रम में स्वीकार करते हैं कि ये अनंत श्रेणियाँ यूरोपीय "खोज" से बहुत पहले केरल में खोजी गई थीं।', ta: 'Modern historians of mathematics increasingly acknowledge that these infinite series were discovered in Kerala long before their European "discovery."', te: 'Modern historians of mathematics increasingly acknowledge that these infinite series were discovered in Kerala long before their European "discovery."', bn: 'Modern historians of mathematics increasingly acknowledge that these infinite series were discovered in Kerala long before their European "discovery."', kn: 'Modern historians of mathematics increasingly acknowledge that these infinite series were discovered in Kerala long before their European "discovery."', gu: 'Modern historians of mathematics increasingly acknowledge that these infinite series were discovered in Kerala long before their European "discovery."' },
        sourceText: { en: 'Modern mathematical historians', hi: 'आधुनिक गणित इतिहासकार', sa: 'आधुनिक गणित इतिहासकार', mai: 'आधुनिक गणित इतिहासकार', mr: 'आधुनिक गणित इतिहासकार', ta: 'Modern mathematical historians', te: 'Modern mathematical historians', bn: 'Modern mathematical historians', kn: 'Modern mathematical historians', gu: 'Modern mathematical historians' },
        bgColor: '#1a1040',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें', sa: 'पूरी कहानी पढ़ें', mai: 'पूरी कहानी पढ़ें', mr: 'पूरी कहानी पढ़ें', ta: 'Read the Full Story', te: 'Read the Full Story', bn: 'Read the Full Story', kn: 'Read the Full Story', gu: 'Read the Full Story' },
        body: { en: 'The Kerala School of Mathematics — India\'s forgotten revolution in calculus.', hi: 'केरल गणित विद्यालय — कलन में भारत की भूली हुई क्रांति।' },
        bgColor: '#0a2a1a',
      },
    ],
  },

  /* ── Story 4: Pythagoras Was Indian ── */
  {
    slug: 'pythagoras-was-indian',
    title: {
      en: 'The "Pythagorean" Theorem — 300 Years Before Pythagoras',
      hi: '"पाइथागोरस" प्रमेय — पाइथागोरस से 300 वर्ष पहले',
    },
    description: {
      en: 'Baudhayana stated the theorem in the Sulba Sutra around 800 BCE, centuries before Pythagoras was born.',
      hi: 'बौधायन ने यह प्रमेय शुल्ब सूत्र में ~800 ई.पू. में कहा, पाइथागोरस के जन्म से शताब्दियों पहले।',
    },
    ctaUrl: '/learn/contributions/pythagoras',
    slides: [
      {
        type: 'title',
        heading: { en: 'THE "PYTHAGOREAN"\nTHEOREM\n300 YEARS BEFORE\nPYTHAGORAS', hi: '"पाइथागोरस" प्रमेय\nपाइथागोरस से\n300 वर्ष पहले', sa: '"पाइथागोरस" प्रमेय\nपाइथागोरस से\n300 वर्ष पहले', mai: '"पाइथागोरस" प्रमेय\nपाइथागोरस से\n300 वर्ष पहले', mr: '"पाइथागोरस" प्रमेय\nपाइथागोरस से\n300 वर्ष पहले', ta: 'THE "PYTHAGOREAN"\nTHEOREM\n300 YEARS BEFORE\nPYTHAGORAS', te: 'THE "PYTHAGOREAN"\nTHEOREM\n300 YEARS BEFORE\nPYTHAGORAS', bn: 'THE "PYTHAGOREAN"\nTHEOREM\n300 YEARS BEFORE\nPYTHAGORAS', kn: 'THE "PYTHAGOREAN"\nTHEOREM\n300 YEARS BEFORE\nPYTHAGORAS', gu: 'THE "PYTHAGOREAN"\nTHEOREM\n300 YEARS BEFORE\nPYTHAGORAS' },
        bgColor: '#2a0a1a',
      },
      {
        type: 'fact',
        heading: { en: 'Baudhayana stated it in the Sulba Sutra', hi: 'बौधायन ने इसे शुल्ब सूत्र में कहा', sa: 'बौधायन ने इसे शुल्ब सूत्र में कहा', mai: 'बौधायन ने इसे शुल्ब सूत्र में कहा', mr: 'बौधायन ने इसे शुल्ब सूत्र में कहा', ta: 'Baudhayana stated it in the Sulba Sutra', te: 'Baudhayana stated it in the Sulba Sutra', bn: 'Baudhayana stated it in the Sulba Sutra', kn: 'Baudhayana stated it in the Sulba Sutra', gu: 'Baudhayana stated it in the Sulba Sutra' },
        body: { en: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.', hi: '~800 ई.पू. में, ऋषि बौधायन ने समकोण और वर्ग बनाने के सटीक नियम लिखे — जिसमें समकोण त्रिभुज की भुजाओं के बीच संबंध शामिल है।', sa: '~800 ई.पू. में, ऋषि बौधायन ने समकोण और वर्ग बनाने के सटीक नियम लिखे — जिसमें समकोण त्रिभुज की भुजाओं के बीच संबंध शामिल है।', mai: '~800 ई.पू. में, ऋषि बौधायन ने समकोण और वर्ग बनाने के सटीक नियम लिखे — जिसमें समकोण त्रिभुज की भुजाओं के बीच संबंध शामिल है।', mr: '~800 ई.पू. में, ऋषि बौधायन ने समकोण और वर्ग बनाने के सटीक नियम लिखे — जिसमें समकोण त्रिभुज की भुजाओं के बीच संबंध शामिल है।', ta: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.', te: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.', bn: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.', kn: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.', gu: 'Around 800 BCE, the sage Baudhayana wrote precise rules for constructing right angles and squares — including the relationship between the sides of a right triangle.' },
        stat: '800 BCE',
        bgColor: '#1a1040',
      },
      {
        type: 'quote',
        heading: { en: 'The Original Sanskrit', hi: 'मूल संस्कृत', sa: 'मूल संस्कृत', mai: 'मूल संस्कृत', mr: 'मूल संस्कृत', ta: 'The Original Sanskrit', te: 'The Original Sanskrit', bn: 'The Original Sanskrit', kn: 'The Original Sanskrit', gu: 'The Original Sanskrit' },
        body: { en: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.', hi: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — आयत का विकर्ण वे दोनों क्षेत्रफल उत्पन्न करता है जो उसकी लंबाई और चौड़ाई अलग-अलग उत्पन्न करते हैं।', sa: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — आयत का विकर्ण वे दोनों क्षेत्रफल उत्पन्न करता है जो उसकी लंबाई और चौड़ाई अलग-अलग उत्पन्न करते हैं।', mai: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — आयत का विकर्ण वे दोनों क्षेत्रफल उत्पन्न करता है जो उसकी लंबाई और चौड़ाई अलग-अलग उत्पन्न करते हैं।', mr: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — आयत का विकर्ण वे दोनों क्षेत्रफल उत्पन्न करता है जो उसकी लंबाई और चौड़ाई अलग-अलग उत्पन्न करते हैं।', ta: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.', te: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.', bn: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.', kn: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.', gu: '"दीर्घचतुरश्रस्य अक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत् पृथग्भूते कुरुतः तदुभयं करोति" — The diagonal of a rectangle produces both areas that its length and breadth produce separately.' },
        sourceText: { en: 'Baudhayana Sulba Sutra, ~800 BCE', hi: 'बौधायन शुल्ब सूत्र, ~800 ई.पू.', sa: 'बौधायन शुल्ब सूत्र, ~800 ई.पू.', mai: 'बौधायन शुल्ब सूत्र, ~800 ई.पू.', mr: 'बौधायन शुल्ब सूत्र, ~800 ई.पू.', ta: 'Baudhayana Sulba Sutra, ~800 BCE', te: 'Baudhayana Sulba Sutra, ~800 BCE', bn: 'Baudhayana Sulba Sutra, ~800 BCE', kn: 'Baudhayana Sulba Sutra, ~800 BCE', gu: 'Baudhayana Sulba Sutra, ~800 BCE' },
        bgColor: '#2a1a0a',
      },
      {
        type: 'fact',
        heading: { en: 'He calculated √2 to 5 decimal places', hi: 'उन्होंने √2 को 5 दशमलव स्थानों तक गणना किया', sa: 'उन्होंने √2 को 5 दशमलव स्थानों तक गणना किया', mai: 'उन्होंने √2 को 5 दशमलव स्थानों तक गणना किया', mr: 'उन्होंने √2 को 5 दशमलव स्थानों तक गणना किया', ta: 'He calculated √2 to 5 decimal places', te: 'He calculated √2 to 5 decimal places', bn: 'He calculated √2 to 5 decimal places', kn: 'He calculated √2 to 5 decimal places', gu: 'He calculated √2 to 5 decimal places' },
        body: { en: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.', hi: 'बौधायन ने √2 = 1.41421 दिया — 800 ई.पू. के लिए गणना की एक अद्भुत उपलब्धि, 5 दशमलव स्थानों तक सही।', sa: 'बौधायन ने √2 = 1.41421 दिया — 800 ई.पू. के लिए गणना की एक अद्भुत उपलब्धि, 5 दशमलव स्थानों तक सही।', mai: 'बौधायन ने √2 = 1.41421 दिया — 800 ई.पू. के लिए गणना की एक अद्भुत उपलब्धि, 5 दशमलव स्थानों तक सही।', mr: 'बौधायन ने √2 = 1.41421 दिया — 800 ई.पू. के लिए गणना की एक अद्भुत उपलब्धि, 5 दशमलव स्थानों तक सही।', ta: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.', te: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.', bn: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.', kn: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.', gu: 'Baudhayana gave √2 = 1.41421 — an astonishing feat of computation for 800 BCE, and correct to 5 decimal places.' },
        stat: '1.41421',
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Built for Vedic Fire Altars', hi: 'वैदिक अग्नि वेदियों के लिए निर्मित', sa: 'वैदिक अग्नि वेदियों के लिए निर्मित', mai: 'वैदिक अग्नि वेदियों के लिए निर्मित', mr: 'वैदिक अग्नि वेदियों के लिए निर्मित', ta: 'Built for Vedic Fire Altars', te: 'Built for Vedic Fire Altars', bn: 'Built for Vedic Fire Altars', kn: 'Built for Vedic Fire Altars', gu: 'Built for Vedic Fire Altars' },
        body: { en: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.', hi: 'शुल्ब सूत्र सटीक ज्यामितीय आकारों की पवित्र अग्नि वेदियों के निर्माण के लिए व्यावहारिक पुस्तिकाएँ थीं।', sa: 'शुल्ब सूत्र सटीक ज्यामितीय आकारों की पवित्र अग्नि वेदियों के निर्माण के लिए व्यावहारिक पुस्तिकाएँ थीं।', mai: 'शुल्ब सूत्र सटीक ज्यामितीय आकारों की पवित्र अग्नि वेदियों के निर्माण के लिए व्यावहारिक पुस्तिकाएँ थीं।', mr: 'शुल्ब सूत्र सटीक ज्यामितीय आकारों की पवित्र अग्नि वेदियों के निर्माण के लिए व्यावहारिक पुस्तिकाएँ थीं।', ta: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.', te: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.', bn: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.', kn: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.', gu: 'The Sulba Sutras were practical manuals for constructing sacred fire altars of precise geometric shapes — squares, circles, and complex transformations.' },
        bgColor: '#1a0a30',
      },
      {
        type: 'comparison',
        heading: { en: 'The Timeline', hi: 'समयरेखा', sa: 'समयरेखा', mai: 'समयरेखा', mr: 'समयरेखा', ta: 'The Timeline', te: 'The Timeline', bn: 'The Timeline', kn: 'The Timeline', gu: 'The Timeline' },
        body: { en: 'Baudhayana (~800 BCE) vs Pythagoras (~500 BCE). The Indian formulation predates the Greek one by roughly 300 years.', hi: 'बौधायन (~800 ई.पू.) बनाम पाइथागोरस (~500 ई.पू.)। भारतीय सूत्रीकरण यूनानी से लगभग 300 वर्ष पहले है।', sa: 'बौधायन (~800 ई.पू.) बनाम पाइथागोरस (~500 ई.पू.)। भारतीय सूत्रीकरण यूनानी से लगभग 300 वर्ष पहले है।', mai: 'बौधायन (~800 ई.पू.) बनाम पाइथागोरस (~500 ई.पू.)। भारतीय सूत्रीकरण यूनानी से लगभग 300 वर्ष पहले है।', mr: 'बौधायन (~800 ई.पू.) बनाम पाइथागोरस (~500 ई.पू.)। भारतीय सूत्रीकरण यूनानी से लगभग 300 वर्ष पहले है।', ta: 'Baudhayana (~800 BCE) vs Pythagoras (~500 BCE). The Indian formulation predates the Greek one by roughly 300 years.', te: 'Baudhayana (~800 BCE) vs Pythagoras (~500 BCE). The Indian formulation predates the Greek one by roughly 300 years.', bn: 'Baudhayana (~800 BCE) vs Pythagoras (~500 BCE). The Indian formulation predates the Greek one by roughly 300 years.', kn: 'Baudhayana (~800 BCE) vs Pythagoras (~500 BCE). The Indian formulation predates the Greek one by roughly 300 years.', gu: 'Baudhayana (~800 BCE) vs Pythagoras (~500 BCE). The Indian formulation predates the Greek one by roughly 300 years.' },
        bgColor: '#0a2020',
      },
      {
        type: 'fact',
        heading: { en: 'Pythagoras left no written works', hi: 'पाइथागोरस ने कोई लिखित कार्य नहीं छोड़ा', sa: 'पाइथागोरस ने कोई लिखित कार्य नहीं छोड़ा', mai: 'पाइथागोरस ने कोई लिखित कार्य नहीं छोड़ा', mr: 'पाइथागोरस ने कोई लिखित कार्य नहीं छोड़ा', ta: 'Pythagoras left no written works', te: 'Pythagoras left no written works', bn: 'Pythagoras left no written works', kn: 'Pythagoras left no written works', gu: 'Pythagoras left no written works' },
        body: { en: 'Everything attributed to Pythagoras was recorded by followers centuries later. The Sulba Sutras, by contrast, are dated physical texts.', hi: 'पाइथागोरस को श्रेय दी गई हर बात शताब्दियों बाद अनुयायियों ने दर्ज की। शुल्ब सूत्र, इसके विपरीत, दिनांकित भौतिक ग्रंथ हैं।', sa: 'पाइथागोरस को श्रेय दी गई हर बात शताब्दियों बाद अनुयायियों ने दर्ज की। शुल्ब सूत्र, इसके विपरीत, दिनांकित भौतिक ग्रंथ हैं।', mai: 'पाइथागोरस को श्रेय दी गई हर बात शताब्दियों बाद अनुयायियों ने दर्ज की। शुल्ब सूत्र, इसके विपरीत, दिनांकित भौतिक ग्रंथ हैं।', mr: 'पाइथागोरस को श्रेय दी गई हर बात शताब्दियों बाद अनुयायियों ने दर्ज की। शुल्ब सूत्र, इसके विपरीत, दिनांकित भौतिक ग्रंथ हैं।', ta: 'Everything attributed to Pythagoras was recorded by followers centuries later. The Sulba Sutras, by contrast, are dated physical texts.', te: 'Everything attributed to Pythagoras was recorded by followers centuries later. The Sulba Sutras, by contrast, are dated physical texts.', bn: 'Everything attributed to Pythagoras was recorded by followers centuries later. The Sulba Sutras, by contrast, are dated physical texts.', kn: 'Everything attributed to Pythagoras was recorded by followers centuries later. The Sulba Sutras, by contrast, are dated physical texts.', gu: 'Everything attributed to Pythagoras was recorded by followers centuries later. The Sulba Sutras, by contrast, are dated physical texts.' },
        bgColor: '#1a1040',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें', sa: 'पूरी कहानी पढ़ें', mai: 'पूरी कहानी पढ़ें', mr: 'पूरी कहानी पढ़ें', ta: 'Read the Full Story', te: 'Read the Full Story', bn: 'Read the Full Story', kn: 'Read the Full Story', gu: 'Read the Full Story' },
        body: { en: 'The Sulba Sutras — geometry born from sacred fire.', hi: 'शुल्ब सूत्र — पवित्र अग्नि से जन्मी ज्यामिति।', sa: 'शुल्ब सूत्र — पवित्र अग्नि से जन्मी ज्यामिति।', mai: 'शुल्ब सूत्र — पवित्र अग्नि से जन्मी ज्यामिति।', mr: 'शुल्ब सूत्र — पवित्र अग्नि से जन्मी ज्यामिति।', ta: 'The Sulba Sutras — geometry born from sacred fire.', te: 'The Sulba Sutras — geometry born from sacred fire.', bn: 'The Sulba Sutras — geometry born from sacred fire.', kn: 'The Sulba Sutras — geometry born from sacred fire.', gu: 'The Sulba Sutras — geometry born from sacred fire.' },
        bgColor: '#2a0a1a',
      },
    ],
  },

  /* ── Story 5: Speed of Light ── */
  {
    slug: 'speed-of-light',
    title: {
      en: 'Speed of Light — In a 14th Century Text',
      hi: 'प्रकाश की गति — एक 14वीं शताब्दी के ग्रंथ में',
    },
    description: {
      en: 'Sayana\'s commentary on the Rig Veda contains a value for the speed of light accurate to 0.14%.',
      hi: 'सायण की ऋग्वेद टीका में प्रकाश की गति का मान 0.14% सटीक है।',
    },
    ctaUrl: '/learn/contributions/speed-of-light',
    slides: [
      {
        type: 'title',
        heading: { en: 'SPEED OF LIGHT\nIN A 14TH CENTURY\nTEXT', hi: 'प्रकाश की गति\n14वीं शताब्दी के\nग्रंथ में', sa: 'प्रकाश की गति\n14वीं शताब्दी के\nग्रंथ में', mai: 'प्रकाश की गति\n14वीं शताब्दी के\nग्रंथ में', mr: 'प्रकाश की गति\n14वीं शताब्दी के\nग्रंथ में', ta: 'SPEED OF LIGHT\nIN A 14TH CENTURY\nTEXT', te: 'SPEED OF LIGHT\nIN A 14TH CENTURY\nTEXT', bn: 'SPEED OF LIGHT\nIN A 14TH CENTURY\nTEXT', kn: 'SPEED OF LIGHT\nIN A 14TH CENTURY\nTEXT', gu: 'SPEED OF LIGHT\nIN A 14TH CENTURY\nTEXT' },
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Sayana\'s commentary on Rig Veda', hi: 'सायण की ऋग्वेद टीका' },
        body: { en: 'In his 14th century commentary on Rig Veda hymn 1.50.4 (a hymn to the Sun), Sayana describes the speed at which sunlight travels.', hi: 'ऋग्वेद सूक्त 1.50.4 (सूर्य स्तुति) पर अपनी 14वीं शताब्दी की टीका में, सायण ने सूर्य के प्रकाश की गति का वर्णन किया।', sa: 'ऋग्वेद सूक्त 1.50.4 (सूर्य स्तुति) पर अपनी 14वीं शताब्दी की टीका में, सायण ने सूर्य के प्रकाश की गति का वर्णन किया।', mai: 'ऋग्वेद सूक्त 1.50.4 (सूर्य स्तुति) पर अपनी 14वीं शताब्दी की टीका में, सायण ने सूर्य के प्रकाश की गति का वर्णन किया।', mr: 'ऋग्वेद सूक्त 1.50.4 (सूर्य स्तुति) पर अपनी 14वीं शताब्दी की टीका में, सायण ने सूर्य के प्रकाश की गति का वर्णन किया।', ta: 'In his 14th century commentary on Rig Veda hymn 1.50.4 (a hymn to the Sun), Sayana describes the speed at which sunlight travels.', te: 'In his 14th century commentary on Rig Veda hymn 1.50.4 (a hymn to the Sun), Sayana describes the speed at which sunlight travels.', bn: 'In his 14th century commentary on Rig Veda hymn 1.50.4 (a hymn to the Sun), Sayana describes the speed at which sunlight travels.', kn: 'In his 14th century commentary on Rig Veda hymn 1.50.4 (a hymn to the Sun), Sayana describes the speed at which sunlight travels.', gu: 'In his 14th century commentary on Rig Veda hymn 1.50.4 (a hymn to the Sun), Sayana describes the speed at which sunlight travels.' },
        bgColor: '#1a1040',
      },
      {
        type: 'quote',
        heading: { en: '"2,202 yojanas in half a nimesha"', hi: '"अर्ध निमेष में 2,202 योजन"', sa: '"अर्ध निमेष में 2,202 योजन"', mai: '"अर्ध निमेष में 2,202 योजन"', mr: '"अर्ध निमेष में 2,202 योजन"', ta: '"2,202 yojanas in half a nimesha"', te: '"2,202 yojanas in half a nimesha"', bn: '"2,202 yojanas in half a nimesha"', kn: '"2,202 yojanas in half a nimesha"', gu: '"2,202 yojanas in half a nimesha"' },
        body: { en: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."', hi: '"योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण" — अर्ध निमेष में 2,202 योजन।', sa: '"योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण" — अर्ध निमेष में 2,202 योजन।', mai: '"योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण" — अर्ध निमेष में 2,202 योजन।', mr: '"योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण" — अर्ध निमेष में 2,202 योजन।', ta: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."', te: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."', bn: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."', kn: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."', gu: 'योजनानां सहस्रं द्वे द्वे शते द्वे च योजने। एकेन निमिषार्धेन क्रममाण — "Two thousand, two hundred and two yojanas in half a nimesha."' },
        sourceText: { en: 'Rig Veda 1.50.4, Sayana\'s commentary', hi: 'ऋग्वेद 1.50.4, सायण भाष्य' },
        bgColor: '#2a1a0a',
      },
      {
        type: 'fact',
        heading: { en: 'Calculated: ~186,536 miles per second', hi: 'गणना: ~186,536 मील प्रति सेकंड', sa: 'गणना: ~186,536 मील प्रति सेकंड', mai: 'गणना: ~186,536 मील प्रति सेकंड', mr: 'गणना: ~186,536 मील प्रति सेकंड', ta: 'Calculated: ~186,536 miles per second', te: 'Calculated: ~186,536 miles per second', bn: 'Calculated: ~186,536 miles per second', kn: 'Calculated: ~186,536 miles per second', gu: 'Calculated: ~186,536 miles per second' },
        body: { en: 'Using the traditional definitions of yojana (~9 miles) and nimesha (~16/75 seconds), the value works out to approximately 186,536 miles per second.', hi: 'योजन (~9 मील) और निमेष (~16/75 सेकंड) की पारंपरिक परिभाषाओं का उपयोग करते हुए, यह मान लगभग 186,536 मील प्रति सेकंड बनता है।', sa: 'योजन (~9 मील) और निमेष (~16/75 सेकंड) की पारंपरिक परिभाषाओं का उपयोग करते हुए, यह मान लगभग 186,536 मील प्रति सेकंड बनता है।', mai: 'योजन (~9 मील) और निमेष (~16/75 सेकंड) की पारंपरिक परिभाषाओं का उपयोग करते हुए, यह मान लगभग 186,536 मील प्रति सेकंड बनता है।', mr: 'योजन (~9 मील) और निमेष (~16/75 सेकंड) की पारंपरिक परिभाषाओं का उपयोग करते हुए, यह मान लगभग 186,536 मील प्रति सेकंड बनता है।', ta: 'Using the traditional definitions of yojana (~9 miles) and nimesha (~16/75 seconds), the value works out to approximately 186,536 miles per second.', te: 'Using the traditional definitions of yojana (~9 miles) and nimesha (~16/75 seconds), the value works out to approximately 186,536 miles per second.', bn: 'Using the traditional definitions of yojana (~9 miles) and nimesha (~16/75 seconds), the value works out to approximately 186,536 miles per second.', kn: 'Using the traditional definitions of yojana (~9 miles) and nimesha (~16/75 seconds), the value works out to approximately 186,536 miles per second.', gu: 'Using the traditional definitions of yojana (~9 miles) and nimesha (~16/75 seconds), the value works out to approximately 186,536 miles per second.' },
        stat: '186,536',
        bgColor: '#0a2a1a',
      },
      {
        type: 'fact',
        heading: { en: 'Modern value: 186,282 miles per second', hi: 'आधुनिक मान: 186,282 मील प्रति सेकंड', sa: 'आधुनिक मान: 186,282 मील प्रति सेकंड', mai: 'आधुनिक मान: 186,282 मील प्रति सेकंड', mr: 'आधुनिक मान: 186,282 मील प्रति सेकंड', ta: 'Modern value: 186,282 miles per second', te: 'Modern value: 186,282 miles per second', bn: 'Modern value: 186,282 miles per second', kn: 'Modern value: 186,282 miles per second', gu: 'Modern value: 186,282 miles per second' },
        body: { en: 'The scientifically measured speed of light in a vacuum is 186,282 miles per second (299,792 km/s).', hi: 'निर्वात में प्रकाश की वैज्ञानिक रूप से मापी गई गति 186,282 मील प्रति सेकंड (299,792 किमी/से) है।', sa: 'निर्वात में प्रकाश की वैज्ञानिक रूप से मापी गई गति 186,282 मील प्रति सेकंड (299,792 किमी/से) है।', mai: 'निर्वात में प्रकाश की वैज्ञानिक रूप से मापी गई गति 186,282 मील प्रति सेकंड (299,792 किमी/से) है।', mr: 'निर्वात में प्रकाश की वैज्ञानिक रूप से मापी गई गति 186,282 मील प्रति सेकंड (299,792 किमी/से) है।', ta: 'The scientifically measured speed of light in a vacuum is 186,282 miles per second (299,792 km/s).', te: 'The scientifically measured speed of light in a vacuum is 186,282 miles per second (299,792 km/s).', bn: 'The scientifically measured speed of light in a vacuum is 186,282 miles per second (299,792 km/s).', kn: 'The scientifically measured speed of light in a vacuum is 186,282 miles per second (299,792 km/s).', gu: 'The scientifically measured speed of light in a vacuum is 186,282 miles per second (299,792 km/s).' },
        stat: '186,282',
        bgColor: '#1a0a30',
      },
      {
        type: 'comparison',
        heading: { en: 'Accuracy: 0.14% Error', hi: 'सटीकता: 0.14% त्रुटि', sa: 'सटीकता: 0.14% त्रुटि', mai: 'सटीकता: 0.14% त्रुटि', mr: 'सटीकता: 0.14% त्रुटि', ta: 'Accuracy: 0.14% Error', te: 'Accuracy: 0.14% Error', bn: 'Accuracy: 0.14% Error', kn: 'Accuracy: 0.14% Error', gu: 'Accuracy: 0.14% Error' },
        body: { en: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.', hi: 'वैदिक मान और आधुनिक माप के बीच का अंतर मात्र 0.14% है — किसी भी वैज्ञानिक माप से शताब्दियों पहले लिखे ग्रंथ के लिए लगभग असंभव सटीकता।', sa: 'वैदिक मान और आधुनिक माप के बीच का अंतर मात्र 0.14% है — किसी भी वैज्ञानिक माप से शताब्दियों पहले लिखे ग्रंथ के लिए लगभग असंभव सटीकता।', mai: 'वैदिक मान और आधुनिक माप के बीच का अंतर मात्र 0.14% है — किसी भी वैज्ञानिक माप से शताब्दियों पहले लिखे ग्रंथ के लिए लगभग असंभव सटीकता।', mr: 'वैदिक मान और आधुनिक माप के बीच का अंतर मात्र 0.14% है — किसी भी वैज्ञानिक माप से शताब्दियों पहले लिखे ग्रंथ के लिए लगभग असंभव सटीकता।', ta: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.', te: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.', bn: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.', kn: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.', gu: 'The difference between the Vedic value and the modern measurement is just 0.14% — an almost impossibly accurate figure for a text written centuries before any scientific measurement.' },
        stat: '0.14%',
        bgColor: '#0a1a3a',
      },
      {
        type: 'fact',
        heading: { en: 'Ole Romer measured it 300 years later', hi: 'ओले रोमर ने 300 वर्ष बाद मापा', sa: 'ओले रोमर ने 300 वर्ष बाद मापा', mai: 'ओले रोमर ने 300 वर्ष बाद मापा', mr: 'ओले रोमर ने 300 वर्ष बाद मापा', ta: 'Ole Romer measured it 300 years later', te: 'Ole Romer measured it 300 years later', bn: 'Ole Romer measured it 300 years later', kn: 'Ole Romer measured it 300 years later', gu: 'Ole Romer measured it 300 years later' },
        body: { en: 'The first European measurement of the speed of light came from Danish astronomer Ole Romer in 1676 — roughly 300 years after Sayana\'s commentary.', hi: 'प्रकाश की गति का पहला यूरोपीय माप 1676 में डेनिश खगोलशास्त्री ओले रोमर से आया — सायण की टीका के लगभग 300 वर्ष बाद।' },
        bgColor: '#1a1040',
      },
      {
        type: 'cta',
        heading: { en: 'Read the Full Story', hi: 'पूरी कहानी पढ़ें', sa: 'पूरी कहानी पढ़ें', mai: 'पूरी कहानी पढ़ें', mr: 'पूरी कहानी पढ़ें', ta: 'Read the Full Story', te: 'Read the Full Story', bn: 'Read the Full Story', kn: 'Read the Full Story', gu: 'Read the Full Story' },
        body: { en: 'How an ancient hymn to the Sun encoded a value that modern science took centuries to measure.', hi: 'कैसे सूर्य की एक प्राचीन स्तुति ने वह मान संकेतित किया जिसे मापने में आधुनिक विज्ञान को शताब्दियाँ लगीं।', sa: 'कैसे सूर्य की एक प्राचीन स्तुति ने वह मान संकेतित किया जिसे मापने में आधुनिक विज्ञान को शताब्दियाँ लगीं।', mai: 'कैसे सूर्य की एक प्राचीन स्तुति ने वह मान संकेतित किया जिसे मापने में आधुनिक विज्ञान को शताब्दियाँ लगीं।', mr: 'कैसे सूर्य की एक प्राचीन स्तुति ने वह मान संकेतित किया जिसे मापने में आधुनिक विज्ञान को शताब्दियाँ लगीं।', ta: 'How an ancient hymn to the Sun encoded a value that modern science took centuries to measure.', te: 'How an ancient hymn to the Sun encoded a value that modern science took centuries to measure.', bn: 'How an ancient hymn to the Sun encoded a value that modern science took centuries to measure.', kn: 'How an ancient hymn to the Sun encoded a value that modern science took centuries to measure.', gu: 'How an ancient hymn to the Sun encoded a value that modern science took centuries to measure.' },
        bgColor: '#0a1a3a',
      },
    ],
  },
];

export function getStoryBySlug(slug: string): WebStory | undefined {
  return WEB_STORIES.find(s => s.slug === slug);
}

export function getAllStorySlugs(): string[] {
  return WEB_STORIES.map(s => s.slug);
}

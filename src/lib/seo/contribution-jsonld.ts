/**
 * JSON-LD structured data generator for contribution pages.
 * Produces Article + FAQPage schemas for SEO.
 */

const BASE_URL = 'https://dekhopanchang.com';
const PUBLISHER = {
  '@type': 'Organization' as const,
  name: 'Dekho Panchang',
  url: BASE_URL,
};

interface FAQItem {
  question: string;
  answer: string;
}

interface ContributionJsonLdParams {
  slug: string;
  headline: string;
  description: string;
  datePublished: string;
  faqs: FAQItem[];
}

export function generateContributionJsonLd({
  slug,
  headline,
  description,
  datePublished,
  faqs,
}: ContributionJsonLdParams) {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: PUBLISHER,
    publisher: PUBLISHER,
    datePublished,
    dateModified: '2026-04-11',
    image: `${BASE_URL}/learn/contributions/${slug}/opengraph-image`,
    url: `${BASE_URL}/en/learn/contributions/${slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/en/learn/contributions/${slug}`,
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Learn',
        item: `${BASE_URL}/en/learn`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: headline,
        item: `${BASE_URL}/en/learn/contributions/${slug}`,
      },
    ],
  };

  return { articleJsonLd, faqJsonLd, breadcrumbJsonLd };
}

/**
 * Pre-defined structured data for all 14 contribution pages.
 */
export const CONTRIBUTION_JSONLD: Record<string, ContributionJsonLdParams> = {
  sine: {
    slug: 'sine',
    headline: 'Did You Know "Sine" Is a Sanskrit Word?',
    description:
      'The sine function was invented in India by Aryabhata in 499 CE. The word "sine" comes from Sanskrit "Jya" (bowstring) through Arabic and Latin mistranslation.',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'Who invented the sine function?',
        answer:
          'Aryabhata created the world\'s first sine table in 499 CE in the Aryabhatiya. He computed 24 values of Jya (sine) at 3.75-degree intervals, accurate to 3-4 decimal places.',
      },
      {
        question: 'What does "sine" mean in Sanskrit?',
        answer:
          'Sine comes from the Sanskrit word "Jya" (ज्या) meaning bowstring. It was transliterated to Arabic as "Jiba," misread as "Jaib" (pocket), then translated to Latin "Sinus" (fold), becoming English "Sine."',
      },
      {
        question: 'How accurate was Aryabhata\'s sine table?',
        answer:
          'Aryabhata\'s values from 499 CE have a worst-case deviation under 0.2% compared to modern IEEE 754 double-precision values. For most angles, the error is under 0.05%.',
      },
    ],
  },

  zero: {
    slug: 'zero',
    headline: 'Zero — The Most Dangerous Idea in History',
    description:
      'Zero was invented in India. Brahmagupta defined zero arithmetic in 628 CE. The Bakhshali manuscript (c. 300 CE) contains the oldest physical zero dot on Earth.',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'Who invented zero?',
        answer:
          'Brahmagupta formally defined zero as a number with arithmetic rules in his Brahmasphutasiddhanta (628 CE). The Bakhshali manuscript (c. 300 CE) contains an even older placeholder zero dot.',
      },
      {
        question: 'Why was zero considered dangerous?',
        answer:
          'The concept of "nothing" as a number challenged philosophical and religious frameworks. Florence banned Hindu-Arabic numerals in 1299 CE, and the Church considered zero theologically problematic. It took 300 years for Europe to accept it.',
      },
      {
        question: 'How did zero travel from India to Europe?',
        answer:
          'Al-Khwarizmi studied Indian numerals in 825 CE in Baghdad. Fibonacci encountered them in North Africa and published Liber Abaci in 1202 CE, introducing Hindu-Arabic numerals to Europe.',
      },
    ],
  },

  pi: {
    slug: 'pi',
    headline: 'Pi = 3.1416 — How Aryabhata Nailed It in 499 CE',
    description:
      'Aryabhata computed pi accurate to 4 decimal places in 499 CE and hinted at its irrationality 1,262 years before Lambert proved it in Europe.',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'How did Aryabhata calculate pi?',
        answer:
          'In Aryabhatiya verse 10 (499 CE), Aryabhata encoded: (100+4) x 8 + 62,000 = 62,832. Divided by diameter 20,000 gives 3.1416 — accurate to 0.0001% of the true value.',
      },
      {
        question: 'Did Aryabhata know pi was irrational?',
        answer:
          'Aryabhata used the word "asannah" (approaching/approximate), implying he knew pi could not be expressed exactly as a fraction. Lambert formally proved irrationality in 1761 — 1,262 years later.',
      },
      {
        question: 'Who computed pi to 11 decimal places?',
        answer:
          'Madhava of Sangamagrama (~1350 CE, Kerala) computed pi to 11 decimal places using infinite series, 300 years before Leibniz published the same formula in 1676.',
      },
    ],
  },

  binary: {
    slug: 'binary',
    headline: 'Binary Code — 1,800 Years Before Computers',
    description:
      'Pingala invented binary encoding around 200 BCE while studying Sanskrit poetry meters. He also discovered Pascal\'s Triangle and the Fibonacci sequence.',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'Who invented binary code?',
        answer:
          'Pingala, an Indian mathematician (~200 BCE), invented binary encoding in his Chandahshastra while cataloguing Sanskrit poetic meters. He assigned laghu (light) = 0 and guru (heavy) = 1.',
      },
      {
        question: 'What is Meru Prastara?',
        answer:
          'Meru Prastara (Mountain Arrangement) is Pingala\'s name for what Europe calls Pascal\'s Triangle. Pingala described it around 200 BCE — 1,850 years before Pascal published it in 1653 CE.',
      },
      {
        question: 'Did Pingala discover the Fibonacci sequence?',
        answer:
          'Yes. Pingala\'s "Mishrau cha" (mixing rule) generates Fibonacci numbers by counting meter combinations. This predates Fibonacci\'s publication by approximately 1,400 years.',
      },
    ],
  },

  calculus: {
    slug: 'calculus',
    headline: 'Calculus Was Invented in Kerala, Not Cambridge',
    description:
      'Madhava of Sangamagrama discovered infinite series for pi, sine, cosine, and arctangent around 1375 CE — 250-300 years before Newton and Leibniz.',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'Did India invent calculus before Newton?',
        answer:
          'Madhava of Sangamagrama (~1340-1425 CE) discovered infinite series for pi, sine, cosine, and arctangent with rigorous proofs, 250-300 years before Newton and Leibniz. The Kerala texts contain full epsilon-delta style convergence proofs.',
      },
      {
        question: 'What is the Kerala School of Mathematics?',
        answer:
          'A 200-year mathematical tradition founded by Madhava in Kerala, India. Key figures include Parameshvara, Nilakantha Somayaji, and Jyeshthadeva, who produced texts with complete proofs of infinite series.',
      },
      {
        question: 'Did Kerala mathematics reach Europe?',
        answer:
          'Jesuit missionaries were active in Kerala from the 1500s and had access to Indian manuscripts. However, no direct evidence of transmission has been found. What is undisputed is that the priority of discovery is Indian.',
      },
    ],
  },

  'cosmic-time': {
    slug: 'cosmic-time',
    headline: '4.32 Billion Years — How Did the Ancients Know?',
    description:
      'Ancient Indian texts describe cosmic cycles of 4.32 billion years — within 5% of the modern scientific estimate for Earth\'s age (4.54 billion years).',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'What is a Kalpa in Hindu cosmology?',
        answer:
          'A Kalpa is one "day of Brahma," equal to 4.32 billion years. It consists of 1,000 Mahayugas. This value falls within 5% of Earth\'s scientifically measured age of 4.54 billion years.',
      },
      {
        question: 'What are the four Yugas?',
        answer:
          'The four Yugas follow a 4:3:2:1 ratio: Satya Yuga (1,728,000 years), Treta Yuga (1,296,000 years), Dvapara Yuga (864,000 years), and Kali Yuga (432,000 years). Together they form one Mahayuga of 4,320,000 years.',
      },
      {
        question: 'What did Carl Sagan say about Hindu cosmology?',
        answer:
          'Carl Sagan noted that Hinduism is "the only religion in which the time scales correspond to those of modern scientific cosmology," with cycles running up to 8.64 billion years — longer than the age of Earth or the Sun.',
      },
    ],
  },

  'earth-rotation': {
    slug: 'earth-rotation',
    headline: 'India Knew the Earth Rotates — 1,000 Years Before Europe',
    description:
      'In 499 CE, Aryabhata stated that the Earth rotates on its axis, causing stars to appear to rise and set. He also calculated Earth\'s circumference to 99.4% accuracy.',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'Who first said the Earth rotates?',
        answer:
          'Aryabhata wrote in 499 CE (Aryabhatiya, Golapada verse 9) that the Earth rotates on its axis and the apparent movement of stars is due to this rotation — using a boat analogy similar to Galileo\'s argument 1,100 years later.',
      },
      {
        question: 'How accurate was Aryabhata\'s Earth circumference?',
        answer:
          'Aryabhata calculated Earth\'s circumference as 4,967 yojanas (approximately 39,736 miles). The modern value is 24,901 miles (40,075 km). His result was 99.4% accurate for a measurement made in 499 CE.',
      },
      {
        question: 'Did other Indian astronomers agree with Aryabhata?',
        answer:
          'Brahmagupta (628 CE) famously disagreed, arguing that a thrown stone would land far to the west if Earth rotated. This shows India had active scientific debate about Earth\'s motion centuries before Europe.',
      },
    ],
  },

  fibonacci: {
    slug: 'fibonacci',
    headline: "The 'Fibonacci' Sequence Was Indian — And It Started With Music",
    description:
      'The Fibonacci sequence was described by Bharata Muni (~200 BCE) in the Natyashastra, Virahanka (~600 CE), and Hemachandra (1150 CE) — all before Fibonacci (1202 CE).',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'Who really discovered the Fibonacci sequence?',
        answer:
          'The earliest known description is from Bharata Muni\'s Natyashastra (~200 BCE) in the context of musical rhythm patterns. Virahanka (~600 CE) gave the first explicit recurrence relation F(n) = F(n-1) + F(n-2). Fibonacci published it in 1202 CE.',
      },
      {
        question: 'How did the Fibonacci sequence arise from music?',
        answer:
          'Bharata Muni counted all possible combinations of short (druta) and long (vilambit) beats that fill a rhythmic cycle of N matras (time units). The counts follow the Fibonacci pattern: 1, 2, 3, 5, 8, 13...',
      },
      {
        question: 'What is the Hemachandra-Fibonacci sequence?',
        answer:
          'Jain mathematician Hemachandra independently derived the same sequence in his Chandonushasana (1150 CE) — 52 years before Fibonacci\'s Liber Abaci. Some modern histories call it the Hemachandra-Fibonacci sequence.',
      },
    ],
  },

  gravity: {
    slug: 'gravity',
    headline: "Gravity — 500 Years Before Newton's Apple",
    description:
      'Bhaskaracharya II wrote in 1150 CE that the Earth attracts objects by its own force in all directions — 537 years before Newton\'s Principia.',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'Did Indians know about gravity before Newton?',
        answer:
          'Bhaskaracharya II (1150 CE) wrote in the Siddhanta Shiromani that the Earth attracts objects by its own force and this force acts in all directions — 537 years before Newton\'s Principia (1687).',
      },
      {
        question: 'What is the Sanskrit verse about gravity?',
        answer:
          'Bhaskaracharya wrote: "The Earth, by its inherent nature/force, draws objects toward itself" (Siddhanta Shiromani, Goladhyaya). Newton later quantified this with the inverse-square law.',
      },
      {
        question: 'How is Indian gravity different from Newton\'s?',
        answer:
          'Bhaskaracharya described gravitational attraction qualitatively — that Earth pulls objects in all directions. Newton quantified it with F = Gm1m2/r2 and proved it was universal. India described the phenomenon; Newton gave the mathematics.',
      },
    ],
  },

  'kerala-school': {
    slug: 'kerala-school',
    headline: 'The Kerala School — When India Invented Calculus 250 Years Before Europe',
    description:
      'Between 1350 and 1550 CE, mathematicians in Kerala discovered infinite series, the foundations of calculus, and computed pi to 11 decimal places — predating Newton by 250 years.',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'What did the Kerala School of Mathematics discover?',
        answer:
          'The Kerala School discovered infinite series for pi, sine, cosine, and arctangent, convergence acceleration techniques, and partial heliocentric planetary models — all 250-340 years before equivalent European discoveries.',
      },
      {
        question: 'Why did the Kerala School develop in Kerala specifically?',
        answer:
          'A unique combination: strong Vedic mathematical tradition, thriving maritime trade demanding precise navigation, stable political patronage under the Zamorins of Calicut, and geographic isolation protecting the tradition from northern invasions.',
      },
      {
        question: 'What is the Yuktibhasha?',
        answer:
          'Written by Jyeshthadeva (~1530 CE), the Yuktibhasha is the first mathematics text to contain full proofs in a vernacular language (Malayalam). It includes complete proofs of infinite series for pi and trigonometric functions.',
      },
    ],
  },

  'negative-numbers': {
    slug: 'negative-numbers',
    headline: "Negative Numbers — When India Said 'Less Than Nothing' and Europe Said 'Impossible'",
    description:
      'Brahmagupta defined formal arithmetic rules for negative numbers in 628 CE, using the concepts of dhana (fortune) and rina (debt). Europe resisted negative numbers until the 18th century.',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'Who invented negative numbers?',
        answer:
          'Brahmagupta gave the first formal arithmetic rules for negative numbers in 628 CE (Brahmasphutasiddhanta, Chapter 18). He used "dhana" (fortune = positive) and "rina" (debt = negative) — practical terms from commerce.',
      },
      {
        question: 'Why did Europe reject negative numbers?',
        answer:
          'European mathematicians called negative numbers "absurd" and "fictitious" well into the 1700s. The concept of "less than nothing" seemed philosophically impossible. Brahmagupta had formalized them 1,100 years earlier.',
      },
      {
        question: 'What rules did Brahmagupta give for negative numbers?',
        answer:
          'Brahmagupta stated: a negative times a negative is positive, a negative times a positive is negative, zero minus a positive is negative, and zero minus a negative is positive — all correct and still used today.',
      },
    ],
  },

  pythagoras: {
    slug: 'pythagoras',
    headline: "The 'Pythagorean' Theorem Was Indian — Baudhayana Had It 300 Years Earlier",
    description:
      'The Baudhayana Sulba Sutra (~800 BCE) contains the earliest known statement of a2 + b2 = c2, nearly 300 years before Pythagoras was born.',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'Did Baudhayana discover the Pythagorean theorem before Pythagoras?',
        answer:
          'Yes. The Baudhayana Sulba Sutra (~800 BCE) contains the explicit general statement of a2 + b2 = c2 for constructing Vedic fire altars. Pythagoras was born around 570 BCE — nearly 300 years later.',
      },
      {
        question: 'What are the Sulba Sutras?',
        answer:
          'The Sulba Sutras are Vedic appendices on geometry for fire altar construction. "Sulba" means cord/rope — these were rope-and-peg geometry manuals. Four survive: Baudhayana (~800 BCE), Apastamba (~600 BCE), Katyayana (~300 BCE), and Manava (~750 BCE).',
      },
      {
        question: 'What else did the Sulba Sutras contain?',
        answer:
          'Beyond the Pythagorean theorem, they contain area-preserving transformations, methods for squaring the circle, approximations of sqrt(2), and construction of complex altar shapes — anticipating integral geometry by two millennia.',
      },
    ],
  },

  'speed-of-light': {
    slug: 'speed-of-light',
    headline: 'The Speed of Light — In a 14th-Century Sanskrit Commentary',
    description:
      'Sayana\'s 14th-century commentary on Rig Veda 1.50.4 gives a value for the speed of sunlight astonishingly close to the modern measurement — 300 years before Ole Romer.',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'Did ancient Indians know the speed of light?',
        answer:
          'Sayana (14th century CE), minister of the Vijayanagara Empire, wrote in his Rig Veda commentary that sunlight traverses 2,202 yojanas in half a nimesha — a value remarkably close to the modern speed of light.',
      },
      {
        question: 'How does Sayana\'s value compare to the modern speed of light?',
        answer:
          'Using standard conversions for yojana and nimesha, Sayana\'s value yields approximately 299,000 km/s — strikingly close to the modern value of 299,792 km/s. Ole Romer made the first European measurement in the 1670s.',
      },
      {
        question: 'What is the source verse for the speed of light?',
        answer:
          'The verse is Rig Veda 1.50.4, a hymn to Surya (the Sun). Sayana\'s prose commentary states: "It is remembered that the Sun\'s light traverses 2,202 yojanas in half a nimesha."',
      },
    ],
  },

  timeline: {
    slug: 'timeline',
    headline: '2,000 Years of Indian Science — A Visual Timeline',
    description:
      'From Vedic mathematics to the Kerala School, India\'s contributions to science span two millennia. Most are still attributed to later European discoverers.',
    datePublished: '2026-04-10',
    faqs: [
      {
        question: 'What major scientific discoveries originated in India?',
        answer:
          'Key Indian discoveries include: zero and negative numbers (Brahmagupta, 628 CE), the sine function (Aryabhata, 499 CE), the Pythagorean theorem (Baudhayana, ~800 BCE), binary code (Pingala, ~200 BCE), infinite series/calculus (Madhava, ~1375 CE), and gravity (Bhaskaracharya, 1150 CE).',
      },
      {
        question: 'Why are Indian scientific discoveries not widely known?',
        answer:
          'Many factors contribute: colonial-era historiography attributed Indian discoveries to European rediscoverers, Sanskrit texts were not widely translated until the 20th century, and Eurocentric narratives dominated science education globally.',
      },
      {
        question: 'What is the attribution gap in science history?',
        answer:
          'The "attribution gap" refers to the pattern of Indian discoveries being credited to later European mathematicians: the Leibniz formula (Madhava, 300 years earlier), Pascal\'s Triangle (Pingala, 1,850 years earlier), Fibonacci numbers (Bharata Muni, 1,400 years earlier), and others.',
      },
    ],
  },
};

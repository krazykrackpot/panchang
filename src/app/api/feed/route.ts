import { NextResponse } from 'next/server';

const BASE_URL = 'https://dekhopanchang.com';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const items = [
  // 14 contribution pages
  {
    title: 'Did You Know "Sine" Is a Sanskrit Word?',
    url: '/en/learn/contributions/sine',
    date: '2026-04-10',
    description: 'Aryabhata invented the sine function in 499 CE. The word "sine" comes from Sanskrit "Jya" through Arabic and Latin mistranslation.',
  },
  {
    title: 'Zero — The Most Dangerous Idea in History',
    url: '/en/learn/contributions/zero',
    date: '2026-04-10',
    description: 'Brahmagupta defined zero arithmetic in 628 CE. The Bakhshali manuscript contains the oldest physical zero dot on Earth.',
  },
  {
    title: 'Pi = 3.1416 — How Aryabhata Nailed It in 499 CE',
    url: '/en/learn/contributions/pi',
    date: '2026-04-10',
    description: 'Aryabhata computed pi accurate to 4 decimal places in 499 CE and hinted at its irrationality 1,262 years before Lambert proved it.',
  },
  {
    title: 'Binary Code — 1,800 Years Before Computers',
    url: '/en/learn/contributions/binary',
    date: '2026-04-10',
    description: "Pingala invented binary encoding around 200 BCE while studying Sanskrit poetry meters. He also discovered Pascal's Triangle and the Fibonacci sequence.",
  },
  {
    title: 'Calculus Was Invented in Kerala, Not Cambridge',
    url: '/en/learn/contributions/calculus',
    date: '2026-04-10',
    description: 'Madhava of Sangamagrama discovered infinite series for pi, sine, cosine, and arctangent around 1375 CE — 250-300 years before Newton and Leibniz.',
  },
  {
    title: '4.32 Billion Years — How Did the Ancients Know?',
    url: '/en/learn/contributions/cosmic-time',
    date: '2026-04-10',
    description: "Ancient Indian texts describe cosmic cycles of 4.32 billion years — within 5% of the modern scientific estimate for Earth's age.",
  },
  {
    title: 'India Knew the Earth Rotates — 1,000 Years Before Europe',
    url: '/en/learn/contributions/earth-rotation',
    date: '2026-04-10',
    description: "In 499 CE, Aryabhata stated that the Earth rotates on its axis. He also calculated Earth's circumference to 99.4% accuracy.",
  },
  {
    title: "The 'Fibonacci' Sequence Was Indian — And It Started With Music",
    url: '/en/learn/contributions/fibonacci',
    date: '2026-04-10',
    description: 'The Fibonacci sequence was described by Bharata Muni (~200 BCE) in the Natyashastra, Virahanka (~600 CE), and Hemachandra (1150 CE) — all before Fibonacci (1202 CE).',
  },
  {
    title: "Gravity — 500 Years Before Newton's Apple",
    url: '/en/learn/contributions/gravity',
    date: '2026-04-10',
    description: "Bhaskaracharya II wrote in 1150 CE that the Earth attracts objects by its own force — 537 years before Newton's Principia.",
  },
  {
    title: 'The Kerala School — When India Invented Calculus 250 Years Before Europe',
    url: '/en/learn/contributions/kerala-school',
    date: '2026-04-10',
    description: 'Between 1350 and 1550 CE, mathematicians in Kerala discovered infinite series and computed pi to 11 decimal places — predating Newton by 250 years.',
  },
  {
    title: "Negative Numbers — When India Said 'Less Than Nothing' and Europe Said 'Impossible'",
    url: '/en/learn/contributions/negative-numbers',
    date: '2026-04-10',
    description: 'Brahmagupta defined formal arithmetic rules for negative numbers in 628 CE. Europe resisted them until the 18th century.',
  },
  {
    title: "The 'Pythagorean' Theorem Was Indian — Baudhayana Had It 300 Years Earlier",
    url: '/en/learn/contributions/pythagoras',
    date: '2026-04-10',
    description: 'The Baudhayana Sulba Sutra (~800 BCE) contains the earliest known statement of a2 + b2 = c2, nearly 300 years before Pythagoras.',
  },
  {
    title: "The Speed of Light — In a 14th-Century Sanskrit Commentary",
    url: '/en/learn/contributions/speed-of-light',
    date: '2026-04-10',
    description: "Sayana's 14th-century commentary on Rig Veda gives a value for the speed of sunlight astonishingly close to the modern measurement — 300 years before Ole Romer.",
  },
  {
    title: '2,000 Years of Indian Science — A Visual Timeline',
    url: '/en/learn/contributions/timeline',
    date: '2026-04-10',
    description: "From Vedic mathematics to the Kerala School, India's contributions to science span two millennia. Most are still attributed to later European discoverers.",
  },

  // Hora learn page
  {
    title: 'Why Exactly 7 Days in a Week? The Hora System Explains',
    url: '/en/learn/hora',
    date: '2026-04-10',
    description: 'The 7-day week comes from the ancient Indian Hora system — derived from Sanskrit "Ahoratra" (day + night). The very concept of an hour may have Indian origins.',
  },

  // Eclipses learn page
  {
    title: 'Grahan — Eclipses in Vedic Astrology',
    url: '/en/learn/eclipses',
    date: '2026-04-10',
    description: 'Eclipses occur when the Sun, Moon, and Earth align at the lunar nodes — Rahu and Ketu. The mythology encodes precise astronomical knowledge.',
  },
];

export async function GET() {
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dekho Panchang — Indian Science &amp; Vedic Astrology</title>
    <link>${BASE_URL}</link>
    <description>Discover India's contributions to science, mathematics, and astronomy</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/api/feed" rel="self" type="application/rss+xml"/>
    ${items.map(item => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${BASE_URL}${item.url}</link>
      <guid>${BASE_URL}${item.url}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`).join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    },
  });
}

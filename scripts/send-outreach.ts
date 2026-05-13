/**
 * Outreach email sender — uses Resend to send personalised emails
 * from admin@dekhopanchang.com to Jyotish YouTube influencers.
 *
 * Usage: npx tsx scripts/send-outreach.ts
 *
 * Fill in the RECIPIENTS array below with email addresses from
 * each channel's YouTube About page, then run.
 */

import 'dotenv/config';

const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
if (!RESEND_API_KEY) {
  console.error('Missing RESEND_API_KEY in .env.local');
  process.exit(1);
}

const FROM = 'Aditya Kumar <admin@dekhopanchang.com>';

interface Recipient {
  name: string;
  email: string;
  channel: string;
  hook: string; // personalised opening line
  highlight: string; // which feature to emphasise
}

// ══════════════════════════════════════════════════════════════
// FILL IN EMAIL ADDRESSES from each channel's YouTube About page
// ══════════════════════════════════════════════════════════════
const RECIPIENTS: Recipient[] = [
  {
    name: 'Kapiel Raaj',
    email: '', // Get from https://www.youtube.com/@KRSchannel/about
    channel: 'KRSchannel',
    hook: 'Your systematic approach to teaching Vedic astrology has inspired millions. We\'ve built something that turns those teachings into a living tool.',
    highlight: 'Our 106 structured learning modules — from "What is a Tithi?" to advanced Jaimini Chara Dasha — complement your video teachings perfectly. Students can practice what you teach with real computation.',
  },
  {
    name: 'Sunil John',
    email: '', // Get from saptarishisastrology.com or YouTube About
    channel: 'Saptarishis Astrology',
    hook: 'Saptarishis has been the gold standard for Jyotish education. We\'ve built a computational platform that your 3,000+ annual students can use alongside your courses.',
    highlight: 'Full KP System (Placidus houses, sub-lords, cuspal significators), Nadi techniques, and 15+ Dasha systems — all free, all citing source texts. Plus our 106-module learning path traces every concept to BPHS, Surya Siddhanta, and Phaladeepika.',
  },
  {
    name: 'Arun Pandit',
    email: '', // Get from astroarunpandit.org or YouTube About
    channel: 'Astro Arun Pandit',
    hook: 'Your "decision-based astrology" philosophy is exactly what we\'ve encoded into software. Our muhurta engine doesn\'t just show data — it makes decisions.',
    highlight: 'Our 36-rule muhurta engine implements the 5-tier cancellation hierarchy from Muhurta Chintamani Ch.7 — the classical principle that strong factors compensate weak ones. Each recommendation explains WHY, with chapter-level citations. This is decision-based astrology as software.',
  },
  {
    name: 'Deepanshu Giri',
    email: '', // Get from YouTube video descriptions
    channel: 'Deepanshu Giri',
    hook: 'Your prediction work for 2026 shows deep technical expertise. We\'ve built the computation tools that serious practitioners like you need.',
    highlight: 'Full KP System with Placidus houses, sub-lord tables, and cuspal significators — free and accurate to arc-seconds via Swiss Ephemeris (NASA JPL DE441). Also: 150+ yoga detection with frequency validation, Jaimini Chara Karakas, and 15+ Dasha systems.',
  },
  {
    name: 'Sohini Sastri',
    email: '', // Get from YouTube About
    channel: 'Dr. Sohini Sastri',
    hook: 'As a Presidential Award-winning astrologer from Kolkata, your endorsement of accurate tools carries immense weight in the Bengali-speaking community.',
    highlight: 'Dekho Panchang supports Bengali (বাংলা) as a full locale — not translated English but proper terminology. Kundali with Tippanni interpretations, 255 festivals including Durga Puja day-by-day and Kali Puja, and Sade Sati analysis all available in Bengali.',
  },
  // Add more as you get their emails
];

function buildEmail(r: Recipient): string {
  return `${r.name} ji,

Namaste. I'm Aditya, founder of Dekho Panchang (dekhopanchang.com). I'm reaching out because your work on ${r.channel} resonates deeply with what we're building.

${r.hook}

Our mission is to spread awareness of India's classical sciences — Jyotish Shastra, Vedic astronomy, the Panchanga tradition — with the accuracy and depth they deserve.

${r.highlight}

What we've built (all free):

Kundali — 25+ analysis modules:
• 16 Varga charts (D1-D60), 15+ Dasha systems, 150+ Yogas with frequency validation
• Full Shadbala, Bhavabala, Ashtakavarga with visual heat maps
• KP System (Placidus, sub-lords, significators) + Jaimini (Chara Karakas, Argala)
• AI-powered Tippanni — narrative interpretation of YOUR chart, not generic text
• Nadi Amsha (D-150) with karmic synthesis

Muhurta — 36 rules from 7 classical texts:
• 5-tier cancellation hierarchy (MC Ch.7: "a properly chosen lagna removes all defects")
• Godhuli Lagna override (Brihat Samhita Ch.103)
• Each window explains WHY with chapter-level citations — like a classically trained Jyotishi

Learning — 106 structured modules:
• From basics to advanced Jaimini, every concept traced to source texts
• BPHS, Surya Siddhanta, Phaladeepika, Muhurta Chintamani

Accuracy: Swiss Ephemeris (NASA JPL DE441), cross-validated against Drik Panchang across timezones — 100% match. 11 ayanamsha systems. 255 festivals. 10 languages.

We're bootstrapped and building with devotion. If you explore the tool and find value, a mention to your audience would mean everything. And if you have criticism — I welcome that even more.

With respect,
Aditya Kumar
https://dekhopanchang.com`;
}

async function sendEmail(r: Recipient): Promise<boolean> {
  if (!r.email) {
    console.log(`SKIP: ${r.name} (${r.channel}) — no email address`);
    return false;
  }

  const body = {
    from: FROM,
    to: [r.email],
    subject: `Dekho Panchang — a free Jyotish platform built for serious practitioners`,
    text: buildEmail(r),
  };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`SENT: ${r.name} (${r.channel}) → ${r.email} [id: ${data.id}]`);
      return true;
    } else {
      const err = await res.text();
      console.error(`FAIL: ${r.name} (${r.channel}) → ${r.email} [${res.status}: ${err}]`);
      return false;
    }
  } catch (err) {
    console.error(`ERROR: ${r.name} (${r.channel}) →`, err);
    return false;
  }
}

async function main() {
  console.log('=== Dekho Panchang Outreach ===\n');

  const toSend = RECIPIENTS.filter(r => r.email);
  const toSkip = RECIPIENTS.filter(r => !r.email);

  if (toSkip.length > 0) {
    console.log(`Skipping ${toSkip.length} recipients (no email):`);
    toSkip.forEach(r => console.log(`  - ${r.name} (${r.channel})`));
    console.log('');
  }

  if (toSend.length === 0) {
    console.log('No recipients with email addresses. Fill in the RECIPIENTS array first.');
    process.exit(0);
  }

  console.log(`Sending to ${toSend.length} recipients...\n`);

  let sent = 0;
  for (const r of toSend) {
    const ok = await sendEmail(r);
    if (ok) sent++;
    // Rate limit: 1 email per 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\nDone. ${sent}/${toSend.length} emails sent.`);
}

main();

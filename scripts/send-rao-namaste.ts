#!/usr/bin/env tsx
/**
 * One-off founder welcome to Rao Jitendra Shitole (astrologer).
 * Modeled on scripts/send-hanumanth-nps.ts. Sender:
 * namaste@dekhopanchang.com (Resend-verified). BCC: aditya.kr.jha
 * so the founder has a copy in his own inbox.
 */
import { Resend } from 'resend';
import { config as loadEnv } from 'dotenv';
loadEnv({
  path: '/Users/adityakumar/Desktop/venture/panchang/.claude/worktrees/bug-hunt-may-2026/.env.local',
});

const RECIPIENT_EMAIL = 'raojitendrashitole7@gmail.com';
const RECIPIENT_NAME = 'Shri Rao Jitendra Shitole-ji';
const BCC_EMAIL = 'aditya.kr.jha@gmail.com';
const FEEDBACK_INBOX = 'namaste@dekhopanchang.com';

function npsButton(score: number): string {
  const subject = encodeURIComponent(`NPS ${score} — Dekho Panchang`);
  const body = encodeURIComponent(`My score: ${score}\n\nReason: `);
  const mailto = `mailto:${FEEDBACK_INBOX}?subject=${subject}&body=${body}`;
  const isPromoter = score >= 9;
  const isDetractor = score <= 6;
  const bg = isPromoter ? '#2d5f3f' : isDetractor ? '#7a3a3a' : '#5a5a5a';
  return `<td style="padding: 0 2px;"><a href="${mailto}" style="display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; background: ${bg}; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 6px;">${score}</a></td>`;
}

const buttons = Array.from({ length: 11 }, (_, i) => npsButton(i)).join('');

const html = `<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Helvetica, sans-serif; max-width: 580px; margin: 32px auto; color: #1a1a1a; line-height: 1.65; padding: 0 16px;">

  <p style="margin: 0 0 18px;">Namaste ${RECIPIENT_NAME},</p>

  <p>I noticed you joined Dekho Panchang. I wanted to write to you personally — to welcome you, and to share two things.</p>

  <p style="margin-top: 22px;"><strong>A small gift.</strong> I have added 2 free Brihaspati credits to your account. Brihaspati is our AI sage trained on classical Jyotish texts — Parashara, Phaladeepika, Jaimini — and it answers personal questions about your chart with citations to the relevant rule. These 2 credits are valid for 30 days. You can find Brihaspati from your <a href="https://dekhopanchang.com/dashboard" style="color: #8a6d2b;">dashboard</a>.</p>

  <p style="margin-top: 22px;"><strong>A new feature for fellow Jyotishis.</strong> We have just shipped a Pandit Dashboard — a free CRM built specifically for Indian astrologers. You can keep up to 5 clients on the free tier: store their birth data, receive automated alerts for Sade Sati onset, Mahadasha changes, and client birthdays, and keep your notes per client. To enable it, visit <a href="https://dekhopanchang.com/dashboard/settings" style="color: #8a6d2b;">dashboard → settings</a> and switch your account type to Pandit.</p>

  <p style="margin-top: 22px;">If our work helps your practice — even a fraction — I would value your honest feedback. On a scale of 0 to 10:</p>

  <p style="font-weight: 600; margin: 16px 0 12px;">How likely are you to recommend Dekho Panchang to a fellow astrologer or to a sincere seeker?</p>

  <table cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 24px;">
    <tr>${buttons}</tr>
  </table>

  <p>And if you find us worth recommending — please do spread the word. Every Jyotishi who tries us and tells one other astrologer is how we grow. We are a small team building this with care, and your network's trust means more than any advertisement.</p>

  <p style="margin-top: 24px;">I read every reply personally — feel free to tell me what is working, what is broken, what you wish we had.</p>

  <p style="margin-top: 32px;">— Aditya<br>
  <span style="color: #6a6a6a; font-size: 14px;">Founder, Dekho Panchang<br>
  <a href="https://dekhopanchang.com" style="color: #8a6d2b;">dekhopanchang.com</a></span></p>

  <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 13px; color: #6a6a6a;">
    <strong>P.S.</strong> The 2 free Brihaspati credits are already in your account. Log in at <a href="https://dekhopanchang.com" style="color: #8a6d2b;">dekhopanchang.com</a> and ask your first question whenever a worthy one comes to mind.
  </p>

</body>
</html>`;

async function main() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.error('RESEND_API_KEY missing');
    process.exit(1);
  }
  const resend = new Resend(key);

  const result = await resend.emails.send({
    from: 'Dekho Panchang <namaste@dekhopanchang.com>',
    to: RECIPIENT_EMAIL,
    bcc: BCC_EMAIL,
    subject: 'Namaste Shri Rao Jitendra-ji — welcome, with a small gift',
    html,
    replyTo: FEEDBACK_INBOX,
  });

  if (result.error) {
    console.error('Send failed:');
    console.error(JSON.stringify(result.error, null, 2));
    process.exit(1);
  }
  console.log(
    `Sent OK to ${RECIPIENT_EMAIL} (bcc ${BCC_EMAIL}). Message ID:`,
    result.data?.id,
  );
}

main();

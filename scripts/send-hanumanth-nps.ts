#!/usr/bin/env tsx
/**
 * One-off NPS / feedback email to Mr Hanumanth Rao.
 * Sender: namaste@dekhopanchang.com (Resend-verified).
 * Privacy: never references the Brihaspati question/answer content.
 */
import { Resend } from 'resend';
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });

const RECIPIENT_EMAIL = 'khrao60@gmail.com';
const RECIPIENT_NAME = 'Mr Hanumanth Rao';
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
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Helvetica, sans-serif; max-width: 560px; margin: 32px auto; color: #1a1a1a; line-height: 1.6; padding: 0 16px;">

  <p style="margin: 0 0 16px;">Dear ${RECIPIENT_NAME},</p>

  <p>Thank you for using Dekho Panchang earlier this week and for trusting us with a Brihaspati reading. We are building this for people who want Vedic astrology done with precision — and your honest feedback is what shapes what we ship next.</p>

  <p style="margin-top: 24px;">One quick question:</p>

  <p style="font-weight: 600; margin: 16px 0 12px;">On a scale of 0 to 10, how likely are you to recommend Dekho Panchang to a friend or family member?</p>

  <table cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0 28px;">
    <tr>${buttons}</tr>
  </table>

  <p>If you have 30 seconds more, just hit reply and tell me why you picked that number — whether it is "this changed how I look at my chart" or "X feature is broken," I read every reply personally.</p>

  <p style="margin-top: 24px; padding: 14px 18px; background: #f5f1e8; border-left: 3px solid #d4a853; border-radius: 4px; font-size: 14px; color: #4a4a4a;">
    <strong>A note on privacy:</strong> I never read the content of your Brihaspati question or the reading itself — those stay between you and the system. I am only asking about your overall experience with the product.
  </p>

  <p style="margin-top: 32px;">— Aditya<br>
  <span style="color: #6a6a6a; font-size: 14px;">Founder, Dekho Panchang<br>
  <a href="https://dekhopanchang.com" style="color: #8a6d2b;">dekhopanchang.com</a></span></p>

  <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; font-size: 13px; color: #6a6a6a;">
    <strong>P.S.</strong> Your Brihaspati reading is saved to your account — you can return to it any time from your <a href="https://dekhopanchang.com/dashboard" style="color: #8a6d2b;">dashboard</a>.
  </p>

</body>
</html>`;

async function main() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) { console.error('RESEND_API_KEY missing'); process.exit(1); }
  const resend = new Resend(key);

  const result = await resend.emails.send({
    from: 'Dekho Panchang <namaste@dekhopanchang.com>',
    to: RECIPIENT_EMAIL,
    subject: 'One quick question about your Dekho Panchang experience',
    html,
    replyTo: FEEDBACK_INBOX,
  });

  if (result.error) {
    console.error('Send failed:');
    console.error(JSON.stringify(result.error, null, 2));
    process.exit(1);
  }
  console.log(`Sent OK to ${RECIPIENT_EMAIL}. Message ID:`, result.data?.id);
}

main();

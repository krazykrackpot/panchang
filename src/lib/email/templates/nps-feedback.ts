// NPS / feedback email — sent 3 days after a user's first real engagement
// (saved a chart OR paid for a Brihaspati reading). Topic-free per the
// project's Brihaspati confidentiality rule: never references the
// question/answer content of a Brihaspati reading, only that one was
// generated.

import { signNpsToken } from '@/lib/nps/token';

const FEEDBACK_INBOX = 'namaste@dekhopanchang.com';
const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://dekhopanchang.com').replace(/\/$/, '');

type Engagement = 'chart' | 'brihaspati' | 'both';

function npsButton(score: number, token: string): string {
  // One signed HTTPS link per score button. Same token for all 11 — only
  // the score query-param changes. The endpoint upserts on
  // (user_id, source) so a respondent who reconsiders and clicks a
  // different score replaces their old answer instead of duplicating.
  const url = `${SITE_ORIGIN}/api/feedback/nps?score=${score}&token=${encodeURIComponent(token)}`;
  const isPromoter = score >= 9;
  const isDetractor = score <= 6;
  const bg = isPromoter ? '#2d5f3f' : isDetractor ? '#7a3a3a' : '#5a5a5a';
  return `<td style="padding:0 2px"><a href="${url}" style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;background:${bg};color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;border-radius:6px;">${score}</a></td>`;
}

function buildNpsButtonsRow(token: string): string {
  return Array.from({ length: 11 }, (_, i) => npsButton(i, token)).join('');
}

function brihaspatiPostscript(engagement: Engagement): string {
  if (engagement === 'chart') {
    return `<p style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e5e5;font-size:13px;color:#6a6a6a;"><strong>P.S.</strong> Your kundali is saved to your dashboard — return any time to add a transit overlay, dasha view, or ask Brihaspati a question.</p>`;
  }
  return `<p style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e5e5;font-size:13px;color:#6a6a6a;"><strong>P.S.</strong> Your Brihaspati reading is saved to your account — you can return to it any time from your <a href="https://dekhopanchang.com/dashboard" style="color:#8a6d2b;">dashboard</a>.</p>`;
}

/**
 * Build the NPS feedback email for a given user + engagement type.
 *
 * Privacy contract: this template MUST NOT reference Brihaspati
 * question/answer content. `engagement` only distinguishes between
 * "saved a chart", "paid for a reading", or "both" — never the topic.
 */
export function npsFeedbackEmail({
  displayName,
  engagement,
  userId,
}: {
  displayName: string;
  engagement: Engagement;
  userId: string;
}): { subject: string; html: string } {
  const token = signNpsToken(userId);
  const npsButtonsRow = buildNpsButtonsRow(token);
  const trimmedName = displayName.trim();
  // `displayName` originates from user-provided `user_metadata.name` /
  // `display_name`. Escape before interpolating into the HTML body —
  // otherwise a name containing < or " could break out of the greeting
  // and inject markup. Subject-line interpolation is safe (plain-text
  // rendering context, not HTML). PR #732 Gemini round 3 SECURITY-HIGH.
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;')
     .replace(/</g, '&lt;')
     .replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;')
     .replace(/'/g, '&#39;');
  const greeting = trimmedName.length > 0 ? escapeHtml(trimmedName) : 'there';
  // Subject lines deliberately avoid the brand word, the phrase
  // "quick question" and other classic survey-spam tells — both push
  // the message into Gmail's Promotions tab. First name when we have
  // it (much higher open rate); engagement-specific so the subject
  // matches what the recipient actually did.
  const firstName = trimmedName.split(/\s+/)[0] ?? '';
  const namePart = firstName.length > 0 ? `, ${firstName}` : '';
  const subject =
    engagement === 'brihaspati'
      ? `How was your Brihaspati reading${namePart}?`
      : engagement === 'both'
      ? `Honest feedback${namePart}?`
      : `Was your kundali useful${namePart}?`;
  const thankYouLine =
    engagement === 'brihaspati'
      ? 'for trusting us with a Brihaspati reading.'
      : engagement === 'both'
      ? 'for using Dekho Panchang and trusting us with a Brihaspati reading.'
      : 'for using Dekho Panchang to create your kundali.';

  const privacyNote =
    engagement === 'chart'
      ? `<p style="margin-top:24px;padding:14px 18px;background:#f5f1e8;border-left:3px solid #d4a853;border-radius:4px;font-size:14px;color:#4a4a4a;"><strong>A note on privacy:</strong> Your birth data and any chart computed from it stay between you and your account. I am only asking about your overall experience with the product.</p>`
      : `<p style="margin-top:24px;padding:14px 18px;background:#f5f1e8;border-left:3px solid #d4a853;border-radius:4px;font-size:14px;color:#4a4a4a;"><strong>A note on privacy:</strong> I never read the content of your Brihaspati question or the reading itself — those stay between you and the system. I am only asking about your overall experience with the product.</p>`;

  const html = `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Helvetica,sans-serif;max-width:560px;margin:32px auto;color:#1a1a1a;line-height:1.6;padding:0 16px;">
  <p style="margin:0 0 16px;">Dear ${greeting},</p>
  <p>Thank you ${thankYouLine} We are building this for people who want Vedic astrology done with precision — and your honest feedback is what shapes what we ship next.</p>
  <p style="margin-top:24px;">One quick question:</p>
  <p style="font-weight:600;margin:16px 0 12px;">On a scale of 0 to 10, how likely are you to recommend Dekho Panchang to a friend or family member?</p>
  <table cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 28px;"><tr>${npsButtonsRow}</tr></table>
  <p>Tap a number above — that&apos;s all I need. If you have 30 seconds more, just hit reply (or email <a href="mailto:${FEEDBACK_INBOX}" style="color:#8a6d2b;">${FEEDBACK_INBOX}</a>) and tell me why you picked that number. I read every reply personally.</p>
  ${privacyNote}
  <p style="margin-top:32px;">— Aditya<br><span style="color:#6a6a6a;font-size:14px;">Founder, Dekho Panchang<br><a href="https://dekhopanchang.com" style="color:#8a6d2b;">dekhopanchang.com</a></span></p>
  ${brihaspatiPostscript(engagement)}
</body>
</html>`;

  return { subject, html };
}

// Re-exported so the cron job and any future ad-hoc sender share the
// same trigger-condition labels.
export type NpsEngagement = Engagement;

// Helper for the trigger query: decides which engagement label applies
// given which trigger fired. Centralised so the route handler stays
// declarative.
export function classifyEngagement(opts: { hasChart: boolean; hasBrihaspati: boolean }): Engagement {
  if (opts.hasChart && opts.hasBrihaspati) return 'both';
  if (opts.hasBrihaspati) return 'brihaspati';
  return 'chart';
}

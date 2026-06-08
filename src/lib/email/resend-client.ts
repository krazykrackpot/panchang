import { Resend } from 'resend';

let _resend: Resend | null = null;

export function getResend(): Resend | null {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  _resend = new Resend(key);
  return _resend;
}

export const EMAIL_FROM = process.env.EMAIL_FROM || 'Dekho Panchang <namaste@dekhopanchang.com>';

/**
 * Optional admin BCC. Set EMAIL_ADMIN_BCC to receive a silent copy of every
 * email this client sends — useful for monitoring NPS / onboarding emails
 * in real time without polling the DB.
 *
 * .trim() because Vercel env vars can carry trailing whitespace/newlines
 * that Resend treats as part of the address and silently rejects.
 */
export const EMAIL_ADMIN_BCC = process.env.EMAIL_ADMIN_BCC?.trim();

export async function sendEmail({
  to,
  subject,
  html,
  bcc,
}: {
  to: string;
  subject: string;
  html: string;
  /**
   * Per-call BCC. If omitted, EMAIL_ADMIN_BCC (env) is used. Pass an
   * explicit empty array `[]` to opt out of the env default for a specific
   * call (e.g. a high-volume system email where the admin doesn't want a
   * copy of every one).
   */
  bcc?: string | string[];
}): Promise<{ success: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) return { success: false, error: 'Email not configured' };

  const effectiveBcc = bcc !== undefined ? bcc : EMAIL_ADMIN_BCC;
  const bccList = Array.isArray(effectiveBcc)
    ? effectiveBcc.filter(Boolean)
    : effectiveBcc
      ? [effectiveBcc]
      : [];

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      ...(bccList.length > 0 ? { bcc: bccList } : {}),
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

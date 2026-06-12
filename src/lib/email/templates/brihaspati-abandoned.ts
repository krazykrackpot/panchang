// Brihaspati abandoned-checkout recovery email.
//
// Sent ~30h after a user opened a Stripe Checkout for a Brihaspati
// question and never completed payment. The Stripe session expires
// after 24h, so by the time this email fires the original link is
// dead — the CTA points at /brihaspati (the panel), where the user
// can re-ask and pay.
//
// Privacy contract: this template MUST NOT quote the user's question
// text. The product is the only place that surfaces Brihaspati Q&A
// content. See feedback_brihaspati_confidentiality.md.

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://dekhopanchang.com').replace(/\/$/, '');

interface BuildArgs {
  displayName: string;
}

export function brihaspatiAbandonedEmail({ displayName }: BuildArgs): { subject: string; html: string } {
  const greeting = displayName.trim() ? `Namaste ${escapeHtml(displayName.trim())},` : 'Namaste,';
  const ctaUrl = `${SITE_ORIGIN}/brihaspati?utm_source=email&utm_medium=transactional&utm_campaign=brihaspati-abandoned`;

  const subject = 'Your Brihaspati reading is waiting';

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#fafaf8;font-family:Georgia,serif;color:#2a2a2a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border-radius:12px;padding:36px 32px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <tr><td>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${greeting}</p>

          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
            You opened a question for Brihaspati but didn't finish the checkout. The reading hasn't been generated yet — you weren't charged.
          </p>

          <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
            If you'd still like an answer, you can come back and ask again whenever feels right. It only takes a minute.
          </p>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr><td style="border-radius:8px;background:#8a6d2b;">
              <a href="${ctaUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;border-radius:8px;">
                Ask Brihaspati
              </a>
            </td></tr>
          </table>

          <p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #ececec;font-size:13px;line-height:1.6;color:#6a6a6a;">
            Not interested? You can ignore this — we only send this nudge once per unfinished checkout.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject, html };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return c;
    }
  });
}

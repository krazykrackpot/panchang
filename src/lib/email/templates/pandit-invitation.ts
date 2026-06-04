/**
 * Pandit CRM — invitation email template.
 *
 * Sent when a Pandit invites a client (existing user OR new sign-up) to
 * link with their practice. The CTA points at /pandit-invitation/[token]
 * which handles both branches: signed-in user sees accept/decline,
 * un-signed-in visitor sees signup-with-token then accept/decline.
 *
 * Spec §5.2 + §5.3.
 */

export interface PanditInvitationEmailArgs {
  panditName: string;
  panditSubtitle?: string;
  panditMessage?: string;
  invitationUrl: string;
  recipientName?: string;
}

export function panditInvitationEmail(args: PanditInvitationEmailArgs): {
  subject: string;
  html: string;
} {
  const subject = `${args.panditName} invites you to connect on Dekho Panchang`;

  const greeting = args.recipientName ? `Namaste ${args.recipientName},` : 'Namaste,';
  const messageBlock = args.panditMessage
    ? `
      <div style="background:#fff8e1;border-left:3px solid #d4a853;padding:14px 16px;margin:20px 0;border-radius:6px">
        <div style="font-size:12px;color:#8a6d2b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px">A note from ${escapeHtml(args.panditName)}</div>
        <div style="color:#4a3a1a;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(args.panditMessage)}</div>
      </div>`
    : '';

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f5f1ea;font-family:Georgia,'Times New Roman',serif">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:12px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">
      <div style="text-align:center;margin-bottom:24px">
        <div style="font-size:32px;color:#d4a853">ॐ</div>
        <div style="font-size:11px;letter-spacing:0.15em;color:#8a6d2b;text-transform:uppercase;margin-top:8px">Dekho Panchang</div>
      </div>

      <h1 style="font-size:22px;color:#2a2030;margin:0 0 16px;text-align:center;font-weight:600">
        ${escapeHtml(args.panditName)} has invited you
      </h1>

      <p style="color:#4a3a4a;font-size:14px;line-height:1.7;margin:0 0 8px">${greeting}</p>
      <p style="color:#4a3a4a;font-size:14px;line-height:1.7;margin:0 0 16px">
        <strong>${escapeHtml(args.panditName)}</strong>${args.panditSubtitle ? ` (${escapeHtml(args.panditSubtitle)})` : ''}
        would like to be your astrologer on Dekho Panchang. Linking lets them share
        readings, tippannis, and reminders for important astrological events
        directly to your dashboard — and lets you keep one place for everything
        they prepare for you.
      </p>

      ${messageBlock}

      <div style="text-align:center;margin:28px 0">
        <a href="${args.invitationUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#d4a853,#a08030);color:#1a1230;text-decoration:none;padding:14px 32px;border-radius:24px;font-weight:600;font-size:14px;letter-spacing:0.02em;box-shadow:0 4px 12px rgba(212,168,83,0.25)">
          Review &amp; respond
        </a>
      </div>

      <p style="color:#7a6a7a;font-size:12px;line-height:1.6;text-align:center;margin:24px 0 0">
        You can accept or decline at any time. If you don't recognise this Pandit,
        you can safely ignore this email. Invitations expire after 30 days.
      </p>
    </div>

    <p style="text-align:center;color:#9a9aaa;font-size:11px;margin:20px 0 0">
      Sent via Dekho Panchang ·
      <a href="https://dekhopanchang.com" style="color:#9a9aaa;text-decoration:underline">dekhopanchang.com</a>
    </p>
  </div>
</body>
</html>`;

  return { subject, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
